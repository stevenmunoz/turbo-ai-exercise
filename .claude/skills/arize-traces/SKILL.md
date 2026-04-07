---
name: arize-traces
description: Query and analyze Arize AX traces for LLM observability. Use this skill when debugging LLM issues, checking trace health, investigating errors, or analyzing token usage. Supports the AX CLI (preferred) and custom REST API scripts (fallback). Only applicable to projects using Arize for LLM observability.
---

# Arize AX Traces

## Overview

This skill enables proactive trace inspection from Arize AX. Use it to debug LLM issues, monitor error rates, investigate specific traces, and analyze token consumption.

Two tools are available — try the **AX CLI first**, fall back to **Python scripts** if the CLI is unavailable.

## Setup

### API Key (Required for both tools)

Get an Arize User API Key from https://app.arize.com → Settings → API Keys → Generate Key.

Create `.claude/skills/arize-traces/.env`:
```
ARIZE_API_KEY=your_user_api_key_here
```

### AX CLI (Preferred)

```bash
pip install arize-ax-cli
```

**Profile setup** (non-interactive — references the env var):
```bash
mkdir -p ~/.arize
cat > ~/.arize/config.toml << 'EOF'
[profile]
name = "default"

[auth]
api_key = "${ARIZE_API_KEY}"

[output]
format = "json"
EOF
```

Or use the interactive wizard: `ax profiles create`

**Note**: The `ax` binary may be installed at `~/.local/bin/ax` or `~/Library/Python/3.13/bin/ax`. If `ax` is not on PATH, use the full path.

**Resolve project ID** (needed for all CLI commands):
```bash
ax projects list -o json
# Find your project and note its ID
```

> **Note**: The AX CLI is a developer preview (v0.2.x). If a command fails or isn't available, fall back to the Python scripts below.

### Python Scripts (Fallback)

Scripts use Python stdlib only (no pip install needed). They read the API key from `.claude/skills/arize-traces/.env` automatically.

---

## AX CLI Commands (Preferred)

All commands require a `PROJECT_ID`. Get it once with `ax projects list -o json`.

Output formats: `--output table` (default), `--output json`, `--output csv`, `--output parquet`, or a file path.

### List Spans

```bash
# Recent spans (default: 15)
ax spans list <PROJECT_ID> -o json

# Last 24 hours, up to 100 spans
ax spans list <PROJECT_ID> --start-time "2026-03-05T00:00:00Z" --limit 100 -o json

# Filter by status
ax spans list <PROJECT_ID> --filter "status_code = 'ERROR'" -o json

# Filter by latency
ax spans list <PROJECT_ID> --filter "latency_ms > 5000" -o json

# Paginate through results
ax spans list <PROJECT_ID> --limit 50 --cursor <cursor_from_previous_call> -o json
```

### List Traces

```bash
# Recent traces
ax traces list <PROJECT_ID> -o json

# Error traces
ax traces list <PROJECT_ID> --filter "status_code = 'ERROR'" -o json

# Slow traces
ax traces list <PROJECT_ID> --filter "latency_ms > 10000" -o json
```

### Projects

```bash
ax projects list -o json          # List all projects
ax projects get <PROJECT_ID>      # Get project details
```

### Datasets

```bash
ax datasets list -o json                    # List datasets
ax datasets get <DATASET_ID> -o json        # Get dataset details
ax datasets list_examples <DATASET_ID>      # List examples in a dataset
```

### Experiments

```bash
ax experiments list -o json                           # List all experiments
ax experiments list --dataset-id <DATASET_ID> -o json # Filter by dataset
ax experiments get <EXPERIMENT_ID> -o json             # Get experiment details
ax experiments list_runs <EXPERIMENT_ID> -o json       # List experiment runs
```

**When to use the CLI**: For quick queries, exporting data to files, and accessing experiments/datasets (which the scripts don't support).

---

## Python Scripts (Fallback)

Use these when the AX CLI is not installed or when you need the unique features they provide (health aggregation, ASCII trace tree visualization).

### 1. Health Check — Quick trace overview

Get a snapshot of recent trace health: error rates, latency percentiles (p50/p95), volume by span kind, and token usage.

```bash
python3 .claude/skills/arize-traces/scripts/health_check.py --hours 24
python3 .claude/skills/arize-traces/scripts/health_check.py --hours 168  # Last week
```

**When to use**: Start here when investigating any LLM issue. Gives you the lay of the land before diving deeper. The CLI doesn't compute aggregates — this script does.

### 2. Error Investigation — Find and inspect failures

Query spans with ERROR status to identify what's failing and why.

```bash
# All errors in last 24 hours
python3 .claude/skills/arize-traces/scripts/query_traces.py --filter "status_code = 'ERROR'" --hours 24

# Errors in LLM spans only
python3 .claude/skills/arize-traces/scripts/query_traces.py --filter "status_code = 'ERROR'" --kind LLM --hours 24

# Errors in a specific function
python3 .claude/skills/arize-traces/scripts/query_traces.py --filter "status_code = 'ERROR'" --name <functionName> --hours 48
```

**When to use**: After health check reveals errors, or when a user reports a specific failure. The `--kind` and `--name` filters are unique to this script.

### 3. Trace Deep Dive — Full trace tree

Visualize the complete span hierarchy for a specific trace, showing timing, status, and key attributes as an ASCII tree.

```bash
python3 .claude/skills/arize-traces/scripts/get_trace.py <trace_id>
```

**When to use**: After finding a problematic span via query, get the full context of what happened in that request. The CLI returns flat JSON — this script builds a visual tree.

### 4. Token Usage Analysis — LLM cost inspection

Query LLM spans to analyze token consumption patterns.

```bash
# All LLM spans in last 24 hours
python3 .claude/skills/arize-traces/scripts/query_traces.py --kind LLM --hours 24

# LLM spans with JSON output for detailed analysis
python3 .claude/skills/arize-traces/scripts/query_traces.py --kind LLM --hours 24 --json
```

**When to use**: When investigating cost spikes or unexpected token usage patterns.

---

## CLI vs Scripts — Quick Reference

| Need | Use CLI | Use Script |
|------|---------|------------|
| List/filter spans | `ax spans list` | `query_traces.py` (adds `--kind`, `--name` filters) |
| List traces | `ax traces list` | N/A |
| Health aggregation (error rate, p50/p95, tokens) | N/A | `health_check.py` |
| Trace tree visualization | N/A | `get_trace.py` |
| Export to CSV/Parquet | `ax spans list -o csv` | N/A |
| Datasets & Experiments | `ax datasets`, `ax experiments` | N/A |

## Span Kinds

| Kind | What it represents |
|------|-------------------|
| `CHAIN` | Workflow entry points and processing steps |
| `LLM` | LLM API calls with model, tokens, messages |
| `RETRIEVER` | Data fetching (health records, text extraction) |
| `TOOL` | Individual operations (auth, file I/O, DB queries) |

## Key Attributes on Spans

- `openinference.span.kind` — Span type (CHAIN/LLM/TOOL/RETRIEVER)
- `input.value` / `output.value` — Span input and output
- `llm.model_name` — Model used (e.g., `gpt-4o`)
- `llm.token_count.prompt` / `.completion` / `.total` — Token counts
- `llm.input_messages.N.message.role` / `.content` — LLM messages
- `session.id` — Conversation or document session
- `user.id` — User identifier
- `metadata` — JSON with additional context

## Troubleshooting

- **"ARIZE_API_KEY not found"**: Create `.claude/skills/arize-traces/.env` with your key
- **401 Unauthorized**: The API key may be invalid or expired. Generate a new User API Key from Arize console
- **SSL CERTIFICATE_VERIFY_FAILED** (macOS): Set the cert bundle before running CLI commands:
  ```bash
  export SSL_CERT_FILE=$(python3 -c "import certifi; print(certifi.where())")
  ```
  Add this to your shell profile (`~/.zshrc`) to make it permanent.
- **"Profile not found"**: Run the non-interactive profile setup from the Setup section above, or `ax profiles create`
- **Empty results**: Check the time range (--hours). Traces are retained for 90 days in Arize
- **"Project not found"**: Verify your project name with `ax projects list -o json` or `health_check.py`
