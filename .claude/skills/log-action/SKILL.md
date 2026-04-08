---
name: log-action
description: Log an action to the AI PM exercise timeline. Use this skill whenever the user says "log this", "log action", "add to the log", "record this step", "save this to the timeline", or after completing any significant step in the exercise. Also trigger proactively when the user shares screenshots, completes a feature, makes a decision, or finishes any product development activity — even if they don't explicitly ask to log it. The goal is to never miss a step in the exercise timeline.
---

# Log Action

Append a structured entry to the exercise action log at `.context/exercise-action-log.md`. Every entry tells the story of one step in the AI PM exercise — what was done, why, and what came out of it.

## How to Log

### 1. Determine the next step number

Read `.context/exercise-action-log.md` and find the highest existing step number. The new entry is that number + 1.

### 2. Identify the product development phase

Classify the action into one of these phases. Pick the one that best fits — when in doubt, ask the user:

| Phase | Use when... |
|-------|-------------|
| **Discovery** | Researching, exploring requirements, understanding the problem space, reviewing existing solutions |
| **Design** | Making architectural decisions, choosing tools/frameworks, planning features, wireframing |
| **Setup** | Configuring the project, installing dependencies, creating boilerplate, environment setup |
| **Implementation** | Writing code, building features, integrating services |
| **Testing** | Running tests, validating behavior, QA, debugging |
| **Review** | Code review, PR creation, getting feedback, retrospectives |
| **Deployment** | Deploying to production, CI/CD, release management |
| **Documentation** | Writing docs, updating READMEs, creating guides |
| **Optimization** | Improving performance, refactoring, enhancing workflows |

### 3. Write the entry

Append this exact format to the log file, just before the `<!-- New entries go below this line -->` marker (or at the end if the marker isn't present):

```markdown
---

## Step {N} — {Action Title}
**When:** {YYYY-MM-DD HH:MM} (use current date/time)
**Phase:** {Product Development Phase}
**Action:** {What was done — 1-3 sentences describing the specific action taken}
**Why:** {The reasoning — why this step matters, what problem it solves, or what decision it reflects}
**Screenshots:** {If the user provided screenshots, describe them here. If none: "None for this step."}
**Logs:** {Any relevant terminal output, error messages, or tool results worth preserving. If none: "—"}
**Outcome:** {What changed as a result — the concrete output or state change}
```

### 4. Confirm the entry

After appending, tell the user what was logged with a brief summary like:

> **Logged Step {N}** — {Action Title} ({Phase})

## Arguments

When invoked as `/log-action`, the user can pass a description of the action as an argument. Example:

```
/log-action Created the log-action skill to standardize timeline entries
```

If no argument is given, look at the most recent actions in the conversation to determine what should be logged and ask the user to confirm.

## Guidelines

- **Capture the thinking, not just the doing.** The "Why" field is the most important part — it shows the PM's reasoning process.
- **Be specific in outcomes.** "File created" is weak. "Created `.claude/skills/log-action/SKILL.md` with structured timeline format" is strong.
- **Screenshots are gold.** When the user shares a screenshot, always reference it in the log entry and describe what it shows.
- **Don't skip steps.** Even small actions (renaming a branch, installing a dependency) are part of the story. Log them.
- **Use the user's voice.** If the user described their reasoning via voice (Wispr Flow), preserve their framing in the "Why" field rather than rephrasing into generic language.
- **Timestamps matter.** Always use the current date and time so the timeline is accurate.
