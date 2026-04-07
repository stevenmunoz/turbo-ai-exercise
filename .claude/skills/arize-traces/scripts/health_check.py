#!/usr/bin/env python3
"""
Arize AX Health Check — Quick trace overview

Shows total spans, error rate, latency stats, span breakdown by kind,
and recent errors for a project.

Usage:
    python3 health_check.py [--hours 24] [--project my-project]
"""

import argparse
import sys
from datetime import datetime, timezone, timedelta
from collections import Counter

from arize_client import (
    ArizeClient, format_duration, format_time, get_span_kind,
    get_span_attr, get_token_counts, DEFAULT_PROJECT_NAME,
)


def run_health_check(hours=24, project_name=DEFAULT_PROJECT_NAME):
    client = ArizeClient()

    # Find project
    project = client.find_project(project_name)
    if not project:
        print(f"Project '{project_name}' not found.")
        print("Available projects:")
        for p in client.list_projects():
            print(f"  - {p.get('name', '?')} (id: {p.get('id', '?')})")
        return

    project_id = project["id"]
    now = datetime.now(timezone.utc)
    start = now - timedelta(hours=hours)

    print(f"=== Arize AX Health Check ===")
    print(f"Project: {project_name} ({project_id})")
    print(f"Time range: last {hours}h ({format_time(start.isoformat())} to now)")
    print()

    # Query all spans in time range
    spans = client.query_all_spans(
        project_id,
        start_time=start.isoformat(),
        end_time=now.isoformat(),
        max_spans=500,
    )

    if not spans:
        print("No spans found in this time range.")
        return

    # Compute stats
    total = len(spans)
    errors = [s for s in spans if s.get("status_code") == "ERROR"]
    error_rate = len(errors) / total * 100 if total else 0

    # Duration stats
    durations_ms = []
    for s in spans:
        try:
            st = datetime.fromisoformat(s["start_time"].replace("Z", "+00:00"))
            et = datetime.fromisoformat(s["end_time"].replace("Z", "+00:00"))
            durations_ms.append((et - st).total_seconds() * 1000)
        except (KeyError, ValueError, TypeError):
            pass

    # Span kind breakdown
    kind_counts = Counter(get_span_kind(s) for s in spans)

    # Token usage (LLM spans only)
    total_prompt_tokens = 0
    total_completion_tokens = 0
    llm_span_count = 0
    for s in spans:
        tokens = get_token_counts(s)
        if tokens:
            llm_span_count += 1
            total_prompt_tokens += tokens.get("prompt") or 0
            total_completion_tokens += tokens.get("completion") or 0

    # Print summary
    print(f"--- Summary ---")
    print(f"Total spans:    {total}")
    print(f"Errors:         {len(errors)} ({error_rate:.1f}%)")
    if durations_ms:
        sorted_ms = sorted(durations_ms)
        p50 = sorted_ms[len(sorted_ms) // 2]
        p95 = sorted_ms[int(len(sorted_ms) * 0.95)]
        print(f"Latency avg:    {sum(durations_ms) / len(durations_ms):.0f}ms")
        print(f"Latency p50:    {p50:.0f}ms")
        print(f"Latency p95:    {p95:.0f}ms")
        print(f"Latency max:    {max(durations_ms):.0f}ms")
    print()

    print(f"--- Spans by Kind ---")
    for kind, count in kind_counts.most_common():
        print(f"  {kind:12s}  {count}")
    print()

    if llm_span_count > 0:
        print(f"--- Token Usage ({llm_span_count} LLM spans) ---")
        print(f"  Prompt tokens:     {total_prompt_tokens:,}")
        print(f"  Completion tokens: {total_completion_tokens:,}")
        print(f"  Total tokens:      {total_prompt_tokens + total_completion_tokens:,}")
        print()

    if errors:
        print(f"--- Recent Errors (showing up to 10) ---")
        for err in errors[:10]:
            name = err.get("name", "?")
            kind = get_span_kind(err)
            status_msg = err.get("status_message", "")
            time_str = format_time(err.get("start_time"))
            duration = format_duration(err.get("start_time", ""), err.get("end_time", ""))
            trace_id = err.get("context", {}).get("trace_id", "?")

            print(f"  [{time_str}] {name} ({kind}) - {duration}")
            if status_msg:
                print(f"    Message: {status_msg[:200]}")
            print(f"    Trace: {trace_id}")
            print()
    else:
        print("No errors found. All clear!")


def main():
    parser = argparse.ArgumentParser(description="Arize AX trace health check")
    parser.add_argument("--hours", type=int, default=24, help="Hours to look back (default: 24)")
    parser.add_argument("--project", default=DEFAULT_PROJECT_NAME, help=f"Project name (default: {DEFAULT_PROJECT_NAME})")
    args = parser.parse_args()

    run_health_check(hours=args.hours, project_name=args.project)


if __name__ == "__main__":
    main()
