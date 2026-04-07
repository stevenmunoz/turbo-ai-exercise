---
name: nano-banana
description: Generate AI images using Google Gemini 3 Pro (Nano Banana). Use for mockups, illustrations, marketing assets, empty state images, icons. Say "generate an image of..." to use.
---

# Nano Banana - AI Image Generation

## Quick Start

1. Ensure `nano-banana/.env` exists with `GEMINI_API_KEY`
2. Run: `cd nano-banana && pip install -r requirements.txt`

---

## Project Default Style

Define your project's default illustration style here. When generating brand-consistent images, reference this style by name in prompts.

**To set up your project style:**

1. Define your brand colors, line weight, and composition rules
2. Create example prompts that demonstrate the style
3. Save as a reusable style in the style library

**Example style definition (customize for your project):**

```
Style Rules:
1. Line weight and outline style (e.g., thin black outlines, bold strokes)
2. Fill approach (e.g., minimal fills, flat color, gradient)
3. Accent color and where to use it (e.g., #7f3dff on small elements only)
4. Background (e.g., white, gradient, textured)
5. Composition (e.g., airy with whitespace, dense and detailed)
6. Mood (e.g., professional yet warm, playful, minimalist)
```

### Composition Anti-Patterns (CRITICAL)

Gemini has predictable failure modes. ALWAYS include these guardrails in prompts:

| Failure Mode | What Happens | Fix in Prompt |
|-------------|-------------|---------------|
| **Tiny subject** | Drawing occupies 30% of canvas, rest is empty | "The subject should be prominent, centered, and fill the frame well" |
| **Device mockup leak** | Gemini adds phone/tablet frames around the illustration | "No phone frames, no device mockups — just the scene" |
| **Heavy strokes** | Outlines are thick like a coloring book | "Thin black outlines only — sketchy, light linework" |
| **Over-colored** | Fills everywhere, looks like clip art | "Minimal fills — leave most areas white/unfilled" |
| **Color overuse** | Large colored backgrounds or fills | "Accent color ONLY on small elements" |

---

## Golden Rules of Prompting

**Rule 1: Edit, Don't Re-roll**
If an image is 80% correct, ask for specific changes instead of starting over. Each refinement gives Gemini more context.

**Rule 2: Natural Language, Not Tag Soup**
Write full sentences like you're briefing a designer, not comma-separated keywords.

```
# BAD (tag soup)
cat, orange tabby, sitting, window, sunlight, cozy, 8k, hyperrealistic

# GOOD (natural language)
An orange tabby cat sitting on a windowsill, bathed in warm afternoon
sunlight. The scene feels cozy and intimate, with soft focus on the background.
```

**Rule 3: Be Specific and Descriptive**
Include subject, setting, lighting, mood, textures, materials, composition. Gemini can handle extensive detail.

**Rule 4: Provide Context**
Tell the "why" or "for whom" - context shapes creative choices.

```
# Without context
A portrait of a golden retriever

# With context
A portrait of a golden retriever for a premium pet food brand campaign,
conveying trust, health, and vitality
```

---

## Core Functions

### generate(prompt, reference_images=None, aspect_ratio="1:1", resolution="1K")

Generate or refine an image. Supports iterative refinement via persistent session.

```python
import sys
sys.path.insert(0, 'nano-banana')
from image_gen import generate, new_session

generate("A golden retriever puppy")  # Creates image
generate("Add a purple bandana")       # Refines previous image
```

### new_session()

Clear history to start fresh (stops refinement of previous images).

```python
from image_gen import new_session
new_session()  # Session cleared. Ready for new image generation.
```

### session_info()

Check current session state.

```python
from image_gen import session_info
session_info()  # Current session: 2 turn(s)
```

### revert(turns=1)

Undo last N turns (useful if a refinement went wrong).

```python
from image_gen import revert
revert()      # Reverted 1 turn(s). Now at turn 1.
revert(2)     # Revert 2 turns
```

---

## Style Library Functions

### list_styles()

Show all saved styles in your library.

```python
from style_library import list_styles
list_styles()  # Displays available styles with IDs
```

### use_style(style_id, subject)

Apply a saved style to a new subject.

```python
from style_library import use_style
use_style("retro-90s", "a cat playing piano")
```

### save_style(name, category, tags)

Save the current session's prompt as a reusable style.

```python
from style_library import save_style
save_style(
    name="Bold Tech Landing",
    category="Marketing",
    tags=["hero", "gradient", "modern"]
)
```

### extract_style(image_path)

Extract detailed style information from any image.

```python
from style_extract import extract_style
style = extract_style("outputs/output_001.png")
# Returns: color palette, lighting, composition, mood, textures...
```

---

## Advanced Patterns

### Reference Images

Use existing images to guide style or maintain character consistency.

```python
# Single style reference
generate("A dog in a superhero costume",
         reference_images=["style-reference.jpg"])

# Multiple subject references (better accuracy)
generate("Create a portrait of this cat",
         reference_images=["cat-front.jpg", "cat-side.jpg", "cat-playing.jpg"])
```

**Pro tip**: 3-5 reference photos from different angles gives best character consistency.

### Grid Generation

Create multiple views or character sheets in one image.

```python
# Character sprite sheet
generate("""Create a 3x3 grid showing a cartoon cat character:
Row 1: front view, side view, back view
Row 2: sitting, jumping, sleeping
Row 3: happy expression, surprised, playful
Maintain consistent style across all 9 cells.""")
```

### Variants Workflow

Generate multiple interpretations, pick the best, then refine.

```python
# Generate 3 variants (use new_session between each)
new_session()
generate("A cozy cafe interior, warm lighting")  # Variant 1

new_session()
generate("A cozy cafe interior, warm lighting")  # Variant 2

new_session()
generate("A cozy cafe interior, warm lighting")  # Variant 3

# Review all three in outputs/, pick favorite, then iterate on that one
generate("Add more plants and a cat sleeping on a cushion")
```

---

## Parameters Reference

| Parameter | Options | Default | Use Case |
|-----------|---------|---------|----------|
| aspect_ratio | 1:1, 16:9, 9:16, 4:5, 3:2 | 1:1 | Shape of output |
| resolution | 1K, 2K, 4K | 1K | 1K for drafts, 2K for finals |
| reference_images | list of paths | None | Style/subject guidance |

### Aspect Ratio Guide

| Ratio | Best For |
|-------|----------|
| 1:1 | App icons, avatars, social posts |
| 16:9 | Landing page heroes, presentations, YouTube |
| 9:16 | Mobile stories, phone wallpapers |
| 4:5 | Social feed posts |
| 3:2 | Classic photo ratio |

---

## Style Library Categories

When saving styles, use these categories:

| Category | Use For |
|----------|---------|
| Framework | 2x2 matrices, pyramids, Venn diagrams |
| Flow | Process diagrams, journey maps, flowcharts |
| Architecture | Hierarchy diagrams, system diagrams |
| Mockup | Wireframes, UI concepts, device frames |
| Persona | Portraits, lifestyle shots, character images |
| Marketing | Ads, social posts, banners, heroes |
| Artistic | Illustrations, photography styles, retro looks |

---

## Output Location

Images saved to: `nano-banana/outputs/output_NNN_HHMMSS.png`

Style library: `nano-banana/styles/`

### PNG Format Validation

**Gemini sometimes outputs JPEG data with a `.png` extension.** Always validate after generating images:

```bash
# Check if the file is actually a PNG
file path/to/image.png
# If it says "JPEG image data" instead of "PNG image data", re-encode:
sips -s format png path/to/image.png --out path/to/image.png
```

---

## Cost

~$0.10 per image (Google Gemini pay-as-you-go pricing)

---

## Setup Instructions

1. Get API key from https://aistudio.google.com/apikey
2. Click "Get API Key" -> "Create API key"
3. Enable billing (required for Gemini 3 Pro)
4. Create `nano-banana/.env` with `GEMINI_API_KEY=AIza...`
5. Install: `cd nano-banana && pip install -r requirements.txt`

---

## Troubleshooting

- **"API key not found"**: Check `.env` file exists in `nano-banana/` with correct key
- **"Billing not enabled"**: Enable billing in Google AI Studio settings
- **"Rate limit exceeded"**: Wait a moment and retry
- **Image not visible**: Open `nano-banana/outputs/` folder to view generated images
- **Style not found**: Run `list_styles()` to see available styles
- **Build fails with "file failed to compile"**: The PNG is actually a JPEG. Re-encode with `sips -s format png file.png --out file.png`
