# AI PM Exercise — Action Log

> Sequential timeline of every step taken during this exercise.
> Each entry captures: phase, action, reasoning, screenshots, and outcome.
> **Start time:** 2026-04-07 6:22 PM EST

---

## Step 1 — Baseline Template Selection
**When:** 2026-04-07 6:22 PM EST
**Phase:** Discovery
**Action:** Selected the `app-template` repo (https://github.com/stevenmunoz/app-template) as the baseline starting point for the exercise. The template was chosen because it already includes pre-configured Claude Code skills, workflows, agents, and slash commands — a production-ready serverless full-stack starter with Firebase Cloud Functions (Python) + React/TypeScript.
**Why:** Starting from a template with built-in AI tooling (skills, agents, workflows) demonstrates an AI PM's ability to leverage existing infrastructure rather than building from scratch. The template provides Clean Architecture, dependency injection, and Cloud Functions patterns out of the box — letting the exercise focus on product thinking, not boilerplate setup.
**Screenshots:** None for this step.
**Logs:** —
**Outcome:** Template identified and ready to fork.

---

## Step 2 — Created Build-Ready Copy
**When:** 2026-04-07 6:23 PM EST
**Phase:** Setup
**Action:** Forked the baseline template into a dedicated exercise repository at https://github.com/stevenmunoz/trubo-ai-exercise to have an independent, build-ready copy for the exercise.
**Why:** Working on a separate repo ensures the exercise is self-contained and doesn't affect the original template. This also creates a clean git history that shows the exercise progression from initial commit forward.
**Screenshots:** None for this step.
**Logs:** —
**Outcome:** Exercise repo created at `trubo-ai-exercise` on GitHub.

---

## Step 3 — Cloned in Conductor
**When:** 2026-04-07 6:24 PM EST
**Phase:** Setup
**Action:** Cloned the `trubo-ai-exercise` repo into Conductor (Mac app for parallel coding agents) using the "Clone from URL" dialog. Clone location: `/Users/stevenmunoz/conductor`. Conductor created the `dublin-v2` workspace, branched from `origin/main`, and copied 161 files. Setup script ran automatically via `conductor.json`.
**Why:** Conductor enables running multiple AI agents in parallel across workspaces — essential for an AI PM exercise where you want to demonstrate orchestrating AI tools efficiently. The workspace isolation means each exercise attempt is independent.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.23.11@2x.png` — Conductor's "Clone from URL" dialog showing the `trubo-ai-exercise` Git URL being entered, with clone location set to `/Users/stevenmunoz/conductor`.
**Logs:** —
**Outcome:** Workspace `dublin-v2` created with 161 files, branched from `origin/main`, setup script completed.

---

## Step 4 — Voice-Driven Instructions via Wispr Flow
**When:** 2026-04-07 6:25 PM EST
**Phase:** Setup
**Action:** Started using Wispr Flow (voice-to-text) to dictate all instructions to Claude Code instead of typing. Dictated the initial guidelines: start with baseline template, describe why the template was chosen, set up action logging, and capture screenshots at every step.
**Why:** Optimizes speed — dictating complex, multi-sentence PM-level instructions via voice is significantly faster than typing. This mirrors how an AI PM would work in practice: thinking out loud and letting AI tools capture and execute the intent. Also demonstrates a modern AI-augmented workflow.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.25.23@2x.png` — Conductor workspace showing the `dublin-v2` workspace fully loaded. Left panel shows the workspace list. Center shows workspace status: "Branched dublin-v2 from origin/main", "Created dublin-v2 and copied 161 files", "Completed setup script". Right panel shows the full file tree (`.claude`, `.context`, `backend`, `docs`, `mobile`, `scripts`, `web`). Bottom shows the initial voice-dictated prompt with Opus 4.6 model selected in Thinking + Plan mode.
- `CleanShot 2026-04-07 at 17.26.24@2x.png` — Claude Code processing the initial instructions. Shows Claude's thinking process: "The user wants me to: 1. Rename the branch first, 2. Save a log of all actions..." followed by branch rename, project structure exploration, MEMORY.md check, and creation of `exercise-action-log.md` and memory files (`project_ai_pm_exercise.md`, `user_profile.md`). Took 40.5 seconds. Model: Opus 4.6 with Thinking + Plan mode active.
**Logs:** —
**Outcome:** Instructions flowing naturally via voice; Claude Code began executing the setup plan autonomously.

---

## Step 5 — Action Logging System Created
**When:** 2026-04-07 6:26 PM EST
**Phase:** Setup
**Action:** Claude Code created the action log file at `.context/exercise-action-log.md` with the first 3 entries, plus persistent memory files (`project_ai_pm_exercise.md`, `user_profile.md`, `feedback_action_logging.md`) so future conversations automatically continue logging.
**Why:** The exercise deliverable is not just the final product but the *process* — a sequential timeline showing every decision, screenshot, and iteration. Persistent memory ensures continuity across conversations and agents.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.26.53@2x.png` — Claude Code's summary output showing: "Action log created at `.context/exercise-action-log.md` — it already captures the first 3 steps: 1. Baseline template selection, 2. Wispr Flow setup, 3. Action logging initiated. Memories saved so every future conversation in this project will automatically continue the log and know the context."
**Logs:** —
**Outcome:** Action log initialized with Steps 1-3. Memory system configured for cross-conversation persistence.

---

## Step 6 — Planning Mode with Opus 4.6
**When:** 2026-04-07 6:27 PM EST
**Phase:** Design
**Action:** Entered Planning Mode in Claude Code using Opus 4.6 as the planning model. The strategy: use a more robust model (Opus 4.6) for planning and architectural decisions, then switch to faster models (Sonnet or Haiku) for execution tasks.
**Why:** Model selection is a key AI PM skill. Opus 4.6 has stronger reasoning for complex planning — understanding requirements, designing architecture, exploring trade-offs. Execution tasks (writing code, running scripts) don't need that depth, so using Sonnet/Haiku there saves cost and time. This two-tier approach maximizes quality where it matters most.
**Screenshots:** None for this step (visible in previous screenshots showing "Plan" mode active in the bottom bar).
**Logs:** —
**Outcome:** Planning mode active with Opus 4.6. Ready for skill creation.

---

## Step 7 — Created `/log-action` Skill via Skill Creator
**When:** 2026-04-07 6:29 PM EST
**Phase:** Setup
**Action:** Used the built-in Anthropic Skill Creator (`/skill-creator`) to create a new reusable skill called `log-action` at `.claude/skills/log-action/SKILL.md`. The skill standardizes how every action is logged: auto-incremented step numbers, product development phase classification, consistent entry format (When, Phase, Action, Why, Screenshots, Logs, Outcome), and proactive triggering when screenshots are shared or significant steps complete.
**Why:** Consistency is critical for the timeline presentation. A skill ensures every log entry — regardless of which agent, conversation, or workspace creates it — follows the same structure. Using the built-in Skill Creator (rather than manually writing the SKILL.md) demonstrates leveraging existing AI tooling for meta-tasks: using AI to build tools that make AI more effective.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.29.10@2x.png` — The completed `log-action/SKILL.md` file open in Conductor's editor. Shows the skill's structure: frontmatter with name and trigger description, "How to Log" workflow (determine step number → identify phase → write entry → confirm), the product development phase table (Discovery, Design, Setup, Implementation, Testing, Review, Deployment, Documentation, Optimization), and the entry format template. File tree on right shows the skill nested under `.claude/skills/log-action/`.
**Logs:** —
**Outcome:** `/log-action` skill created and immediately available. All existing log entries retroactively updated to match the new format. Skill is invocable via `/log-action` or triggers proactively.

---

## Step 8 — Exported & Saved Exercise Brief
**When:** 2026-04-07 6:34 PM EST
**Phase:** Discovery
**Action:** Attempted to fetch the Turbo AI Product Manager Challenge from Notion via WebFetch, but Notion requires JavaScript rendering. Pivoted: duplicated the Notion page, exported as Markdown & CSV, downloaded the export, and saved the full exercise brief to `docs/exercise-brief.md` — the project's main reference document for the challenge requirements.
**Why:** The exercise brief is the single source of truth for all requirements, deliverables, constraints, and evaluation criteria. Having it in-repo (not just a Notion link) ensures every agent and workspace can reference it without network dependencies. The pivot from WebFetch to manual export also demonstrates adaptability — a core AI PM skill.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.31.16.png` — The Notion page showing the "Client Conversation" section between Alex and Camila. Visible tabs at top: Landing Draft, Design System, Media Prop, Local, Offers, EIS, Impact, Lead, Rate, Perfor Review, Forms, Quotes, Instructions, Print.
- `CleanShot 2026-04-07 at 17.33.50.png` — Notion export dialog with "Markdown & CSV" format selected, "Current View" scope, options for "Include databases" and "Create folders for subpages".
- `CleanShot 2026-04-07 at 17.34.00.png` — Notion confirmation: "1 page exported. We'll also send you an email with the download link."
- `CleanShot 2026-04-07 at 17.34.17.png` — The exported markdown file opened in a text editor, showing the full challenge content: Welcome, The Challenge, The Situation, Your Goals, The Deliverables, Key Constraints, and Criteria sections.
**Logs:** WebFetch returned only Notion's JavaScript loader shell — no content. Fallback to manual export successful.
**Outcome:** Complete exercise brief saved to `docs/exercise-brief.md` with all sections: challenge description, situation, goals, deliverables (clickable prototype + 10-min video), constraints (72 hours, AI encouraged), evaluation criteria (client communication, product thinking, design execution, creativity), and full client conversation transcript.

---

## Step 9 — Created `/replay` Timeline Viewer Command
**When:** 2026-04-07 6:36 PM EST
**Phase:** Setup
**Action:** Created a slash command `/replay` at `.claude/commands/replay.md` that renders the action log as a rich visual timeline in the terminal. Shows each step as a boxed card with phase emoji, timestamp, action summary, screenshot count, and outcome. Includes connectors between steps and a summary bar with total stats. Supports viewing a single step in detail via `/replay 7`.
**Why:** A visual timeline is faster to scan than raw markdown. The `/replay` command turns the action log into a presentation-ready format — useful for quick status checks during the exercise and for the final deliverable review. The name "replay" evokes rewinding through the exercise like a recording.
**Screenshots:** None for this step.
**Logs:** —
**Outcome:** `/replay` command available. Run `/replay` for full timeline or `/replay N` for step detail.

---

## Step 10 — Removed Firebase Emulators from Conductor Script
**When:** 2026-04-07 6:37 PM EST
**Phase:** Setup
**Action:** Stripped all Firebase Emulator logic from `scripts/conductor-run.sh` — removed emulator startup, port checks (4000, 5001, 8080, 9099), health checks, emulator process monitoring/restart, and emulator log references. Script now only manages the web dev server on port 3000.
**Why:** Firebase emulators are not needed for this exercise. Removing them simplifies the Conductor run script, speeds up workspace startup, and eliminates unnecessary dependencies (Firebase CLI, Java).
**Screenshots:** None for this step.
**Logs:** —
**Outcome:** `conductor-run.sh` reduced from 251 to ~140 lines. Only starts the React web dev server.

---

## Step 11 — Built `/replay` Web Page + Auto-Open Hook
**When:** 2026-04-07 6:40 PM EST
**Phase:** Implementation
**Action:** Built a full React page at `/replay` that renders the exercise action log as a visual timeline in the browser. Each step appears as an expandable card with phase emoji/color, timestamp, action summary, screenshot count, and outcome. Added a Vite plugin to serve the raw log file via `/api/replay-log` so the page always shows the latest data. Also configured a Stop hook in `.claude/settings.local.json` to automatically open `http://localhost:3000/replay` in the browser after every Claude interaction.
**Why:** A browser-based timeline is far more presentable than a CLI command for the exercise deliverable. Auto-opening after every interaction ensures the timeline stays visible and up-to-date without manual intervention — turning the action log into a live dashboard of the exercise progress.
**Screenshots:** None for this step.
**Logs:** —
**Outcome:** `/replay` page live at `http://localhost:3000/replay`. Auto-open hook configured. Timeline shows all steps with expandable detail, phase badges, and a summary bar.

---

## Step 12 — Problem Decomposition, Information Flow & Customer Journey
**When:** 2026-04-07 6:45 PM EST
**Phase:** Discovery
**Action:** Analyzed the client conversation transcript to extract 9 discrete customer problems (ranked by pain level), mapped the complete information flow through Alex's medical supply distribution business (from clinic order → intake → calculations → approvals → documents → vendor order → delivery), and drafted the employee journey with friction heatmap showing where the most time/errors are lost. Proposed a 4-sprint phasing plan with Sprint 1 focused on replacing the core spreadsheet (order form + product catalog + fee schedules + auto-calculations).
**Why:** Before designing any solution, an AI PM must decompose the fuzzy vision into structured understanding. The information flow reveals data dependencies (you can't generate documents before the data model is solid). The customer journey reveals friction concentration (65% of pain is in data entry + calculations). This analysis directly informs sprint prioritization: fix the input layer first, then automate outputs.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.44.03@2x.png` — Conductor workspace showing `docs/exercise-brief.md` open in the editor with the full challenge text visible. Right panel shows the file tree with the new `exercise-brief.md` under `docs/`. Bottom-right terminal shows the web dev server running successfully on port 3000.
**Logs:** —
**Outcome:** Complete problem analysis, ASCII information flow diagram, customer journey with friction heatmap, and 4-sprint phasing proposal drafted in conversation. Ready to save as formal documentation and begin Sprint 1 design.

---

## Step 13 — Screenshots Captured & Replay Page Fixed
**When:** 2026-04-07 6:50 PM EST
**Phase:** Implementation
**Action:** Captured 6 screenshots documenting the discovery analysis outputs: customer problems table, ASCII information flow diagrams, employee journey with friction heatmap, and sprint phasing proposal. Also fixed the `/replay` web page — rewrote the markdown parser to split on step headers instead of using a greedy regex (which was causing steps to bleed into each other), and added structured screenshot rendering with filename badges and descriptions instead of raw markdown text.
**Why:** The replay page is the primary visualization of the exercise timeline. The broken parser was making it unusable — steps were merging and screenshots showed as raw markdown. Fixing this now ensures every subsequent step renders correctly as the timeline grows.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.48.06@2x.png` — Customer Problems table rendered in the chat. Shows all 9 extracted problems (P1-P9) with columns for Problem, Pain Level (Critical/High/Medium with colored dots), and direct quotes from Alex's conversation.
- `CleanShot 2026-04-07 at 17.49.43@2x.png` — ASCII information flow diagram showing the complete data path from clinic order intake through product/fee/payer lookups, calculations, approval flow, document generation (encounter form, invoice, POD), and vendor order fulfillment.
- `CleanShot 2026-04-07 at 17.50.04@2x.png` — Continuation of the information flow diagram showing the document generation outputs and vendor order process.
- `CleanShot 2026-04-07 at 17.50.21@2x.png` — Employee journey diagram showing the 6 phases (Receive → Enter → Select → Review → Place → Send) with friction indicators at each step.
- `CleanShot 2026-04-07 at 17.50.35@2x.png` — Pain heatmap showing friction distribution: Data Entry & Lookup (35%), Calculations (30%), Document Generation (15%), Vendor Order Re-entry (12%), Approvals (8%). Sprint phasing proposal visible below.
- `CleanShot 2026-04-07 at 17.50.47@2x.png` — The broken `/replay` page before fix, showing Step 3 "Cloned in Conductor" with raw markdown bleeding into the Why section — screenshots and multiple steps merged together.
**Logs:** Parser rewritten from single greedy regex to block-splitting approach. Screenshots now parsed into structured `{filename, description}` objects.
**Outcome:** Replay page fixed — all 12+ steps render as separate cards with proper field isolation. Screenshots display as styled cards with filename badges. Page auto-refreshes on each visit via live `/api/replay-log` endpoint.

---

## Step 14 — Screenshot Viewer with Lightbox
**When:** 2026-04-07 6:55 PM EST
**Phase:** Implementation
**Action:** Added actual screenshot image rendering to the `/replay` page. Each screenshot now shows a thumbnail preview (120x80px) alongside the filename and description. Clicking any screenshot opens a full-screen lightbox with the image at full resolution, left/right arrow navigation to scroll through a step's screenshots, keyboard support (Escape to close, arrow keys to navigate), and a caption bar with filename, description, and counter. Also added a Vite middleware endpoint at `/api/attachments/` to serve image files from `.context/attachments/`.
**Why:** The screenshots are the most compelling evidence of the exercise process — showing them as just text filenames loses their impact. A lightbox viewer lets reviewers see exactly what happened at each step without leaving the timeline.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.54.24@2x.png` — The replay page before this fix, showing screenshot items as text-only cards with filenames in blue and descriptions below, but no actual images visible.
**Logs:** —
**Outcome:** Screenshots now render with thumbnails inline and full-resolution lightbox on click. Arrow key navigation between screenshots within a step.

---

## Step 15 — Lightbox Image Sizing Fix
**When:** 2026-04-07 6:57 PM EST
**Phase:** Implementation
**Action:** Fixed lightbox image overflow — retina screenshots (2x) were exceeding the viewport. Constrained images to `max-width: 90vw` and `max-height: 75vh` with `object-fit: contain`, added `overflow: hidden` to the wrapper, and improved the close button positioning.
**Why:** Large retina screenshots were rendering at full pixel dimensions, pushing the image far beyond the viewport bounds and making the lightbox unusable.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.56.59@2x.png` — The lightbox before fix, showing the Customer Problems table screenshot overflowing the container — image extends well beyond the visible area with no constraint.
**Logs:** —
**Outcome:** Lightbox images now fit within the viewport while maintaining aspect ratio.

---

## Step 16 — Lightbox Navigation Layout Fix
**When:** 2026-04-07 6:59 PM EST
**Phase:** Implementation
**Action:** Redesigned the lightbox layout from overlapping positioned elements to a structured 3-row flexbox: top bar (counter + close button), image area (prev arrow | image | next arrow in columns), and bottom caption bar. Nav arrows are now in fixed-width columns flanking the image instead of floating on top of it.
**Why:** The previous layout had nav arrows and close button absolutely positioned, causing them to overlap the image and look disorganized. The new column-based layout keeps controls visually separated from the image content.
**Screenshots:**
- `CleanShot 2026-04-07 at 17.58.15@2x.png` — Lightbox before fix showing nav arrows overlapping the image center and the close button floating at the very top edge.
**Logs:** —
**Outcome:** Lightbox now has a clean top bar, properly flanked nav arrows, and a bottom caption — all properly contained.

---

## Step 17 — UI Inspiration Research
**When:** 2026-04-07 7:02 PM EST
**Phase:** Design
**Action:** Researched 3 modern platforms for UI inspiration — intentionally avoiding typical medical software aesthetics. Selected Linear (operations/workflow, "Linear Design" trend), Retool (internal tools, master-detail patterns), and Ramp (fintech ops dashboard, financial data + approvals). Extracted specific design patterns from each: layout structures, color systems, table design, form patterns, navigation. Synthesized into a concrete design system recommendation for Sprint 1. Saved as `docs/ui-inspiration.md`.
**Why:** Medical software UIs are typically cluttered and dated. Taking inspiration from best-in-class B2B tools (Linear's noise reduction, Retool's master-detail for CRUD, Ramp's financial dashboard patterns) ensures the order management system feels modern and efficient — which directly impacts team adoption and daily productivity.
**Screenshots:** None for this step.
**Logs:** —
**Outcome:** `docs/ui-inspiration.md` created with detailed pattern tables for 3 platforms plus a synthesized design system (layout, color, typography, spacing, forms, tables). Ready for Sprint 1 prototype design.

---

## Step 18 — Design Library Page Created
**When:** 2026-04-07 7:06 PM EST
**Phase:** Design
**Action:** Created a design library system with three parts: (1) `.context/design-library.json` — a structured data file holding design references with screenshots, color palettes, typography, patterns, and key takeaways; (2) `/library` web page at `http://localhost:3000/library` — renders each reference as an expandable card with thumbnail grid, color swatches, pattern lists, and lightbox image viewer; (3) Vite endpoint at `/api/design-library` to serve the JSON. First reference added: Airbnb — 4 screenshots showing card grid, search bar, modals, and multi-step checkout flow.
**Why:** A living design library gives the exercise a structured place to collect visual references. Instead of screenshots scattered in chat, each reference is catalogued with its design system properties — making it easy to compare approaches and justify design decisions in the final presentation.
**Screenshots:**
- `CleanShot 2026-04-07 at 18.00.38@2x.png` — Airbnb homepage with card grid and centered pricing modal.
- `CleanShot 2026-04-07 at 18.00.46@2x.png` — Airbnb homepage full card grid with horizontal scroll rows by location.
- `CleanShot 2026-04-07 at 18.01.10@2x.png` — Airbnb referral modal — 3-step icon+text pattern with single CTA.
- `CleanShot 2026-04-07 at 18.01.36@2x.png` — Airbnb checkout: numbered accordion steps (left) + sticky booking summary (right).
**Logs:** —
**Outcome:** Design library live at `http://localhost:3000/library` with Airbnb as first reference. Expandable cards show color swatches, typography, patterns, and takeaways. Thumbnails clickable with full lightbox viewer. Ready to add more references (Linear, Retool, Ramp, or any others).

---

## Step 19 — Added Hourglass Healthcare Dashboard to Design Library
**When:** 2026-04-07 7:09 PM EST
**Phase:** Design
**Action:** Added second design reference to the library: "Hourglass — Modern Healthcare Dashboard" by Paperpillar (Dribbble). This is a healthcare-specific reference that breaks away from typical clinical aesthetics with glassmorphic surfaces, soft lavender gradients, and a widget-based layout. Extracted design system: navy/sage color palette, icon grid for specialties (adaptable to product categories), appointment queue widget (maps to our order queue), and quick-action icon bar.
**Why:** While we're avoiding typical medical software aesthetics, this reference proves healthcare tools *can* be modern and beautiful. The icon grid for doctor specialties maps directly to product category selection, and the appointment queue widget is structurally identical to an order queue. Having one healthcare-specific reference ensures we don't lose domain context while pursuing modern design.
**Screenshots:**
- `CleanShot 2026-04-07 at 18.02.50@2x.png` — Hourglass dashboard: sidebar nav, hero card with doctor photo, specialty icon grid, quick-action bar, health tips, result history, and appointment queue widget.
**Logs:** Dribbble URL: https://dribbble.com/shots/26848599-Modern-Healthcare-Dashboard-Simple-Elegant-Effortless-Appoint
**Outcome:** Design library now has 2 references (Airbnb + Hourglass) with 5 total screenshots. Viewable at `http://localhost:3000/library`.

---

## Step 20 — Design Library Expanded: Pills, Dentexa, Xenityhealth
**When:** 2026-04-07 7:12 PM EST
**Phase:** 🎨 Design
**Action:** Added 3 new design references to the design library with full design system analysis:
1. **Pills** (medical supply e-commerce) — category pill chips, product cards, hover-to-preview
2. **Dentexa** (clinical operations dashboard) — grouped sidebar nav, financial charts, inventory alerts
3. **Xenityhealth** (healthcare analytics dashboard) — KPI cards with sparklines, tab navigation, schedule timeline

Each reference analyzed for colors, typography, spacing, UI patterns, and key takeaways mapped to our medical supply order tool.
**Why:** Building a diverse reference library before prototyping Sprint 1. Each reference brings distinct patterns: Pills shows product browsing/selection UX, Dentexa shows operational dashboard with inventory management, Xenityhealth shows KPI-driven overview with inline analytics. Together with Airbnb (flow design) and Hourglass (healthcare warmth), we have a complete design vocabulary.
**Screenshots:**
- `CleanShot 2026-04-07 at 18.04.39@2x.png` — Pills full-page overview with categories, product grid, and special offers
- `CleanShot 2026-04-07 at 18.05.00@2x.png` — Pills special offers with hover popup product preview
- `CleanShot 2026-04-07 at 18.05.59@2x.png` — Dentexa dashboard with grouped sidebar, revenue charts, inventory alerts
- `CleanShot 2026-04-07 at 18.06.19@2x.png` — Xenityhealth dashboard with KPI cards, revenue chart, diagnosis donut
- `CleanShot 2026-04-07 at 18.06.28@2x.png` — Xenityhealth variant 2 with full Latest Visits list
**Outcome:** Design library now has 5 references (Airbnb, Hourglass, Pills, Dentexa, Xenityhealth) with 10 total screenshots. Ready to synthesize design direction for Sprint 1 prototype.

---

## Step 21 — MedFlow Design System Created
**When:** 2026-04-07 7:35 PM EST
**Phase:** 🎨 Design
**Action:** Synthesized 5 design references into a unified "MedFlow" design system with:
1. **Design tokens** (`shared/design-tokens.ts`) — colors, typography, spacing, radii, shadows, transitions, layout constants
2. **Living style guide** at `/design-system` — 12 documented sections: Overview, Colors, Typography, Spacing, Buttons, Form Inputs, Badges, Cards, KPI Cards, Data Table, Sidebar Nav, Sprint 1 Patterns
3. **Design philosophy** codified: Warm Not Clinical, Dense Not Cluttered, Progressive Disclosure, Speed Over Polish
4. **Component previews** — interactive buttons (4 variants × 3 sizes), form inputs with states (error, disabled, auto-calculated), order status badges, category chips, KPI cards with sparkline SVGs, data table with sample orders, sidebar navigation with grouped sections

Also fixed lightbox top bar layout (centered counter, close button anchored left) on both `/library` and `/replay` pages. Fixed global `button { width: 100% }` override from App.css so all design system buttons render inline correctly.
**Why:** Before building Sprint 1 prototype, we need a documented design system that the team can reference. This ensures consistency across all screens and speeds up development. The `/design-system` page also serves as a deliverable showing design thinking to the client.
**Screenshots:**
- `CleanShot 2026-04-07 at 21.59.26@2x.png` — MedFlow Design System hero and Design Philosophy section showing the 4 guiding principles (Warm Not Clinical, Dense Not Cluttered, Progressive Disclosure, Speed Over Polish) with source references from the design library
- `CleanShot 2026-04-07 at 21.59.33@2x.png` — Full Color Palette section showing Primary (blue), Accent (orange), Success, Warning, Danger, Neutral scales with hex values, plus Surfaces swatches (page, card, sidebar, sidebarHover, sidebarActive, overlay, elevated)
- `CleanShot 2026-04-07 at 21.59.41@2x.png` — Cards section (Patient Information, Product Details, Order Summary with margin calculations) and KPI Cards section (Active Orders 47, Pending Approvals 8, Revenue MTD $34,850, Shipped Today 12) with sparkline SVGs and change indicators
**Outcome:** Design system live at `http://localhost:3000/design-system` with all tokens importable from `shared/design-tokens.ts`. All 12 sections verified rendering correctly. Ready to start building Sprint 1 prototype screens.

---

## Step 22 — Sprint 1 Prototype Built: Full Order Management Flow
**When:** 2026-04-07 8:15 PM EST
**Phase:** 🔨 Build
**Action:** Built the complete Sprint 1 prototype at `/app` with:

**Dashboard View:**
- Welcome header with time-of-day greeting and New Order CTA
- 4 KPI cards (Active Orders, Pending Approvals, Revenue MTD, Shipped Today) with sparkline SVGs and staggered entry animations
- Recent Orders table with search, status filter chips, and inline status badges
- Quick actions strip (Export CSV, Print Report, Filter by Vendor)

**New Order Flow — 4-step multi-step form:**
1. **Patient Information** — Name, DOB, phone, email, shipping address, referring therapist/clinic. 2-column grid with staggered field animations.
2. **Product Selection** — Category filter chips (6 categories), 10 product cards with HCPCS codes, vendor, pricing. Click-to-add with selected items panel showing quantity stepper, size dropdown, measurement upload link, prior auth warnings.
3. **Billing & Insurance** — Self-pay toggle, insurance provider select, policy/group numbers. Auto-calculated cost breakdown table using fee schedule lookups with real-time margin calculations.
4. **Review & Submit** — Summary cards for all sections, order notes, submit with success animation.

**Supporting infrastructure:**
- `shared/mock-data.ts` — 6 vendors, 10 products, 18 fee schedules, 8 insurers, 6 sample orders, billing calculator
- `prototype/prototype.css` — 15+ CSS animations (fade-in-up, slide, scale, shimmer, confetti, pulse)
- `prototype/AppShell.tsx` — Sidebar nav with grouped sections (Orders/Catalog/Documents), user profile
- `prototype/DashboardView.tsx` — KPI dashboard with order table
- `prototype/NewOrderView.tsx` — Full multi-step form with sticky summary panel

**Why:** Sprint 1 solves the #1 pain point — data entry (35% of friction). The form replaces the fragile Excel spreadsheet with auto-populated fields, fee schedule lookups, and real-time margin calculations. Every field that can be auto-filled IS auto-filled.
**Screenshots:**
**Outcome:** Fully functional clickable prototype at `http://localhost:3000/app`. All 4 steps working, calculations verified, animations smooth. Ready for client presentation.

---

## Step 23 — Sidebar Navigation Refinement (2 Rounds)
**When:** 2026-04-07 9:00 PM EST
**Phase:** 🎨 Polish
**Action:** Iterated the sidebar navigation through 2 rounds of visual feedback:

**Round 1 — Active state visibility:**
- Changed active nav item from flat dark color (`#1E3A5F`) to gradient background: `linear-gradient(135deg, rgba(79, 106, 232, 0.22), rgba(79, 106, 232, 0.12))`
- Added left accent bar via `box-shadow: inset 3px 0 0 0 #6B8CF8`
- Made active text white with `font-weight: 600`
- Updated `design-tokens.ts` sidebarActive value to match

**Round 2 — Spacing and breathing room:**
- Increased nav item padding from `8px 12px` → `11px 14px`
- Added `margin-bottom: 4px` between items
- Increased nav group spacing from `12px` → `24px` (`spacing[6]`)
- Refined group label style: `10px` font, `0.1em` letter-spacing, softer color `rgba(148, 163, 184, 0.55)`

**Why:** The sidebar is the primary navigation element — it's visible 100% of the time. The original active state was nearly invisible against the dark sidebar background, causing user confusion about which page they were on. The cramped spacing made it feel like a dense settings panel rather than a professional medical tool. These refinements follow the design system principle "Dense Not Cluttered."
**Screenshots:** —
**Outcome:** Sidebar now has clear visual hierarchy, obvious active states, and comfortable spacing. Matches the polish level of reference designs (Dentexa, Xenityhealth).

---

## Step 24 — Dashboard Status Filter Chip Styling Fix
**When:** 2026-04-07 9:20 PM EST
**Phase:** 🐛 Fix
**Action:** Rewrote status filter chips from CSS class-based (`category-chip`) to fully inline-styled pills with semantic colors. Each status gets a distinct color configuration:

- **All Orders** — neutral gray
- **Processing** — primary blue (`#4F6AE8` dot, `#EEF2FF` bg)
- **Shipped** — success green (`#10B981` dot, `#ECFDF5` bg)
- **Pending** — warning amber (`#F59E0B` dot, `#FFFBEB` bg)
- **Delivered** — accent orange (`#F97316` dot, `#FFF7ED` bg)

Each chip has: proper padding (`7px 14px`), pill border-radius, colored borders on active state, `1px solid neutral[200]` on inactive, and colored dot indicator.

**Why:** The filter chips were rendering as unstyled text with tiny dots — no borders, no padding, no pill shape. This made the filters look broken and unprofessional. The inline style approach avoids CSS specificity conflicts with the global `category-chip` class which was being overridden.
**Screenshots:** —
**Outcome:** Status filter chips now render as proper pill buttons with semantic colors matching each order status. Active state clearly distinguishable from inactive.

---

## Step 25 — "Fill Demo Data" Button for Rapid Testing
**When:** 2026-04-07 9:40 PM EST
**Phase:** 🔨 Build
**Action:** Added a "⚡ Fill Demo Data" button to Step 1 (Patient Information) of the New Order flow:

- **Button design:** Orange dashed border (`accent[300]`), warm background (`accent[50]`), hover effects with shadow
- **Position:** Inline with the "Patient Information" section header, right-aligned
- **Data pool:** 8 realistic Florida-based patient records with full demographics (names, DOBs, phones, emails, addresses, referring therapists and clinics)
- **Behavior:** Each click selects a random patient from the pool and fills all 11 form fields instantly

**Why:** Manual testing requires filling 11+ fields per order. At ~3 seconds per field, that's 30+ seconds per test run. The demo data button reduces this to a single click (~0.5s), a 60x speedup. This also ensures test data is realistic (Florida addresses, real-sounding clinic names) rather than "test123" entries. Crucial for demonstrating the prototype in the video presentation.
**Screenshots:** —
**Outcome:** Button working and verified. Fills all patient fields with randomized realistic data on each click.

---

## Step 26 — Delightful Form Validation System
**When:** 2026-04-07 10:20 PM EST
**Phase:** 🎨 Polish
**Action:** Implemented a warm, user-friendly validation system for the Patient Information step:

**Validation rules:**
- **First Name / Last Name** — Required, with friendly messages ("We'll need the patient's first name to get started")
- **Email** — Format validation (regex), hint: "Hmm, that doesn't look like a valid email address"
- **Phone** — Format validation, hint: "Try a format like (555) 555-0123"
- **ZIP Code** — 5-digit format, hint: "ZIP codes are usually 5 digits"

**Three interaction layers:**
1. **On blur** — Validation appears when the user leaves a field, with a soft slide-in animation. Invalid fields get a pink border + background tint (`danger[50]`). Valid fields with content get a subtle green border (`success[400]`).
2. **On Continue click with errors** — Instead of a disabled button, the Continue button is always enabled. When clicked with missing/invalid fields: all errors reveal simultaneously, invalid fields get a gentle shake animation, and a warm banner slides in: "👋 Almost there! Just a few fields need your attention before we continue."
3. **Self-healing** — As the user fixes a field, the error instantly clears and the border transitions to green, providing positive reinforcement.

**CSS additions:** `gentleShake` keyframe, `hintSlideIn` keyframe, `nudgeBannerIn` keyframe, `.field-invalid`, `.field-valid`, `.field-shake`, `.validation-hint`, `.nudge-banner` classes.

**Why:** Traditional validation is hostile — red text saying "REQUIRED" or silently disabled buttons that leave users guessing. The nudge pattern (always-enabled button + friendly banner + shake) respects the user's intent while clearly guiding them. Conversational error messages ("We'll need...") feel like a helpful colleague, not a machine. This directly supports the design principle "Warm Not Clinical."
**Screenshots:** —
**Outcome:** Validation system working across 5 fields. Errors appear on blur or on Continue click. Gentle shake + banner on invalid submit. Fields transition to green on valid input.

---

## Step 27 — Delightful Stepper Animations + Progress Encouragement
**When:** 2026-04-07 10:35 PM EST
**Phase:** 🎨 Polish
**Action:** Enhanced the multi-step progress indicator with dopamine-triggering animations:

**Completion burst (when advancing a step):**
- Completed step dot does a satisfying scale pop (`1 → 1.3 → 0.95 → 1`)
- Green ripple ring expands outward and fades
- 6 colored particles burst from the completed dot in all directions
- Checkmark draws in with a stroke animation

**Connector line enhancement:**
- Line fill now uses a gradient (`#10B981 → #34D399`) instead of flat green
- Thickened from 2px to 3px for better visibility
- Shimmer animation plays on the leading edge when filling

**Active step entrance:**
- Active dot scales in with a spring animation (`0.7 → 1.1 → 1.0`)
- Label fades up into place

**Progress encouragement bar:**
- Appears between stepper and content area starting at Step 2
- Step 2: "✨ Great start! Now let's pick some products."
- Step 3: "🎯 Almost there — just the billing details left."
- Step 4: "🎉 Looking good! Review everything and submit." (with gradient background)

**Also fixed:** Product category chips now use inline pill styling (same fix as dashboard status chips from Step 24).

**Why:** Multi-step forms are where users abandon most. Each completed step needs to feel like a micro-achievement — the brain releases dopamine when it sees progress toward a goal. The particle burst + encouraging copy creates a "game-like" sense of momentum that pulls users through to completion. This is the same psychology behind Duolingo's streak animations and Stripe Checkout's progress feel.
**Screenshots:** —
**Outcome:** Stepper transitions now feel celebratory and momentum-building. Each step forward triggers visual reward signals.

---

## Step 28 — Empathetic Order Completion Screen
**When:** 2026-04-07 10:50 PM EST
**Phase:** 🎨 Polish
**Action:** Redesigned the order success screen to be patient-centered and emotionally resonant:

**Impact message system (8 randomized messages):**
Each submission shows a random empathetic message that personalizes with the patient's name. Examples:
- "💛 You just made someone's recovery easier" — "The supplies you ordered will help {name} manage their condition with more comfort and dignity."
- "🌱 This order is someone's fresh start" — "{name} is counting on these supplies to move forward in their recovery journey."
- "🌙 Someone will sleep better tonight" — "{name}'s order is on its way. The right supplies at the right time can change how someone experiences each day."
- "🦋 Small action, big impact" — "For {name}, receiving these supplies means less pain, more independence, or simply a better day."

**Visual enhancements:**
- Gradient checkmark circle (success → primary) with double ripple rings
- 30 confetti particles (up from 20) in 8 colors
- Warm gradient card for the impact message (`primary[50] → success[50] → accent[50]`)
- Order ID pill now includes item count ("ORD-1134 · 3 items")
- Two action buttons: "Back to Dashboard" (secondary) + "Start New Order" (primary)

**Why:** Medical supply orders are deeply transactional — fill fields, click submit, repeat. But behind every order is a patient managing lymphedema, recovering from mastectomy, or dealing with a chronic condition. The empathetic messaging reframes the specialist's daily work from "data entry" to "care delivery." This builds emotional connection to the tool and reminds the team why accuracy matters. It's the difference between a tool that processes orders and a tool that helps people heal.
**Screenshots:** —
**Outcome:** Each order submission now shows a unique, personalized message that centers the patient's wellbeing. Tested with multiple submissions — messages rotate randomly.

---

## Step 29 — Product Image Illustrations
**When:** 2026-04-07 11:00 PM EST
**Phase:** Design
**Action:** Replaced emoji-on-gradient product thumbnails with detailed, realistic SVG product illustrations for all 10 products. Each illustration depicts the actual medical supply (compression sleeve, gauntlet, stockings, prosthetics, bandage kit, bra, foam sheets, donning gloves) using multi-stop gradients, subtle shadows, and knit texture lines. Added product images to both the product catalog cards (Step 2) and a new "Items on their way" showcase section on the success screen.
**Why:** The emoji icons looked cheap and out of place in a professional medical supply system. Realistic illustrations give the product catalog credibility and make the success screen feel like a real order confirmation, not a toy. Since AI image generation was blocked by API quota, hand-crafted SVGs were the best available option.
**Screenshots:** —
**Outcome:** All 10 products have distinct, recognizable illustrations. Product cards show 48px thumbnails alongside details. Success screen displays selected products in a card grid.

---

## Step 30 — Sidebar Navigation Aligned to Design System
**When:** 2026-04-07 11:05 PM EST
**Phase:** Design
**Action:** Rewrote the AppShell sidebar to exactly match the Design System page's sidebar preview. Replaced CSS class-based nav items with a `SidebarNavItem` component using inline styles and `useState` for hover management. Aligned all values: padding (9px 12px), gap (10px), margins (2px), active gradient opacity (0.18/0.10), accent bar color (#4F6AE8), icon size (20px). Updated nav groups to match the design system: ORDERS, BILLING, CATALOG. Matched icons (Dashboard uses clipboard emoji). Logo uses flat backgroundColor instead of gradient.
**Why:** The app sidebar had drifted from the design system spec. Small per-pixel differences (11px vs 9px padding, 4px vs 2px margin) compounded to make it look bloated. Using inline styles from the same tokens eliminates future drift between the design system reference and the live implementation.
**Screenshots:** —
**Outcome:** App sidebar is now pixel-perfect match of the design system sidebar preview.

---

## Step 31 — Disabled Continue Button on Empty Product Selection
**When:** 2026-04-07 11:09 PM EST
**Phase:** Implementation
**Action:** Made the Continue button on Step 2 (Select Products) disabled when no products are selected. Button shows grayed-out appearance (neutral[300] background, not-allowed cursor, 0.7 opacity) and re-enables with full primary styling once at least one product is added.
**Why:** Allowing the user to continue with zero products creates a confusing empty state on the billing step. Disabling the button provides clear visual feedback that a selection is required.
**Screenshots:** —
**Outcome:** Continue button correctly gates on product selection.

---

## Step 32 — Custom Dropdown Component (Portal-Based)
**When:** 2026-04-07 11:13 PM EST
**Phase:** Implementation
**Action:** Built a custom `CustomSelect` dropdown component to replace all native `<select>` elements. Uses `createPortal` to render the dropdown menu into `document.body`, solving the overflow:hidden clipping issue. Features include: styled trigger button matching design system inputs, chevron rotation animation, selected item checkmark, hover highlights, click-outside-to-close, and scroll repositioning. Replaced both the Insurance Provider selector and product size selectors.
**Why:** Native browser selects break the visual consistency of the app. The dropdown was being clipped by parent containers with overflow:hidden. Portal rendering ensures the menu always floats above everything.
**Screenshots:** —
**Outcome:** All dropdowns now render as styled, portal-based custom selects that match the design system.

---

## Step 33 — Text Selection Contrast Fix
**When:** 2026-04-07 11:14 PM EST
**Phase:** Design
**Action:** Added global `::selection` CSS rule scoped to `.medflow-app` that sets text selection to primary blue (#4F6AE8) background with white text. Previously, the browser default selection colors clashed with the app's text colors, making highlighted text hard to read.
**Why:** User flagged that selected text was nearly invisible due to poor contrast between the default browser selection color and the app's text/background colors.
**Screenshots:** —
**Outcome:** Text selection is now crisp and readable across the entire app.

---

## Step 34 — Measurement Form Upload Feature
**When:** 2026-04-07 11:15 PM EST
**Phase:** Implementation
**Action:** Implemented the "Upload measurement form" functionality for products that require body measurements (compression garments, prosthetics). Added `MeasurementFile` interface to track uploaded files. Before upload: shows an upload icon + clickable "Upload measurement form" link. After upload: swaps to a green success pill showing checkmark, truncated filename, and remove button. Accepts PDF, JPG, PNG, WebP files via hidden file input wrapped in a label. File data stored as base64 dataUrl in component state.
**Why:** Compression garments and prosthetics are custom-fitted. Therapists fill out standardized measurement forms that vendors need to fulfill the correct size. This was a placeholder link that needed to become functional.
**Screenshots:** —
**Outcome:** Users can upload and remove measurement forms per product. Upload state persists through the stepper flow.

---

## Step 35 — Replay Page Adapted to Design System
**When:** 2026-04-07 11:20 PM EST
**Phase:** Design
**Action:** Rewrote the Replay page (`/replay`) from a custom dark theme with hardcoded hex values to the MedFlow design system. Light theme with white cards, left-aligned timeline track with colored dots per phase, phase summary chips in the header, SVG icons for UI controls, consistent card styling, and frosted-glass lightbox. All colors, typography, spacing, radii, and shadows now come from design tokens.
**Why:** The dark-themed Replay page was visually disconnected from the rest of the app. Every page should use the same design tokens for consistency.
**Screenshots:** —
**Outcome:** Replay page is fully integrated with the MedFlow design system.

---

## Step 36 — Library Page Adapted to Design System
**When:** 2026-04-07 11:25 PM EST
**Phase:** Design
**Action:** Rewrote the Library page (`/library`) from the same custom dark theme to the MedFlow design system. Pink "Reference Collection" header badge, white cards with consistent borders, design patterns displayed as inline chips, key takeaways styled as primary-tinted info cards with info icons, and matching lightbox component.
**Why:** Same reasoning as the Replay page. All pages must use the shared design tokens for visual coherence.
**Screenshots:** —
**Outcome:** Library page matches the MedFlow design system.

---

## Step 37 — Design System Creator Skill
**When:** 2026-04-07 11:30 PM EST
**Phase:** Documentation
**Action:** Created a reusable `/design-system-creator` skill that captures the complete methodology for building a design system. The skill has 7 phases: gather requirements (app name, domain, primary color), generate color palette (5 roles + neutral, 10 stops each), create design-tokens.ts, build a visual showcase page, create shared CSS, build reusable components (CustomSelect with portal, SidebarNavItem, FormField, SectionHeader), and audit/wire tokens into existing pages. Includes quality standards checklist.
**Why:** The design system creation process was valuable and repeatable. Encoding it as a skill ensures the exact same methodology, token structure, and component patterns can be reused for any future project without re-discovering the approach.
**Screenshots:** —
**Outcome:** Skill saved at `.claude/skills/design-system-creator/skill.md`. Invocable via `/design-system-creator`.

---

## Step 38 — Nano-Banana Image Generation Fixed
**When:** 2026-04-07 11:50 PM EST
**Phase:** Implementation
**Action:** Fixed the nano-banana AI image generation skill. Updated the Gemini model from `gemini-2.0-flash` (which doesn't support image output) to `gemini-2.5-flash-image`. Generated 3 illustrations for the homepage: hero dashboard concept, customer journey flow, and sprint planning board. All images use the MedFlow color palette (blue #4F6AE8, orange #F97316). Validated PNG format and copied to `web/public/images/`.
**Why:** The original model in the code was outdated and didn't support image response modalities. After Steven added billing to his Google AI Studio account, switching to the correct model enabled generation. AI-generated illustrations add visual polish to the presentation without requiring a designer.
**Screenshots:** --
**Outcome:** 3 images generated and ready at `/images/hero-medflow.png`, `/images/journey-flow.png`, `/images/sprint-board.png`.

---

## Step 39 — Homepage Presentation Page Built
**When:** 2026-04-07 11:55 PM EST
**Phase:** Implementation
**Action:** Replaced the dark-themed template landing page with a full presentation page for the AI PM exercise video. The page has 5 sections, all built with MedFlow design tokens (light theme):

1. **Hero** -- Warm welcome ("Hey, I'm Steven"), AI PM Challenge badge, CTAs to prototype and replay, AI-generated hero illustration
2. **Phasing & Roadmap** -- Problem priority ranking (5 pain points with severity badges), customer journey (10-step horizontal flow with Sprint 1 highlighted), app information flow diagram (React component-based), phased sprint cards (4 two-week sprints)
3. **Sprint 1 Deep Dive** -- Problem statement card, 3 key decision cards with rationale, scope boundary (building vs not building yet, green checks vs gray X)
4. **Prototype Walkthrough** -- Browser-frame preview with flow chips, CTA to launch prototype at /app
5. **AI Tools** -- Three tool cards (Conductor, Claude Code, Wispr Flow), CTA to replay page

**Why:** The exercise deliverable requires a 10-minute video presentation. This page serves as the visual backbone: Steven can screen-share it while recording, with each section mapping to a video segment. The page tells the full product story from problem discovery through Sprint 1 design.
**Screenshots:** --
**Outcome:** Homepage live at localhost:3000/. All sections rendering with design system tokens, hover effects, and AI-generated hero image.

---

## Step 40 — Global Text Selection Contrast Fix
**When:** 2026-04-08 12:02 AM EST
**Phase:** 🎨 Polish
**Action:** Added global `::selection` and `::-moz-selection` CSS rules to `web/src/index.css` with white text on primary blue (#4F6AE8). Previously, text selection was only styled inside the prototype (`.medflow-app` scope), causing unreadable contrast on the homepage and other pages.
**Why:** Steven spotted the issue when highlighting text on the homepage hero section. The default browser selection (blue bg on gray text) was nearly invisible. A site-wide fix ensures consistent, readable text selection everywhere.
**Screenshots:** --
**Outcome:** Text selection now uses white-on-blue contrast across all pages.

---

## Step 41 — Cinematic Intro for Replay Page
**When:** 2026-04-08 12:05 AM EST
**Phase:** 🎨 Polish
**Action:** Built a full cinematic intro sequence for the `/replay` page. Phase-based animation system: text groups fade in together, hold, then cross-fade to the next phase. Dark background (#06080E) with slow-drifting ambient glows and a self-drawing horizontal centerline. Skip button in top-right. 5 phases of narrative text building anticipation before revealing the timeline.
**Why:** The replay page is the core deliverable showing the AI PM workflow. A cinematic intro creates expectation and frames the timeline as a story, not just a log. Inspired by product launch videos (Money Printer style).
**Screenshots:** --
**Outcome:** Cinematic intro plays before timeline. Smooth transitions, no blur/jitter.

---

## Step 42 — Cinematic Intro v2: Bigger Text, Smoother Animations
**When:** 2026-04-08 12:08 AM EST
**Phase:** 🎨 Polish
**Action:** Rewrote the cinematic intro after Steven's feedback that text was too small and entrance animation looked "struggling." Changes: font sizes tripled to `clamp(2.2rem, 5vw, 3.5rem)` for XL lines, removed `filter: blur()` (which caused GPU jitter), switched to pure opacity + translateY with long cubic-bezier easing (0.25, 0.46, 0.45, 0.94). Phase-based grouping: lines appear as groups that fade in/hold/fade out together instead of one-by-one.
**Why:** The blur filter was triggering GPU compositing per-frame, making each letter look like it was fighting to appear. Pure opacity transitions are hardware-accelerated and buttery smooth. Bigger text fills the dark screen cinematically.
**Screenshots:** --
**Outcome:** Text is now 56px on desktop, transitions are silky smooth, no jitter.

---

## Step 43 — Scroll-Reveal + Narrative Interstitials + Timeline Finale
**When:** 2026-04-08 12:10 AM EST
**Phase:** 🎨 Polish
**Action:** Added three engagement layers to the replay timeline:

1. **Scroll-reveal animations** -- Every timeline card wrapped in `RevealOnScroll` using IntersectionObserver. Cards fade up (opacity + translateY over 700ms) as they enter the viewport. One-shot observer disconnects after triggering.
2. **9 narrative interstitials** -- Cinematic text breaks inserted between key timeline sections. Each has an emoji, bold statement + italic reflection, and a decorative gradient line. Examples: "The form works. But 'works' is a low bar. Let's make it delightful." (before step 26), "The prototype is done. Now let's tell the story of how it was built." (before step 35).
3. **Timeline finale** -- Gradient orb with sparkle emoji, "39 steps. One evening. Human + machine." with staggered reveal animation at the bottom.

**Why:** The recruiter is the audience. Raw timeline cards are informative but not engaging. Interstitials create a narrative arc (setup, build, polish, ship) that keeps them scrolling. Scroll-reveal prevents the "wall of cards" overwhelm by progressively revealing content.
**Screenshots:** --
**Outcome:** Timeline now tells a story. Cards reveal on scroll, interstitials provide breathing room, finale creates a satisfying ending.

---

## Step 44 — Steven's Photo + WhatsApp Sticker in Cinematic Intro
**When:** 2026-04-08 12:12 AM EST
**Phase:** 🎨 Polish
**Action:** Added Steven's rounded photo to the cinematic intro as a new first phase. Photo has a rotating conic-gradient ring (primary blue to accent orange, 6s infinite rotation). Below: "Hey, I'm Steven" in large italic blue text, with "moonlightlabs.me" as a clickable link. Also generated a WhatsApp sticker version of Steven's photo using nano-banana (Gemini 2.5 Flash Image) with cartoon/sticker style, saved to `web/public/images/steven-whatsapp-sticker.png`.
**Why:** Putting a face to the name immediately humanizes the presentation. The rotating gradient ring adds premium visual polish. The website link gives the recruiter a way to learn more. The WhatsApp sticker demonstrates creative use of AI image generation tools.
**Screenshots:** --
**Outcome:** Intro now opens with Steven's photo + name + website link before the narrative sequence. WhatsApp sticker generated and saved.

---

## Step 45 — URL Rendering in Replay Timeline Cards
**When:** 2026-04-07 11:50 PM EST
**Phase:** Polish
**Action:** Built a RichText component that parses URLs and backtick-delimited code in timeline card text. URLs render as clickable links showing just the domain name. Applied across action text, outcome pills, and "why" sections.
**Why:** Raw URLs were displaying as plain text in the timeline, making references to tools, docs, and websites non-functional. Recruiters reviewing the replay should be able to click through to see what was referenced.
**Outcome:** All URLs in replay cards are now clickable links. Code snippets render in monospace.

---

## Step 46 — Replay Page Polish: Skip Button Removed + Concise Anchor
**When:** 2026-04-07 11:55 PM EST
**Phase:** Polish
**Action:** Removed the "Skip Intro" button from the cinematic intro. Added a concise one-line anchor before the timeline using the NarrativeInterstitial component: "Each card below is one step I took, in real time." Matches the style of section dividers throughout the page.
**Why:** The skip button undermined the cinematic experience. The anchor gives readers a mental model for what they are about to scroll through, without being verbose.
**Outcome:** Cleaner intro flow. Readers get oriented with a single line before the timeline starts.

---

## Step 47 — Empathy Map Replaced Customer Journey
**When:** 2026-04-08 12:10 AM EST
**Phase:** Presentation
**Action:** Replaced the simple emoji-box customer journey on the homepage with a structured empathy map table. Shows 5 stages (Discovery, Setup, Daily Use, Billing, Scaling) with columns for actions, feelings (with emoji + color temperature), pain points, and sprint mapping.
**Why:** The original customer journey was a flat list of emoji boxes. The empathy map format communicates more product thinking: showing the emotional arc alongside actions and pain points demonstrates deeper user understanding. This is what an AI PM would present.
**Outcome:** Empathy map renders as a styled table with feeling indicators and sprint labels.

---

## Step 48 — 2D Branching Flow Diagram
**When:** 2026-04-08 12:20 AM EST
**Phase:** Presentation
**Action:** Rebuilt the "App Information Flow" section on the homepage from a flat linear diagram into a proper 2D branching architecture diagram. Row 1 shows the main order flow (Therapist Order, MedFlow hub, Manager Approval, Vendor Order). A vertical branch from MedFlow leads to Row 2 showing the data layer (Product Catalog + Fee Schedules, Auto-Pricing, Document outputs). Sprint labels at the bottom map each component to delivery phases.
**Why:** The previous flat diagram showed boxes in a single row which didn't communicate the system's branching architecture. MedFlow is a hub with both horizontal flow (order lifecycle) and vertical branching (data/pricing layer). The 2D layout makes the architecture legible at a glance.
**Outcome:** Flow diagram now shows branching architecture with proper hub-and-spoke layout from MedFlow. TypeScript compiles clean.

---

<!-- New entries go below this line -->
