"""Nano Banana - AI Image Generation using Google Gemini."""

import os
import base64
import re
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment
_env_path = Path(__file__).parent / ".env"
load_dotenv(_env_path)

_OUTPUTS = Path(__file__).parent / "outputs"
_OUTPUTS.mkdir(exist_ok=True)

# Session history for iterative refinement
_history: list[types.Content] = []
_generated_images: list[str] = []

def _get_client() -> genai.Client:
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY not found. Create nano-banana/.env with your key.")
    return genai.Client(api_key=key)

def _next_output_path() -> str:
    existing = list(_OUTPUTS.glob("output_*.png"))
    nums = []
    for f in existing:
        m = re.match(r"output_(\d+)", f.stem)
        if m:
            nums.append(int(m.group(1)))
    next_num = max(nums, default=0) + 1
    ts = datetime.now().strftime("%H%M%S")
    return str(_OUTPUTS / f"output_{next_num:03d}_{ts}.png")

def generate(
    prompt: str,
    reference_images: list[str] | None = None,
    aspect_ratio: str = "1:1",
    resolution: str = "1K",
) -> str:
    """Generate or refine an image. Returns the output file path."""
    global _history, _generated_images

    client = _get_client()

    # Build parts
    parts: list[types.Part] = []

    # Add reference images if provided
    if reference_images:
        for img_path in reference_images:
            img_data = Path(img_path).read_bytes()
            ext = Path(img_path).suffix.lower()
            mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(ext.lstrip("."), "image/png")
            parts.append(types.Part.from_bytes(data=img_data, mime_type=mime))

    parts.append(types.Part.from_text(text=prompt))

    # Add to history
    _history.append(types.Content(role="user", parts=parts))

    # Resolution config
    res_pixels = {"1K": 1024, "2K": 2048, "4K": 4096}.get(resolution, 1024)

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=_history,
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    # Extract image from response
    out_path = _next_output_path()
    found_image = False

    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            img_bytes = part.inline_data.data
            if isinstance(img_bytes, str):
                img_bytes = base64.b64decode(img_bytes)
            Path(out_path).write_bytes(img_bytes)
            found_image = True
            break
        elif hasattr(part, "text") and part.text:
            print(f"Model response: {part.text}")

    if not found_image:
        raise RuntimeError("No image generated. Try rephrasing the prompt.")

    # Add response to history for iterative refinement
    _history.append(response.candidates[0].content)
    _generated_images.append(out_path)

    print(f"Image saved to: {out_path}")
    return out_path

def new_session():
    """Clear session history to start fresh."""
    global _history, _generated_images
    _history = []
    _generated_images = []
    print("Session cleared. Ready for new image generation.")

def session_info():
    """Show current session state."""
    turns = len(_history) // 2
    print(f"Current session: {turns} turn(s)")
    if _generated_images:
        print(f"Generated images: {', '.join(_generated_images)}")

def revert(turns: int = 1):
    """Undo last N turns."""
    global _history, _generated_images
    to_remove = min(turns * 2, len(_history))
    _history = _history[:-to_remove] if to_remove else _history
    img_remove = min(turns, len(_generated_images))
    _generated_images = _generated_images[:-img_remove] if img_remove else _generated_images
    print(f"Reverted {turns} turn(s). Now at turn {len(_history) // 2}.")
