# Create Branch

Create a feature or fix branch from a GitHub issue or description.

## Input

$ARGUMENTS — Either a GitHub issue URL, issue number, or branch description.

## Workflow

1. **Fetch latest main:**
   ```bash
   git fetch origin main
   git checkout main
   git pull origin main
   ```

2. **Determine branch name:**
   - If input is a GitHub issue URL or `#number`: extract issue number and title
     ```bash
     gh issue view <number> --json title,number
     ```
   - Generate slug: lowercase, hyphens, max 50 chars
   - Branch naming convention:
     - `feature/issue-<number>-<slug>` for new features
     - `fix/issue-<number>-<slug>` for bug fixes
     - `chore/issue-<number>-<slug>` for maintenance
   - If no issue provided, use the description directly as slug

3. **Create and push branch:**
   ```bash
   git checkout -b <branch-name>
   git push -u origin <branch-name>
   ```

4. **Output:** Confirm branch name and tracking status.
