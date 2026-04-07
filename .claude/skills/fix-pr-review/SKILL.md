---
name: fix-pr-review
description: "Review and fix issues from Claude Code bot PR review comments. Use when the user asks to fix PR comments, address PR review, handle review feedback, or resolve code review issues. Monitors a PR for Claude bot review comments, evaluates each issue, applies the most important fixes, then posts a structured response comment summarizing all changes."
---

# Fix PR Review Comments

Systematic workflow to triage, fix, and respond to automated Claude Code review comments on a Pull Request.

## Safety Principle

> Be judicious. Not every review comment warrants a code change. Evaluate each issue on merit, fix what matters, skip what doesn't, and always justify your decisions.

## Triggering

This skill activates when:
- User says "fix PR comments", "fix PR review", "address review feedback", "handle review issues"
- User provides a PR URL or number with review comments to address
- User asks to respond to Claude bot review on a PR

## Workflow

Execute these 5 phases in order.

### Phase 1: Fetch Review Comments

1. Get the PR number from the user (or extract from URL)
2. **Identify the correct bot** — this is critical:

   #### Bot Identification (MUST READ)

   | Bot | Login | Source | What It Does |
   |-----|-------|--------|-------------|
   | **Claude Code Review** (CI) | `claude[bot]` | GitHub Actions workflow `Claude Code Review` | Posts structured code review with numbered bugs. **THIS IS THE ONE WE FIX.** |
   | Other bots | Various | Various | Dependabot, CI status, etc. **IGNORE.** |

3. Fetch comments specifically from `claude[bot]`:
   ```bash
   gh api repos/{owner}/{repo}/issues/{PR_NUMBER}/comments \
     --jq '.[] | select(.user.login == "claude[bot]") | {body: .body}'
   ```
4. If no `claude[bot]` comments exist yet, check if the CI workflow is still running:
   ```bash
   gh run list --branch {BRANCH} --workflow "Claude Code Review" --limit 1
   ```
   If still running, wait for it. If completed with no comments, inform the user.
5. Parse each individual issue from the `claude[bot]` review comments

### Phase 2: Triage Issues

For each issue identified, classify it:

**Severity Classification:**

| Severity | Criteria | Action |
|----------|----------|--------|
| **Critical** | Race conditions, security vulnerabilities, data loss risks, runtime crashes | **Must fix** |
| **Important** | Deprecated APIs, missing error handling, performance risks | **Should fix** |
| **Minor** | Dead code, unused fields, redundant types, style inconsistencies | **Fix if quick** |
| **Skip** | False positives, operational concerns (not code bugs), extremely low-value cosmetic changes | **Skip with justification** |

**Before classifying, verify each issue:**
- Read the actual code being referenced
- Check if the reviewer's claim is accurate (watch for false positives)
- Assess real-world impact — would this actually cause problems?

### Phase 3: Apply Fixes

Work through issues in severity order (Critical first, then Important, then Minor).

**For each fix:**
1. Read the relevant file(s) first
2. Make the minimal change needed — surgical fixes, not refactors
3. Ensure the fix doesn't break anything adjacent
4. If a fix requires test changes, update tests too

**Fix patterns for common issues:**

| Issue Type | Fix Pattern |
|-----------|-------------|
| Race condition | Use transactions or atomic operations |
| Missing Firestore index | Add to `firestore.indexes.json` |
| Deprecated API | Replace with current equivalent |
| Dead code / unused fields | Remove cleanly, update all consumers |
| Missing error handling | Add try/except with proper error response |
| Type safety violation | Add proper type hints or fix type errors |

**Rules:**
- NEVER apply a fix without reading the code first
- NEVER make speculative fixes — each change must address a specific, verified issue
- If a fix touches types or interfaces, grep for all consumers and update them

### Phase 4: Verify

After all fixes are applied:

1. **Build verification** (run both if files changed in both):
   ```bash
   cd backend && python -c "import functions.main"
   cd web && npm run build
   ```

2. **Test verification**:
   ```bash
   cd backend && python -m pytest tests/ -v
   cd web && npm test -- --watchAll=false
   ```

3. If builds or tests fail, fix the failures before proceeding.

4. **Commit all fixes in a single commit:**
   ```bash
   git add <specific-files>
   git commit -m "fix: Address PR review findings for <feature>

   - <summary of each fix applied>

   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
   ```

5. Push to the branch:
   ```bash
   git push origin <branch>
   ```

### Phase 5: Post Response Comment

Post a structured response comment on the PR using `gh pr comment`:

```markdown
## Review Response — Issues Addressed

Reviewed all N issues. Applied fixes for X, skipped Y with justification.

### Fixed

| # | Issue | Fix | Commit |
|---|-------|-----|--------|
| 1 | **Issue title** (Severity) | What was changed | `abc1234` |
| 2 | ... | ... | ... |

### Skipped (with justification)

| # | Issue | Why Skipped |
|---|-------|-------------|
| N | Issue title | Reason (false positive, operational concern, low value, etc.) |

### Verification

- Backend build: pass/fail/N/A
- Frontend build: pass/fail/N/A
- Backend tests: **N passed**
- Frontend tests: **N passed**
- **Total: N tests passing**
```

Use `gh pr comment <PR_NUMBER> --body "$(cat <<'EOF' ... EOF)"` to post.

## Decision Framework

When deciding whether to fix or skip an issue:

**Fix when:**
- The issue could cause a runtime error or crash
- The issue is a security vulnerability
- The issue violates an established project pattern (CLAUDE.md)
- The fix is straightforward and low-risk
- The deprecated API will break in a future upgrade

**Skip when:**
- The reviewer's claim is factually incorrect (false positive) — verify by reading the code
- The issue is an operational concern, not a code bug (e.g., "add TTL policy", "add monitoring")
- The fix would be a large refactor with high risk for a minor benefit
- The issue is purely cosmetic with no functional impact
- The code already handles the case correctly through a different mechanism

Always explain WHY you skip an issue. "Low value" alone is insufficient — say what makes it low value.
