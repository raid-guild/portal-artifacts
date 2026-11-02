"""Build review and ledger PDFs from this checkout's Field Guide sources.

Run after installing requirements.txt and `npm ci` in this directory. Outputs
are written to a caller-supplied directory; the approved public PDF is not
overwritten by this proof command.
"""
import argparse
from pathlib import Path
import subprocess
import sys


PRINT = Path(__file__).resolve().parent
STUDY = PRINT.parent


def run(*args, cwd=STUDY):
    subprocess.run(args, cwd=cwd, check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path, help="Directory for proof PDFs")
    args = parser.parse_args()
    out = args.output.resolve()
    out.mkdir(parents=True, exist_ok=True)
    run("node", "build.mjs")
    run(sys.executable, "layouts/make-review-pdf-v7.py", str(out))
    run("node", str(PRINT / "export-dense.cjs"), str(out / "dense-pages.pdf"), cwd=PRINT)
    reading = out / "raidguild-field-guide-review.pdf"
    run(
        sys.executable, "layouts/assemble-print-edition-v7.py",
        str(out / "raidguild-field-guide-integrated-base-v7.pdf"),
        str(out / "dense-pages.pdf"), str(reading),
    )
    run(
        sys.executable, str(PRINT / "impose-ledger.py"), str(reading),
        str(out / "raidguild-field-guide-ledger-booklet.pdf"),
        "--map", str(out / "imposition-map.json"),
        "--instructions", str(out / "ledger-print-instructions.txt"),
    )
    print(f"Reading and ledger proofs: {out}")


if __name__ == "__main__":
    main()
