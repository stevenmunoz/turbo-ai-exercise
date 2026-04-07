#!/usr/bin/env python3
"""
Arize AX REST API Client

Zero-dependency client using Python stdlib (urllib.request + json).
Authenticates via ARIZE_API_KEY environment variable.

API Reference: https://api.arize.com/v2/spec.yaml
"""

import json
import os
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

BASE_URL = "https://api.arize.com/v2"
DEFAULT_PROJECT_NAME = os.environ.get("ARIZE_PROJECT_NAME", "my-project")


def _get_ssl_context():
    """Get SSL context, using certifi if available (needed on macOS)."""
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


def _load_env():
    """Load .env file from the skill directory if present."""
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                if key and value:
                    os.environ.setdefault(key, value)


def _get_api_key():
    """Get the Arize API key from environment."""
    _load_env()
    key = os.environ.get("ARIZE_API_KEY", "").strip()
    if not key:
        print("Error: ARIZE_API_KEY not found.", file=sys.stderr)
        print("Create .claude/skills/arize-traces/.env with:", file=sys.stderr)
        print("  ARIZE_API_KEY=your_key_here", file=sys.stderr)
        sys.exit(1)
    return key


class ArizeClient:
    """Client for the Arize AX REST API v2."""

    def __init__(self, api_key=None):
        self.api_key = api_key or _get_api_key()
        self.base_url = BASE_URL

    def _request(self, method, path, body=None, params=None):
        """Make an authenticated request to the Arize API."""
        url = f"{self.base_url}{path}"
        if params:
            query = urllib.parse.urlencode(
                {k: v for k, v in params.items() if v is not None}
            )
            if query:
                url = f"{url}?{query}"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        data = json.dumps(body).encode("utf-8") if body else None
        req = urllib.request.Request(url, data=data, headers=headers, method=method)

        try:
            ctx = _get_ssl_context()
            with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body_text = e.read().decode("utf-8", errors="replace")
            if e.code == 401:
                print("Error: 401 Unauthorized. Your ARIZE_API_KEY may be invalid.", file=sys.stderr)
                print("Generate a User API Key at: https://app.arize.com → Settings → API Keys", file=sys.stderr)
            elif e.code == 403:
                print("Error: 403 Forbidden. Your API key lacks permissions for this operation.", file=sys.stderr)
            elif e.code == 429:
                print("Error: 429 Rate Limited. Wait and retry.", file=sys.stderr)
            else:
                print(f"Error: HTTP {e.code} from Arize API", file=sys.stderr)
                print(f"Response: {body_text[:500]}", file=sys.stderr)
            return None
        except urllib.error.URLError as e:
            print(f"Error: Cannot reach Arize API: {e.reason}", file=sys.stderr)
            return None

    def list_projects(self, limit=50):
        """List all projects accessible to this API key."""
        result = self._request("GET", "/projects", params={"limit": limit})
        if result is None:
            return []
        return result.get("data", result.get("projects", []))

    def find_project(self, name=DEFAULT_PROJECT_NAME):
        """Find a project by name. Returns project dict or None."""
        projects = self.list_projects(limit=100)
        for project in projects:
            if project.get("name") == name:
                return project
        return None

    def query_spans(self, project_id, start_time=None, end_time=None,
                    filter_expr=None, limit=50, cursor=None):
        """
        Query spans from a project.

        Args:
            project_id: Arize project ID
            start_time: ISO 8601 start time (default: 24h ago)
            end_time: ISO 8601 end time (default: now)
            filter_expr: Arize filter expression (e.g., "status_code = 'ERROR'")
            limit: Max spans to return (max 500)
            cursor: Pagination cursor from previous response
        """
        now = datetime.now(timezone.utc)
        if not end_time:
            end_time = now.isoformat()
        if not start_time:
            start_time = (now - timedelta(hours=24)).isoformat()

        body = {
            "project_id": project_id,
            "start_time": start_time,
            "end_time": end_time,
        }
        if filter_expr:
            body["filter"] = filter_expr

        params = {"limit": min(limit, 500)}
        if cursor:
            params["cursor"] = cursor

        result = self._request("POST", "/spans", body=body, params=params)
        if result is None:
            return {"data": [], "pagination": {}}
        return result

    def query_all_spans(self, project_id, start_time=None, end_time=None,
                        filter_expr=None, max_spans=500):
        """Query spans with automatic pagination up to max_spans."""
        all_spans = []
        cursor = None
        remaining = max_spans

        while remaining > 0:
            batch_size = min(remaining, 500)
            result = self.query_spans(
                project_id, start_time, end_time, filter_expr,
                limit=batch_size, cursor=cursor
            )
            spans = result.get("spans", result.get("data", []))
            all_spans.extend(spans)
            remaining -= len(spans)

            pagination = result.get("pagination", {})
            if not pagination.get("has_more") or not pagination.get("next_cursor"):
                break
            cursor = pagination["next_cursor"]

        return all_spans

    def get_trace_spans(self, project_id, trace_id, start_time=None, end_time=None):
        """Get all spans belonging to a specific trace."""
        filter_expr = f"context.trace_id = '{trace_id}'"
        return self.query_all_spans(
            project_id, start_time, end_time,
            filter_expr=filter_expr, max_spans=500
        )


def format_duration(start_time_str, end_time_str):
    """Calculate duration between two ISO timestamps."""
    try:
        start = datetime.fromisoformat(start_time_str.replace("Z", "+00:00"))
        end = datetime.fromisoformat(end_time_str.replace("Z", "+00:00"))
        delta = end - start
        ms = delta.total_seconds() * 1000
        if ms < 1000:
            return f"{ms:.0f}ms"
        elif ms < 60000:
            return f"{ms/1000:.1f}s"
        else:
            return f"{ms/60000:.1f}m"
    except (ValueError, TypeError):
        return "?"


def format_time(iso_str):
    """Format an ISO timestamp for display."""
    try:
        dt = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d %H:%M:%S UTC")
    except (ValueError, TypeError):
        return iso_str or "?"


def get_span_attr(span, key, default=None):
    """Safely get an attribute from a span's attributes dict."""
    attrs = span.get("attributes", {})
    return attrs.get(key, default)


def get_span_kind(span):
    """Get the OpenInference span kind."""
    return get_span_attr(span, "openinference.span.kind", span.get("kind", "UNKNOWN"))


def get_token_counts(span):
    """Extract LLM token counts from span attributes."""
    attrs = span.get("attributes", {})
    prompt = attrs.get("llm.token_count.prompt")
    completion = attrs.get("llm.token_count.completion")
    total = attrs.get("llm.token_count.total")
    if any(v is not None for v in [prompt, completion, total]):
        return {
            "prompt": _to_int(prompt),
            "completion": _to_int(completion),
            "total": _to_int(total),
        }
    return None


def _to_int(val):
    """Safely convert a value to int (API may return strings)."""
    if val is None:
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None
