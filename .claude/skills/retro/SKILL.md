---
name: retro
description: Session retrospective that identifies friction, repetition, and optimization opportunities across development sessions. Run at the end of a session or when the user says "retro", "retrospective", "what can we improve", "session debrief", "optimize workflow", or "what patterns are we repeating". Analyzes the conversation to find friction points, repeated questions, back-and-forth debugging cycles, and missing automation. Outputs actionable improvements — CLAUDE.md patches, new skill proposals, memory updates, and anti-pattern documentation. Compounds over time via a persistent friction log.
---

# Session Retrospective

Analyze the current session to find friction, repetition, and optimization opportunities. Every retro makes the next session faster.

## Workflow

### Phase 1: Scan the Session

Review the full conversation history and categorize every significant interaction into one of these buckets:

| Category | What to Look For | Example |
|----------|-----------------|---------|
| **Friction** | Back-and-forth debugging, multiple attempts to fix the same issue, wrong assumptions | Deployed Cloud Function 3 times before finding the error handling issue |
| **Repetition** | Same question asked across sessions, same manual steps done every time | "Check the logs" → debug → fix → redeploy cycle for every Cloud Function issue |
| **Missing Automation** | Manual steps that could be a script, skill, or hook | Manually validating file formats after every generation |
| **Context Gaps** | Information that was missing from CLAUDE.md or skills, causing wrong first attempts | Didn't know about a specific framework constraint |
| **Skill Candidates** | Workflows repeated enough to warrant a reusable skill | Same multi-step process built 4 times with same pattern |
| **User Preferences** | Implicit preferences revealed by corrections or requests | "Make that copy more friendly" → always run brand voice on error messages |

### Phase 2: Read the Friction Log

Read [references/friction-log.md](references/friction-log.md) to see patterns from previous sessions. Look for:
- Issues that appeared again (escalate priority)
- Issues that were resolved (mark as fixed, note the solution)
- Patterns forming across multiple sessions

### Phase 3: Generate the Report

Output a structured report:

```
## Session Retro — [date]

### Friction Points (back-and-forth cycles)
| Issue | Rounds | Root Cause | Resolution |
|-------|--------|-----------|------------|
| ... | 3 | ... | ... |

### Repetition (things done manually that could be automated)
| Pattern | Times This Session | Across Sessions | Proposed Fix |
|---------|-------------------|-----------------|-------------|
| ... | 2 | 5+ | ... |

### Skill Proposals
| Skill Name | Trigger | What It Would Do |
|------------|---------|-----------------|
| ... | ... | ... |

### CLAUDE.md Patches
| Section | Change | Why |
|---------|--------|-----|
| ... | ... | ... |

### Memory Updates
| File | Content | Why |
|------|---------|-----|
| ... | ... | ... |

### Context Gaps (info that would have prevented friction)
| Gap | Where It Should Live | Content |
|-----|---------------------|---------|
| ... | ... | ... |
```

### Phase 4: Apply Changes

After presenting the report, ask the user which items to act on. Then:

1. **CLAUDE.md patches** — Edit CLAUDE.md with new anti-patterns, guidelines, or cross-cutting concerns
2. **Skill proposals** — Create new skills using `/skill-creator` workflow or update existing ones
3. **Memory updates** — Write to `memory/` directory for cross-session persistence
4. **Friction log** — Append new findings to [references/friction-log.md](references/friction-log.md)

### Phase 5: Update Friction Log

Always append to the friction log, even if no other actions are taken. Format:

```markdown
## [date] — [branch/feature name]

### Friction
- [description] → [resolution] → [preventive action taken or proposed]

### Patterns Confirmed
- [pattern seen again from previous session]

### Resolved
- [previous friction item that's now fixed, with what fixed it]
```

## Escalation Rules

| Times Seen | Action |
|-----------|--------|
| 1st time | Log in friction-log.md |
| 2nd time | Propose CLAUDE.md anti-pattern or memory update |
| 3rd time | Create a skill or automated check (pre-flight script, hook, etc.) |

## What Makes a Good Retro

- **Specific over general** — "Deployed 3 times because of error handling mismatch" beats "deployment was slow"
- **Actionable** — Every finding should have a proposed fix, even if it's "needs more data"
- **Honest about root cause** — Was it a context gap? A wrong assumption? A missing skill? A missing CLAUDE.md rule?
- **Cumulative** — Reference previous retros. Patterns that repeat are the highest-value fixes.
