# Create Pull Request

Create a pull request with pre-flight quality checks.

## Workflow

### Step 1: Pre-Flight Quality Gate

Run all quality checks before creating the PR:

```bash
# Backend checks (if backend/ changed)
cd backend && python -m ruff check src/ && python -m black --check src/ && python -m mypy src/

# Frontend checks (if web/ changed)
cd web && npm run lint && npm run type-check

# Run tests
cd backend && python -m pytest tests/ -x --tb=short
cd web && npm test -- --watchAll=false
```

If any check fails, fix the issues before proceeding. Do NOT skip checks.

### Step 2: Stage and Commit

- Review all changes with `git diff` and `git status`
- Stage relevant files (never stage `.env`, credentials, or secrets)
- Create a commit with a clear, conventional message

### Step 3: Push

```bash
git push -u origin $(git branch --show-current)
```

### Step 4: Create PR

```bash
gh pr create --title "<concise title>" --body "$(cat <<'EOF'
## Summary
- <bullet points describing changes>

## Test Plan
- [ ] <how to verify the changes>

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] No secrets committed
EOF
)"
```

### Step 5: Output

Return the PR URL.
