# Watch CI Pipeline

Monitor the CI pipeline for the current branch and report results.

## Workflow

1. **Find the latest CI run:**
   ```bash
   gh run list --branch $(git branch --show-current) --limit 1 --json databaseId,status,conclusion
   ```

2. **Watch the run:**
   ```bash
   gh run watch <run-id>
   ```

3. **On failure:**
   - Fetch logs: `gh run view <run-id> --log-failed`
   - Analyze the failure and report:
     - Which job failed
     - The error message
     - Suggested fix

4. **On success:**
   - Report all jobs passed with timing info.
