---
name: create-pr
description: Create a pull request with pre-flight safety checks. Use when the user asks to create a PR, open a pull request, merge changes, or submit code for review. Runs branch safety, build verification, test verification, Firebase environment checks, and documentation validation before creating the PR.
---

# Create PR with Safety Checks

Unified PR creation workflow with pre-flight checks that prevent common deployment mistakes.

## Safety Principle

> The user is often doing multiple changes in the same branch. NEVER change branches, stash, reset, or modify the working tree without explicit user confirmation. When in doubt, ask.

## Workflow

Execute these 8 phases in order. Stop and report if any blocking check fails.

### Phase 0: Pre-Flight Quality Gate

**Always runs first before any PR steps.**

Invoke `/pre-flight` to run all automated quality checks (linting, formatting, type checking, tests, build, secrets scan).

- If any **blocking** checks fail: STOP. Fix issues before continuing.
- If only **advisory** checks warn: show warnings, continue to Phase 1.
- Include the pre-flight report results in the PR body (Phase 6).

### Phase 1: Branch Safety

**Always runs first. CRITICAL.**

1. Get current branch: `git branch --show-current`
2. **Ask the user to confirm** this is the correct branch for the PR. Show:
   - Current branch name
   - Number of commits ahead of main: `git rev-list --count main..HEAD`
   - Uncommitted changes count: `git status --short | wc -l`
3. If uncommitted changes exist:
   - Show the summary of changed files
   - Ask user for a commit message (or suggest one based on diff)
   - Commit the changes before proceeding
4. If branch has no remote tracking: warn and offer to push
5. **NEVER switch branches, create new branches, or stash changes without explicit user approval**

### Phase 2: Build Verification

Check which areas changed and run appropriate builds:

```bash
git diff main...HEAD --name-only
```

| Changed path | Action | Command |
|-------------|--------|---------|
| `backend/` | Verify Python imports | `cd backend && python -c "import functions.main"` |
| `web/` | Build frontend | `cd web && npm run build` |

- If build fails: **STOP**. Report errors. Do not proceed.
- If no buildable files changed: skip this phase.

### Phase 3: Test Verification

**Runs if buildable code changed.**

1. If `backend/` files changed: run `cd backend && python -m pytest tests/ -v`
2. If `web/` files changed: run `cd web && npm test -- --watchAll=false`
3. If tests fail: **STOP**. Report failing tests. Do not proceed.
4. If changed source files have no corresponding test files: warn the user that test coverage is missing and ask if they want to proceed or write tests first.

### Phase 4: Firebase Environment Check

**Only runs if `backend/functions/` files were modified.**

1. Check active Firebase project: `firebase use`
2. Apply branch-to-project mapping:

| PR target branch | Expected Firebase project |
|-----------------|--------------------------|
| `main` | `<PRODUCTION_PROJECT_ID>` |
| `develop` or other | `<DEVELOPMENT_PROJECT_ID>` |

3. If active project doesn't match expected:
   - Show prominent warning with the correct project name
4. Advisory only — warn but do not block PR creation.

### Phase 5: Documentation Check

**Runs for non-trivial changes.**

1. Classify the changes:

   **Trivial changes** (ALL of these must be true to qualify):
   - Typo fixes, dependency bumps, config-only changes
   - No new screens, services, use cases, or collections
   - No new user-facing behavior
   - Fewer than 5 files changed
   - If trivial: note "N/A — trivial change" in pre-flight checks

   **Non-trivial changes** (if ANY of these are true, documentation should be updated):
   - New feature or screen added
   - New Firestore collections or security rules
   - New use cases or domain entities created
   - New Cloud Functions
   - Changes to routing or navigation
   - More than 10 files changed
   - Any architectural changes

2. If documentation is needed, ask the user if they want to create it before proceeding.

### Phase 6: PR Creation

1. Analyze changes:
   ```bash
   git diff main...HEAD
   git log main...HEAD --oneline
   ```
2. Push branch if needed: `git push -u origin HEAD`
3. Detect GitHub issue references in commits, branch name, conversation
4. Create PR with `gh pr create` including:
   - Descriptive title (use argument if provided, otherwise generate)
   - Summary bullets
   - Test plan checklist
   - Pre-flight checks section showing which checks passed
   - Issue linking (`Closes #X`, `Fixes #X`, `Resolves #X`)
   - Claude Code attribution
5. PR body template:
   ```
   ## Summary
   - Change bullets

   ## Test plan
   - [ ] Test items

   ## Pre-flight checks
   - [x] `/pre-flight` quality gate passed
   - [x] Branch confirmed by user
   - [x] Build verification passed (or N/A)
   - [x] Test verification passed (or N/A)
   - [x] Firebase project verified (or N/A)
   - [x] Documentation checked (or N/A)

   Generated with [Claude Code](https://claude.com/claude-code)
   ```
6. Run `/cleanup-merged-branches`
7. Return PR URL

### Phase 7: Monitor for Review Comments

**After the PR is created, proactively watch for the Claude Code Review CI bot.**

1. Tell the user: "I'll monitor for the Claude Code Review CI comments."
2. **First, watch the GitHub Actions workflow:**
   ```bash
   gh run list --branch {BRANCH_NAME} --workflow "Claude Code Review" --limit 1
   gh run watch {RUN_ID}
   ```
3. Once the CI run completes, fetch comments from `claude[bot]` specifically:
   ```bash
   gh api repos/{owner}/{repo}/issues/{PR_NUMBER}/comments \
     --jq '.[] | select(.user.login == "claude[bot]") | {body: .body}'
   ```
4. When Claude Code Review comments appear:
   - Invoke `/fix-pr-review` with the PR number
5. If the CI run fails or no `claude[bot]` comment appears, inform the user.

**Note:** This phase is advisory — if the user wants to move on, don't block them. The `/fix-pr-review` skill can always be run independently later.

## Detailed Checklist

See `references/checklist.md` for the full blocking vs advisory check reference.
