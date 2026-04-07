#!/usr/bin/env python3
"""
Arize AX Trace Tree — Full trace visualization

Shows the complete span hierarchy for a specific trace, with timing,
status, token usage, and key attributes.

Usage:
    python3 get_trace.py <trace_id>
    python3 get_trace.py <trace_id> --json
    python3 get_trace.py <trace_id> --hours 168  # Search further back
    python3 get_trace.py <trace_id> --project my-project
"""

import argparse
import json
import sys
from datetime import datetime, timezone, timedelta

from arize_client import (
    ArizeClient, format_duration, format_time, get_span_kind,
    get_span_attr, get_token_counts, DEFAULT_PROJECT_NAME,
)


def build_tree(spans):
    """Build a tree structure from flat span list."""
    by_id = {}
    roots = []

    for span in spans:
        span_id = span.get("context", {}).get("span_id", "")
        by_id[span_id] = {"span": span, "children": []}

    for span in spans:
        span_id = span.get("context", {}).get("span_id", "")
        parent_id = span.get("parent_id", "")
        if parent_id and parent_id in by_id:
            by_id[parent_id]["children"].append(by_id[span_id])
        else:
            roots.append(by_id[span_id])

    # Sort children by start_time
    def sort_children(node):
        node["children"].sort(
            key=lambda n: n["span"].get("start_time", "")
        )
        for child in node["children"]:
            sort_children(child)

    for root in roots:
        sort_children(root)

    roots.sort(key=lambda n: n["span"].get("start_time", ""))
    return roots


def print_tree(node, prefix="", is_last=True, depth=0):
    """Print a tree node and its children with visual tree characters."""
    span = node["span"]
    children = node["children"]

    # Tree connector
    if depth == 0:
        connector = ""
    else:
        connector = "└── " if is_last else "├── "

    # Span info
    name = span.get("name", "?")
    kind = get_span_kind(span)
    status = span.get("status_code", "UNSET")
    duration = format_duration(span.get("start_time", ""), span.get("end_time", ""))

    # Status indicator
    if status == "ERROR":
        status_str = " [ERROR]"
    else:
        status_str = ""

    # Kind badge
    kind_badge = f"[{kind}]"

    print(f"{prefix}{connector}{kind_badge} {name} ({duration}){status_str}")

    # Additional details indented under the node
    child_prefix = prefix + ("    " if is_last or depth == 0 else "│   ")

    # LLM details
    model = get_span_attr(span, "llm.model_name")
    tokens = get_token_counts(span)
    if model:
        print(f"{child_prefix}  model: {model}")
    if tokens:
        parts = []
        if tokens.get("prompt"):
            parts.append(f"prompt={tokens['prompt']}")
        if tokens.get("completion"):
            parts.append(f"completion={tokens['completion']}")
        if tokens.get("total"):
            parts.append(f"total={tokens['total']}")
        print(f"{child_prefix}  tokens: {', '.join(parts)}")

    # Error details
    status_msg = span.get("status_message", "")
    if status_msg:
        msg = status_msg[:300].replace("\n", " ")
        print(f"{child_prefix}  error: {msg}")

    # Input/output preview for leaf nodes or important spans
    if not children or kind in ("LLM", "RETRIEVER"):
        input_val = get_span_attr(span, "input.value", "")
        output_val = get_span_attr(span, "output.value", "")
        if input_val:
            preview = str(input_val)[:120].replace("\n", " ")
            print(f"{child_prefix}  input: {preview}{'...' if len(str(input_val)) > 120 else ''}")
        if output_val:
            preview = str(output_val)[:120].replace("\n", " ")
            print(f"{child_prefix}  output: {preview}{'...' if len(str(output_val)) > 120 else ''}")

    # Print children
    for i, child in enumerate(children):
        is_child_last = (i == len(children) - 1)
        print_tree(child, child_prefix, is_child_last, depth + 1)


def display_trace(trace_id, hours=168, project_name=DEFAULT_PROJECT_NAME,
                  output_json=False):
    client = ArizeClient()

    # Find project
    project = client.find_project(project_name)
    if not project:
        print(f"Project '{project_name}' not found.", file=sys.stderr)
        return False

    project_id = project["id"]
    now = datetime.now(timezone.utc)
    start = now - timedelta(hours=hours)

    # Get all spans for this trace
    spans = client.get_trace_spans(
        project_id, trace_id,
        start_time=start.isoformat(),
        end_time=now.isoformat(),
    )

    if not spans:
        print(f"No spans found for trace {trace_id}")
        print(f"(searched last {hours}h — try --hours 720 for 30 days)")
        return False

    if output_json:
        print(json.dumps(spans, indent=2, default=str))
        return

    # Find trace time range
    start_times = [s.get("start_time", "") for s in spans if s.get("start_time")]
    end_times = [s.get("end_time", "") for s in spans if s.get("end_time")]

    print(f"=== Trace: {trace_id} ===")
    print(f"Spans: {len(spans)}")
    if start_times:
        print(f"Started: {format_time(min(start_times))}")
    if start_times and end_times:
        print(f"Total duration: {format_duration(min(start_times), max(end_times))}")

    # Session and user info from root span
    for s in spans:
        session_id = get_span_attr(s, "session.id")
        user_id = get_span_attr(s, "user.id")
        metadata = get_span_attr(s, "metadata")
        if session_id:
            print(f"Session: {session_id}")
        if user_id:
            print(f"User: {user_id}")
        if metadata:
            try:
                meta = json.loads(metadata) if isinstance(metadata, str) else metadata
                if isinstance(meta, dict):
                    for k, v in meta.items():
                        print(f"  {k}: {v}")
            except (json.JSONDecodeError, TypeError):
                pass
        if session_id or user_id:
            break

    print()

    # Build and display tree
    tree = build_tree(spans)
    for i, root in enumerate(tree):
        print_tree(root)
        if i < len(tree) - 1:
            print()


def main():
    parser = argparse.ArgumentParser(description="Visualize an Arize AX trace tree")
    parser.add_argument("trace_id", help="The trace ID to visualize")
    parser.add_argument("--hours", type=int, default=168, help="Hours to search back (default: 168 = 7 days)")
    parser.add_argument("--project", default=DEFAULT_PROJECT_NAME, help=f"Project name (default: {DEFAULT_PROJECT_NAME})")
    parser.add_argument("--json", dest="output_json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    result = display_trace(
        trace_id=args.trace_id,
        hours=args.hours,
        project_name=args.project,
        output_json=args.output_json,
    )
    if result is False:
        sys.exit(1)


if __name__ == "__main__":
    main()
