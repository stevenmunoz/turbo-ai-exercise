"""Generate product images for MedFlow catalog."""
import sys
sys.path.insert(0, '.')
from image_gen import generate, new_session

STYLE = """Clean product photography style on a pure white background.
The product should be centered, well-lit with soft studio lighting, and fill about 70% of the frame.
No text, no labels, no packaging boxes. Just the product itself, floating on white.
Professional medical supply catalog aesthetic. Soft shadows underneath."""

products = [
    ("p1", "A beige/tan flat-knit compression sleeve for the arm, medical grade, showing the full length from wrist to upper arm. Fabric has a visible knit texture."),
    ("p2", "A beige compression gauntlet/glove for the hand and wrist, fingerless, medical grade compression garment. Smooth knit fabric."),
    ("p3", "A pair of tan/beige thigh-high compression stockings, medical grade, neatly folded or displayed showing their full length. Smooth circular knit fabric."),
    ("p4", "A skin-tone silicone breast prosthetic form, full size, teardrop shape, realistic and natural looking. Medical prosthesis."),
    ("p5", "A small skin-tone silicone partial breast prosthetic form, crescent/shell shape. Medical prosthesis, smaller than a full form."),
    ("p6", "A navy blue nighttime compression garment set laid out, consisting of a sleeve with foam channel padding inside. Velcro straps visible."),
    ("p7", "A multi-layer compression bandage kit, showing rolled elastic bandages in white and beige, neatly arranged. Short-stretch medical bandages."),
    ("p8", "A white post-surgical mastectomy bra, front-closure, with bilateral pockets visible. Soft cotton/lycra fabric, no underwire."),
    ("p9", "A stack of 6 thin beige closed-cell foam padding sheets, about 12x12 inches each, slightly flexible. Medical foam for under compression garments."),
    ("p10", "A pair of orange/coral rubber donning gloves for putting on compression garments. Textured grip surface, wrist-length."),
]

for pid, desc in products:
    new_session()
    prompt = f"{STYLE}\n\nSubject: {desc}"
    try:
        path = generate(prompt, aspect_ratio="1:1", resolution="1K")
        # Rename to product ID
        import shutil
        target = f"outputs/{pid}.png"
        shutil.move(path, target)
        print(f"  -> Saved as {target}")
    except Exception as e:
        print(f"  ERROR generating {pid}: {e}")
