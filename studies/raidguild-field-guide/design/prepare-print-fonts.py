"""Derive web and print fonts from Louchi's six supplied Last Duel OTF cuts.

Install design/requirements-fonts.txt, then run this script.

The original OTFs live under studies/raidguild-field-guide/fonts/source and are kept
outside the reusable brand-system package. Font output is deterministic.
"""
from pathlib import Path
from fontTools.ttLib import TTFont, newTable
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen


ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "fonts"
CUTS = (
    "Ex2",
    "BoldEx2",
    "Oblique",
    "BoldOblique",
    "Ex2Retalic",
    "BoldEx2Retalic",
)


def to_truetype(source: Path, destination: Path) -> None:
    """Convert CFF outlines to quadratic glyphs usable by ReportLab."""
    font = TTFont(source)
    font.recalcTimestamp = False
    glyph_set = font.getGlyphSet()
    glyphs = {}
    for name in font.getGlyphOrder():
        pen = TTGlyphPen(glyph_set)
        glyph_set[name].draw(Cu2QuPen(pen, max_err=1.0, reverse_direction=True))
        glyphs[name] = pen.glyph()
    glyf = newTable("glyf")
    glyf.glyphs = glyphs
    glyf.glyphOrder = font.getGlyphOrder()
    font["glyf"] = glyf
    font["loca"] = newTable("loca")
    maxp = newTable("maxp")
    maxp.tableVersion = 0x00010000
    maxp.numGlyphs = len(glyphs)
    for field in (
        "maxPoints", "maxContours", "maxCompositePoints", "maxCompositeContours",
        "maxZones", "maxTwilightPoints", "maxStorage", "maxFunctionDefs",
        "maxInstructionDefs", "maxStackElements", "maxSizeOfInstructions",
        "maxComponentElements", "maxComponentDepth",
    ):
        setattr(maxp, field, 1 if field == "maxZones" else 0)
    font["maxp"] = maxp
    font["post"].formatType = 3.0
    for table in ("CFF ", "CFF2", "VORG"):
        if table in font:
            del font[table]
    font.sfntVersion = "\x00\x01\x00\x00"
    font.flavor = None
    font.save(destination, reorderTables=True)


for cut in CUTS:
    source = FONTS / "source" / f"LastDuel-{cut}.otf"
    font = TTFont(source)
    font.recalcTimestamp = False
    font.flavor = "woff2"
    font.save(FONTS / f"LastDuel-{cut}.woff2", reorderTables=True)
    # The source OTFs are CFF; ReportLab needs TrueType outlines for print.
    to_truetype(source, FONTS / f"LastDuel-{cut}.ttf")
    print(f"Prepared LastDuel-{cut}")

# Existing regular/bold print cuts are retained; instantiate native italics.
from fontTools.varLib.instancer import instantiateVariableFont
for weight, name in ((400, "Italic"), (700, "BoldItalic")):
    body = TTFont(FONTS / "Ubuntu-Italic-Variable.ttf")
    body.recalcTimestamp = False
    instantiateVariableFont(body, {"wght": weight}, inplace=True)
    body.save(FONTS / f"Ubuntu-{name}.ttf")
