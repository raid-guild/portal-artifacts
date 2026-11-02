"""Impose a 35-page 7 × 10 guide as a nine-sheet 11 × 17 folded proof."""
import argparse
import json
from pathlib import Path

from pypdf import PdfReader, PdfWriter, Transformation
from pypdf.generic import BooleanObject, DictionaryObject, NameObject


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="35-page reading PDF")
    parser.add_argument("output", type=Path, help="18-side ledger PDF")
    parser.add_argument("--map", dest="map_path", type=Path, help="Optional imposition JSON")
    parser.add_argument("--instructions", type=Path, help="Optional print instructions")
    args = parser.parse_args()
    reader = PdfReader(args.source)
    if len(reader.pages) != 35:
        raise ValueError(f"Expected 35 reading pages, found {len(reader.pages)}")

    # The added blank falls immediately inside the back cover.
    logical = list(range(1, 35)) + [None, 35]
    n = len(logical)
    width, height, panel, margin = 1224, 792, 612, 18
    writer = PdfWriter()
    mapping = []
    for sheet in range(n // 4):
        for side, slots in (
            ("front", [n - 2 * sheet, 1 + 2 * sheet]),
            ("back", [2 + 2 * sheet, n - 1 - 2 * sheet]),
        ):
            target = writer.add_blank_page(width=width, height=height)
            placed = []
            for half, folio in enumerate(slots):
                original = logical[folio - 1]
                placed.append({"foldedFolio": folio, "sourcePage": original})
                if original is None:
                    continue
                page = reader.pages[original - 1]
                if page.get("/Rotate", 0):
                    raise ValueError(f"Source page {original} is rotated")
                pw, ph = float(page.mediabox.width), float(page.mediabox.height)
                scale = min((panel - 2 * margin) / pw, (height - 2 * margin) / ph)
                x = panel - pw * scale if half == 0 else panel
                y = (height - ph * scale) / 2
                transform = (
                    Transformation()
                    .translate(-float(page.mediabox.left), -float(page.mediabox.bottom))
                    .scale(scale)
                    .translate(x, y)
                )
                target.merge_transformed_page(page, transform)
            target.pop(NameObject("/Annots"), None)
            mapping.append({"sheet": sheet + 1, "side": side, "left": placed[0], "right": placed[1]})

    actual = [slot["sourcePage"] for item in mapping for slot in (item["left"], item["right"]) if slot["sourcePage"] is not None]
    assert sorted(actual) == list(range(1, 36))
    assert mapping[0]["left"]["sourcePage"] == 35 and mapping[0]["right"]["sourcePage"] == 1
    assert mapping[1]["right"]["sourcePage"] is None
    writer.add_metadata({
        "/Title": "RaidGuild Field Guide - 11x17 Folded Booklet Proof",
        "/Author": "RaidGuild",
        "/Subject": "Already imposed: 9 ledger sheets, duplex short-edge, landscape, actual size; one blank inside back cover.",
    })
    writer._root_object[NameObject("/ViewerPreferences")] = DictionaryObject({
        NameObject("/Duplex"): NameObject("/DuplexFlipShortEdge"),
        NameObject("/PrintScaling"): NameObject("/None"),
        NameObject("/PickTrayByPDFSize"): BooleanObject(True),
    })
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("wb") as stream:
        writer.write(stream)
    result = PdfReader(args.output)
    assert len(result.pages) == 18
    assert all((float(p.mediabox.width), float(p.mediabox.height)) == (width, height) for p in result.pages)
    if args.map_path:
        args.map_path.write_text(json.dumps(mapping, indent=2) + "\n")
    if args.instructions:
        lines = [
            "RAIDGUILD FIELD GUIDE - LEDGER BOOKLET PROOF", "",
            "Paper: Ledger / Tabloid 11 x 17 inches", "Orientation: Landscape", "Scale: Actual size / 100%",
            "Pages per sheet: 1 (the PDF already contains two book pages per side)", "Duplex: Flip on short edge",
            "Booklet / multiple-page mode: OFF", "Sheets: 9, printed on both sides, 18 PDF pages", "",
            "Print PDF pages 1-2 first as a duplex test. Fold that sheet: front cover outside right, back cover outside left, blank inside the back cover. Then print the complete file.",
            "Keep sheets in output order, nest them with sheet 1 outside and sheet 9 in the center, then fold the whole stack down the middle. Staple through the fold if desired.", "",
            "Folded paper: 8.5 x 11 inches. Artwork is scaled proportionally with a quarter-inch top/bottom safe margin and aligned to the fold so illustrated spreads meet. Outer white margins remain; no cropping. The 35-page guide includes one added blank inside the back cover, making 36 folded pages.", "",
            "SHEET ORDER (folded folios, not source page numbers)",
        ]
        for sheet in range(9):
            front, back = mapping[sheet * 2:sheet * 2 + 2]
            lines.append(f"Sheet {sheet + 1}: front {front['left']['foldedFolio']} | {front['right']['foldedFolio']}; back {back['left']['foldedFolio']} | {back['right']['foldedFolio']}")
        args.instructions.write_text("\n".join(lines) + "\n")
    print("Created 18 ledger sides from 35 reading pages; one blank inside back cover.")


if __name__ == "__main__":
    main()
