# Fix PR Review Comments

Fetch and fix unresolved PR review comments.

## Input

$ARGUMENTS — PR number (optional, defaults to current branch's PR).

## Workflow

1. **Get PR number:**
   ```bash
   # If not provided, find PR for current branch
   gh pr view --json number --jq '.number'
   ```

2. **Fetch unresolved comments:**
   ```bash
   gh api repos/{owner}/{repo}/pulls/<number>/comments --jq '[.[] | select(.position != null)]'
   ```

3. **Categorize each comment:**
   - **Type errors** — Fix type annotations or assertions
   - **Naming** — Rename variables/functions per suggestion
   - **Code style** — Apply formatting or pattern changes
   - **Performance** — Optimize the flagged code
   - **Security** — Fix security concerns (highest priority)
   - **Architecture** — Restructure code per feedback
   - **Testing** — Add or fix tests
   - **Documentation** — Update docstrings or comments

4. **Apply fixes** for each comment, grouped by file.

5. **Commit and push:**
   ```bash
   git add -A
   git commit -m "Address PR review comments"
   git push
   ```

6. **Report:** List each comment addressed and the fix applied.
