# Pre-PR Safety Checklist Reference

Quick reference for all checks. Each item is either BLOCKING (stops PR) or ADVISORY (warns but continues).

## Blocking Checks

| # | Check | How to verify | Fix |
|---|-------|---------------|-----|
| 1 | Branch confirmed by user | Ask user | Wait for confirmation |
| 2 | All changes committed | `git status --short` | Commit with user-approved message |
| 3 | Backend builds | `cd backend && python -c "import functions.main"` | Fix Python import/syntax errors |
| 4 | Frontend builds | `cd web && npm run build` | Fix TypeScript/build errors |
| 5 | Backend tests pass | `cd backend && python -m pytest tests/ -v` | Fix failing tests |
| 6 | Frontend tests pass | `cd web && npm test -- --watchAll=false` | Fix failing tests |

## Advisory Checks

| # | Check | How to verify | Warning |
|---|-------|---------------|---------|
| 7 | Firebase project matches target branch | `firebase use` | "Cloud Functions deployed to wrong project" |
| 8 | Branch has remote tracking | `git rev-parse --abbrev-ref @{u}` | "Branch not tracking remote" |
| 9 | Changed source files have corresponding test files | Check for matching test files | "Test coverage missing for changed files" |
| 10 | Documentation exists for non-trivial changes | Check for feature documentation | "Documentation may be needed" |

## Trivial vs Non-Trivial Changes

**Trivial** (skip documentation): typo fixes, dependency bumps, config-only changes, single-line fixes
**Non-trivial** (documentation recommended): new features, security changes, architecture changes, new Cloud Functions, new use cases, UI component additions

## Firebase Project Mapping

```
PR → main     → <PRODUCTION_PROJECT_ID>
PR → develop  → <DEVELOPMENT_PROJECT_ID>
PR → other    → <DEVELOPMENT_PROJECT_ID>
```

Update the project IDs above to match your Firebase projects.
