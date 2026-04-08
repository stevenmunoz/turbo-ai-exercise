# Replay — Exercise Timeline Viewer

Render the AI PM exercise action log as a rich, visual timeline in the terminal.

## Workflow

1. Read `.context/exercise-action-log.md`
2. Parse all steps and render them using the format below
3. If `$ARGUMENTS` contains a step number (e.g., `7`), show only that step in detail. Otherwise show the full timeline.

## Output Format

Render the timeline like this:

```
╔══════════════════════════════════════════════════════════════╗
║  🎬  AI PM EXERCISE — REPLAY                               ║
║  Started: 2026-04-07 6:22 PM EST                            ║
╚══════════════════════════════════════════════════════════════╝

 ┌─ Step 1 ─────────────────────────────────── Discovery ──┐
 │  ⏱  6:22 PM                                             │
 │  Baseline Template Selection                             │
 │                                                          │
 │  Selected app-template as baseline starting point...     │
 │  📸 No screenshots                                      │
 │  ✅ Template identified and ready to fork                │
 └──────────────────────────────────────────────────────────┘
          │
          ▼
 ┌─ Step 2 ─────────────────────────────────────── Setup ──┐
 │  ...                                                     │
 └──────────────────────────────────────────────────────────┘
```

### Rules for rendering:

- **Phase badges** — right-align the phase name in the top border of each box
- **Phase colors** (use these emoji prefixes to differentiate):
  - 🔍 Discovery
  - 🎨 Design
  - 🔧 Setup
  - ⚙️ Implementation
  - 🧪 Testing
  - 👀 Review
  - 🚀 Deployment
  - 📝 Documentation
  - ⚡ Optimization
- **Action** — truncate to 2 lines max in the timeline view. Show full text when viewing a single step.
- **Screenshots** — show 📸 with count: `📸 2 screenshots` or `📸 No screenshots`
- **Outcome** — show as ✅ one-liner
- **Connector** — draw `│ ▼` between each step to show sequence
- After the timeline, show a **summary bar**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 📊 8 steps │ ⏱ ~12 min │ Phases: Setup(5) Discovery(2) Design(1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Single step detail view (when argument is a step number):

Show the full entry with all fields rendered clearly:

```
╔══════════════════════════════════════════════════════════════╗
║  Step {N} — {Title}                                         ║
╠══════════════════════════════════════════════════════════════╣
║  ⏱  When:    {timestamp}                                    ║
║  📌 Phase:   {phase}                                        ║
║                                                              ║
║  📋 Action:                                                  ║
║  {full action text}                                          ║
║                                                              ║
║  💡 Why:                                                     ║
║  {full reasoning text}                                       ║
║                                                              ║
║  📸 Screenshots:                                             ║
║  {screenshot descriptions}                                   ║
║                                                              ║
║  📝 Logs:                                                    ║
║  {log content}                                               ║
║                                                              ║
║  ✅ Outcome:                                                 ║
║  {outcome text}                                              ║
╚══════════════════════════════════════════════════════════════╝
```
