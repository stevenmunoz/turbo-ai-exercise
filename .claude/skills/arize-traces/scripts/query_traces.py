#!/usr/bin/env python3
"""
Arize AX Trace Query — Flexible span querying with filters

Query spans from a project with time range, status filters, span kind,
and name filters.

Usage:
    python3 query_traces.py [--filter "status_code = 'ERROR'"] [--hours 24] [--limit 50]
    python3 query_traces.py --kind LLM --hours 48
    python3 query_traces.py --name <functionName> --hours 24
    python3 query_traces.py --json  # Machine-readable output
    python3 query_traces.py --project my-project  # Specify project
"""

import argparse
import json
import sys
from datetime import datetime, timezone, timedelta

from arize_client import (
    ArizeClient, format_duration, format_time, get_span_kind,
    get_span_attr, get_token_counts, DEFAULT_PROJECT_NAME,
)


def query_and_display(hours=24, filter_expr=None, kind=None, name=None,
                      limit=50, project_name=DEFAULT_PROJECT_NAME,
                      output_json=False):
    client = ArizeClient()

    # Find project
    project = client.find_project(project_name)
    if not project:
        print(f"Project '{project_name}' not found.", file=sys.stderr)
        return

    project_id = project["id"]
    now = datetime.now(timezone.utc)
    start = now - timedelta(hours=hours)

    # Build filter expression
    filters = []
    if filter_expr:
        filters.append(filter_expr)

    combined_filter = " AND ".join(filters) if filters else None

    # Query spans
    spans = client.query_all_spans(
        project_id,
        start_time=start.isoformat(),
        end_time=now.isoformat(),
        filter_expr=combined_filter,
        max_spans=limit,
    )

    if not spans:
        print("No spans found matching your query.")
        return

    # Post-filter by kind and name (client-side since API filter syntax may vary)
    fetched_count = len(spans)
    if kind:
        kind_upper = kind.upper()
        spans = [s for s in spans if get_span_kind(s).upper() == kind_upper]

    if name:
        name_lower = name.lower()
        spans = [s for s in spans if name_lower in s.get("name", "").lower()]

    if not spans:
        print("No spans found after filtering.")
        if fetched_count == limit:
            print(f"(fetched {fetched_count} spans before client-side filtering — try increasing --limit)")
        return

    # JSON output
    if output_json:
        print(json.dumps(spans, indent=2, default=str))
        return

    # Formatted output
    filtered_note = ""
    if (kind or name) and len(spans) < fetched_count and fetched_count == limit:
        filtered_note = f" (filtered from {fetched_count} fetched — increase --limit for more)"
    print(f"Found {len(spans)} spans (last {hours}h, project: {project_name}){filtered_note}")
    print(f"{'='*80}")
    print()

    for i, span in enumerate(spans):
        span_name = span.get("name", "?")
        span_kind = get_span_kind(span)
        status = span.get("status_code", "UNSET")
        trace_id = span.get("context", {}).get("trace_id", "?")
        span_id = span.get("context", {}).get("span_id", "?")
        parent_id = span.get("parent_id", "")
        duration = format_duration(span.get("start_time", ""), span.get("end_time", ""))
        time_str = format_time(span.get("start_time"))

        # Status indicator
        status_icon = "OK" if status == "OK" else ("ERR" if status == "ERROR" else "---")

        print(f"[{i+1}] {span_name}")
        print(f"    Kind: {span_kind}  |  Status: {status_icon}  |  Duration: {duration}")
        print(f"    Time: {time_str}")
        print(f"    Trace: {trace_id}")
        print(f"    Span:  {span_id}", end="")
        if parent_id:
            print(f"  (parent: {parent_id})", end="")
        print()

        # LLM-specific info
        model = get_span_attr(span, "llm.model_name")
        tokens = get_token_counts(span)
        if model:
            print(f"    Model: {model}")
        if tokens:
            parts = []
            if tokens.get("prompt"):
                parts.append(f"prompt={tokens['prompt']}")
            if tokens.get("completion"):
                parts.append(f"completion={tokens['completion']}")
            if tokens.get("total"):
                parts.append(f"total={tokens['total']}")
            print(f"    Tokens: {', '.join(parts)}")

        # Input/Output preview
        input_val = get_span_attr(span, "input.value", "")
        output_val = get_span_attr(span, "output.value", "")
        if input_val:
            preview = str(input_val)[:150].replace("\n", " ")
            print(f"    Input: {preview}{'...' if len(str(input_val)) > 150 else ''}")
        if output_val:
            preview = str(output_val)[:150].replace("\n", " ")
            print(f"    Output: {preview}{'...' if len(str(output_val)) > 150 else ''}")

        # Error message
        status_msg = span.get("status_message", "")
        if status_msg:
            print(f"    Error: {status_msg[:300]}")

        print()


def main():
    parser = argparse.ArgumentParser(description="Query Arize AX traces")
    parser.add_argument("--filter", dest="filter_expr", help="Arize filter expression (e.g., \"status_code = 'ERROR'\")")
    parser.add_argument("--hours", type=int, default=24, help="Hours to look back (default: 24)")
    parser.add_argument("--limit", type=int, default=50, help="Max spans to fetch from API (default: 50, max: 500)")
    parser.add_argument("--kind", help="Filter by span kind: LLM, CHAIN, TOOL, RETRIEVER (client-side filter)")
    parser.add_argument("--name", help="Filter by span name, case-insensitive contains (client-side filter)")
    parser.add_argument("--project", default=DEFAULT_PROJECT_NAME, help=f"Project name (default: {DEFAULT_PROJECT_NAME})")
    parser.add_argument("--json", dest="output_json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    query_and_display(
        hours=args.hours,
        filter_expr=args.filter_expr,
        kind=args.kind,
        name=args.name,
        limit=args.limit,
        project_name=args.project,
        output_json=args.output_json,
    )


if __name__ == "__main__":
    main()
