---
name: deploy-function
description: "Safely deploy Firebase Cloud Functions with pre-deploy validation and post-deploy verification. Use when the user asks to 'deploy', 'push to production', 'deploy function', 'ship functions', or needs to deploy Cloud Functions to staging or production."
---

# Deploy Cloud Function

Safely deploy Firebase Cloud Functions with validation.

## Workflow

### Step 1: Pre-Deploy Validation

```bash
# Verify Python syntax and imports
cd backend/functions && python -c "import main"

# Run pre-flight checks
# (invoke pre-flight skill)
```

If validation fails, stop and fix issues.

### Step 2: Identify Functions to Deploy

- If specific function names given, deploy only those
- Otherwise deploy all functions

```bash
# List current functions
firebase functions:list
```

### Step 3: Deploy

```bash
# Deploy specific function
firebase deploy --only functions:functionName

# Or deploy all functions
firebase deploy --only functions
```

### Step 4: Post-Deploy Verification

```bash
# Check for startup errors (wait 30s for cold start)
firebase functions:log --limit 20

# Hit health endpoint
curl -s https://us-central1-<project-id>.cloudfunctions.net/health
```

### Step 5: Report

Output a structured deploy report:

```
## Deploy Report — [function name(s)]

| Check | Status | Details |
|-------|--------|---------|
| Pre-deploy validation | PASS/FAIL | Import check result |
| Pre-flight checks | PASS/FAIL | Quality gate result |
| Deployment | PASS/FAIL | Firebase deploy output |
| Startup logs | PASS/FAIL | Any errors in first 20 log lines |
| Health check | PASS/FAIL | Endpoint response |

### Rollback
If issues found: `firebase functions:delete <functionName>` then redeploy previous version.
```

## Common Deployment Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| Missing dependency | `ModuleNotFoundError` in logs | Add to `functions/requirements.txt` |
| Import path error | `ImportError` at startup | Check `sys.path` in handlers |
| Memory exceeded | Function crashes silently | Increase memory in `firebase.json` |
| Timeout | Function killed after 60s | Increase timeout or optimize code |
| Secret not found | `KeyError` for env var | Set via `firebase functions:secrets:set` |
