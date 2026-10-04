"""Compile original ImageGen PNGs to the committed pixel-art game sizes.

Authoring tool only: requires Pillow. Vite copies the already optimized files.
Usage: python3 scripts/optimize-new-realm-art.py /path/to/originals
"""

from pathlib import Path
import argparse
from PIL import Image

ASSETS = {
    "terrain/desert-floor.png": (512, False),
    "terrain/ice-floor.png": (512, False),
    "sprites/monsters/deathwisp-1201.png": (256, True),
    "sprites/monsters/buraq-83.png": (256, True),
    "sprites/monsters/chuul-9189.png": (256, True),
    "sprites/monsters/dogmole-8965.png": (256, True),
}


def compile_art(source_root: Path, target_root: Path) -> None:
    for relative, (size, transparent) in ASSETS.items():
        source = source_root / relative
        target = target_root / relative
        with Image.open(source) as original:
            if original.size != (1254, 1254):
                raise ValueError(f"{relative}: expected 1254 × 1254 original")
            mode = "RGBA" if transparent else "RGB"
            compiled = original.convert(mode).resize((size, size), Image.Resampling.NEAREST)
            if transparent:
                alpha_min, alpha_max = compiled.getchannel("A").getextrema()
                if alpha_min != 0 or alpha_max == 0:
                    raise ValueError(f"{relative}: sprite transparency was lost")
            target.parent.mkdir(parents=True, exist_ok=True)
            compiled.save(target, "PNG", optimize=True, compress_level=9)
            print(f"{relative}: {size} × {size}, {target.stat().st_size} bytes")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("originals", type=Path)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "public")
    args = parser.parse_args()
    compile_art(args.originals, args.output)
