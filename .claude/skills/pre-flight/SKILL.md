---
name: pre-flight
description: "Run all quality checks before creating a PR or deploying. Use when the user says 'pre-flight', 'run checks', 'quality gate', 'check before PR', 'lint and test', or before any deployment. Called automatically by the create-pr skill."
---

# Pre-Flight Quality Gate

Run all quality checks before creating a PR or deploying.

## Checks

### Blocking (must pass)

1. **Python linting:**
   ```bash
   cd backend && python -m ruff check src/ functions/
   ```

2. **Python formatting:**
   ```bash
   cd backend && python -m black --check src/ functions/
   ```

3. **Python type checking:**
   ```bash
   cd backend && python -m mypy src/
   ```

4. **Backend tests:**
   ```bash
   cd backend && python -m pytest tests/ -x --tb=short
   ```

5. **Frontend build:**
   ```bash
   cd web && npm run build
   ```

6. **No secrets in staged files:**
   ```bash
   git diff --cached --name-only | xargs grep -l "sk-\|PRIVATE_KEY\|password.*=.*['\"]" || true
   ```

### Advisory (report but don't block)

7. **Test coverage:**
   ```bash
   cd backend && python -m pytest tests/ --cov=src --cov-report=term-missing
   ```

8. **Documentation current:**
   - Check if AGENTS.md mentions all Cloud Functions registered in `backend/functions/main.py`
   - Check if new endpoints have corresponding handlers

## Output

Report each check as PASS/FAIL/WARN with details for failures.

| Check | Status | Details |
|-------|--------|---------|
| Linting | PASS/FAIL | Error details |
| Formatting | PASS/FAIL | Files to format |
| Type check | PASS/FAIL | Type errors |
| Tests | PASS/FAIL | Failed tests |
| Build | PASS/FAIL | Build errors |
| Secrets | PASS/FAIL | Flagged files |
| Coverage | INFO | Coverage % |
| Docs | INFO | Missing docs |
