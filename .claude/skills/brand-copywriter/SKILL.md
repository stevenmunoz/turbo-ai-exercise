---
name: brand-copywriter
description: Write and review all user-facing copy following brand voice guidelines. Use this skill when writing ANY in-app text including UI labels, button text, success messages, error messages, loading states, warnings, alerts, empty states, onboarding copy, modal text, tooltips, placeholders, notifications, or microcopy. Also use when reviewing existing copy for brand alignment, when the user asks to "write copy", "improve the text", "make it sound more friendly", or when implementing new features that need user-facing strings. Triggers on any task involving text that users will read in the app.
---

# Brand Copywriter

Write all user-facing copy following the project's brand voice guidelines.

## Before Writing Any Copy

Read [references/voice-rules.md](references/voice-rules.md) for the complete voice rules, word swaps, and copy catalog organized by category (success, errors, warnings, empty states, buttons, forms, loading).

## Quick Voice Check

Every piece of copy must pass these 5 checks:

1. **Would you text this to a friend?** If it sounds like a legal notice or software manual, rewrite it.
2. **Contractions used?** "You're", "we'll", "don't", not "you are", "we will", "do not".
3. **No em dashes?** Use commas, periods, or rewrite instead.
4. **Brand vocabulary?** Use the project's preferred terms (defined in voice-rules.md) instead of generic software jargon.
5. **Empathy before action?** Acknowledge the situation, then offer the path forward.

## Writing Workflow

When asked to write copy, follow this process:

1. Identify the copy category (success, error, warning, empty state, button, form, loading, onboarding)
2. Read the matching pattern in `references/voice-rules.md`
3. Write copy following that pattern's structure
4. Run the 5-point voice check above
5. Output the final copy as ready-to-use strings

## Copy Review Workflow

When asked to review existing copy:

1. Read the target file
2. Flag any strings that violate voice rules (formal language, em dashes, jargon, missing contractions)
3. Provide brand-aligned rewrites for each flagged string
4. Show before/after comparison

## Category Quick Reference

| Category | Tone | Example |
|----------|------|---------|
| **Success** | Celebratory, short | "Done!" / "Saved!" / "All set!" |
| **Loading** | Playful, descriptive | "Working on it..." / "Almost there..." |
| **Warning** | Casual question + reassurance | "Hmm, that doesn't look right. Want to try again?" |
| **Error** | Friendly + actionable | "Something went wrong. Here's what you can do..." |
| **Empty state** | Encouraging nudge | "Nothing here yet. Let's change that!" |
| **Button** | Active, clear | "Get Started" / "Save Changes" / "Try Again" |
| **Form label** | Conversational | "What's your name?" / "Email address" |
| **Placeholder** | Example-driven | "Search by name or keyword..." |

## Multilingual Support

If the project supports multiple languages, ensure:
- All copy is written in the primary language first
- Translations maintain the same tone and voice
- Language-specific punctuation rules are followed (e.g., inverted punctuation in Spanish)
- Accents and diacritical marks are always correct
