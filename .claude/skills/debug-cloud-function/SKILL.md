---
name: debug-cloud-function
description: "Debug Firebase Cloud Functions using log-first methodology. Use when a Cloud Function returns errors, times out, produces unexpected results, or when the user says 'debug function', 'function not working', 'function error', 'check logs', or 'why is this function failing'."
---

# Debug Cloud Function

Log-first methodology for debugging Firebase Cloud Functions.

## Safety Principle

> Never modify code until the root cause is identified. Read logs first, reproduce locally second, then fix with confidence.

## Workflow

### Step 1: Identify the Function

Determine which function is failing and its entry point in `backend/functions/main.py`.

### Step 2: Read Logs (Always First)

```bash
# Emulator logs (local)
tail -50 logs/firebase.log

# Production logs
firebase functions:log --only <functionName> --limit 50
```

Look for:
- `ImportError` or `ModuleNotFoundError` — dependency or path issue
- `TypeError` or `AttributeError` — code bug
- `DEADLINE_EXCEEDED` — timeout (optimize or increase limit)
- `PERMISSION_DENIED` — Firestore rules or IAM issue
- Container initialization errors

### Step 3: Reproduce Locally

```bash
# Start emulator
firebase emulators:start --only functions,firestore

# Test the function
curl -X POST http://localhost:5001/<project-id>/us-central1/<functionName> \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Step 4: Trace the Data Chain

Follow the Clean Architecture path:
1. **Handler** (`functions/handlers/http_handlers.py`) — Is the request parsed correctly?
2. **Container** (`src/infrastructure/container.py`) — Is the container initializing?
3. **Use Case** (`src/application/use_cases/`) — Is business logic correct?
4. **Repository** (`src/infrastructure/repositories.py`) — Is Firestore query right?
5. **Firestore** — Does the data exist? Is the schema correct?

### Step 5: Fix and Verify

Apply the fix, then:
```bash
# Test locally
curl -s http://localhost:5001/<project-id>/us-central1/<functionName>

# Run related tests
cd backend && python -m pytest tests/ -k "<test_name>" -v
```

## Common Root Causes

| Error | Cause | Fix |
|-------|-------|-----|
| `ModuleNotFoundError` | Missing from `functions/requirements.txt` | Add dependency |
| Container init fails | Import error in a dependency | Check all imports in container.py |
| Empty response | Use case returns None | Add null checks and logging |
| `DEADLINE_EXCEEDED` | Cold start + slow query | Optimize container init, add DB indexes |
| `PERMISSION_DENIED` | Firestore rules block access | Check `firestore.rules` |
| Inconsistent data | Missing field in Firestore doc | Add default values in mapper |
