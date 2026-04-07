# Resolve Merge Conflicts

Intelligently resolve merge conflicts against the target branch.

## Input

$ARGUMENTS — Target branch (defaults to `main`).

## Workflow

1. **Pre-merge validation:**
   ```bash
   git status  # Ensure clean working tree
   git fetch origin
   ```

2. **Attempt merge:**
   ```bash
   git merge origin/<target-branch>
   ```

3. **If conflicts arise, for each conflicting file:**
   - Read the file and understand both sides of the conflict
   - Apply resolution strategy based on file type:
     - **Python/TypeScript code:** Preserve both sides' logic, merge imports
     - **package.json / requirements.txt:** Keep higher versions, union of dependencies
     - **Config files (JSON/YAML):** Merge keys, prefer current branch for new features
     - **Documentation:** Combine content, resolve contradictions
   - Remove conflict markers

4. **After resolving all conflicts:**
   ```bash
   # Verify the code works
   cd backend && python -m pytest tests/ -x --tb=short
   cd web && npm run build

   # Stage and commit
   git add .
   git commit -m "Merge <target-branch> and resolve conflicts"
   ```

5. **Report:** List all resolved files and the strategy used for each.
