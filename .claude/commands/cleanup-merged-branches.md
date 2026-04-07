# Cleanup Merged Branches

Delete local and remote branches that have been merged via GitHub PRs.

## Workflow

1. **Fetch latest state:**
   ```bash
   git fetch --prune origin
   ```

2. **Find merged branches:**
   ```bash
   # List PRs merged in the last 30 days
   gh pr list --state merged --limit 50 --json headRefName

   # Cross-reference with local branches
   git branch --list
   ```

3. **Safety checks — NEVER delete:**
   - `main` or `master`
   - The currently checked-out branch
   - Branches with unmerged commits

4. **Preview (dry run):**
   - List branches that would be deleted
   - Ask for confirmation before proceeding

5. **Delete confirmed branches:**
   ```bash
   git branch -d <branch-name>           # Local
   git push origin --delete <branch-name>  # Remote (if exists)
   ```

6. **Report:** Summary of deleted branches and any skipped branches with reasons.
