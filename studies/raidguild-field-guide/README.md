# RaidGuild Field Guide

An illustrated, static Guild field guide with a modern longform website, an
alternate paginated reader, interactive map and machine annotations, fourteen
selectable classes, and a 35-page print edition. It runs under the existing
Portal Artifacts service at `/raidguild-field-guide/` with no login or backend.

## Source and published output

Edit this study, then run from this directory:

```sh
node build.mjs
node test.mjs
```

`publication.json` holds the original illustrated source and annotation
geometry. `content-studies.json` adds the workbook material. `compose-publication.mjs`
resolves them into `public/raidguild-field-guide/publication.json` (35 pages,
18 spreads). `content/field-guide.mjs` adapts that shared content for the
longform website. `web-render.mjs` and `publication-render.mjs` render the
website and book reader. The source and published build should change together.
The approved published PDF is `public/raidguild-field-guide/raidguild-field-guide-print.pdf`.

The website opens by default at `/raidguild-field-guide/`; `#book-cover` opens
the paginated reader. `#longform-history`, `#longform-classes`, and other
section fragments open the longform view. The joining and kingdom maps have
their own retained fragments. The can poster is always available; **Explore
in 3D** loads its local Three.js model on demand. On the website the class
portraits and illustration notes are selectable. Workbook sheets appear only
in the book and print edition.

To preview locally, serve the repository `public/` directory and open
`/raidguild-field-guide/`. For example, from the repository root:

```sh
python3 -m http.server 8787 --directory public
```

## Print proofs

The checked-in 7 × 10 reading PDF is the approved review proof. To make a new
proof without replacing it, install the print tool dependencies (Python 3.11+
and Node 20+):

```sh
cd studies/raidguild-field-guide/print
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
npm ci
npx playwright install chromium
.venv/bin/python build.py ./proof-output
```

`build.py` rebuilds the HTML and resolved publication, renders the illustrated
base with ReportLab, exports the dense pages with Chromium print CSS, merges
them into `raidguild-field-guide-review.pdf`, then creates
`raidguild-field-guide-ledger-booklet.pdf`. The proof folder also gets a page
map and print instructions. The font TTFs required by ReportLab are checked
into the study alongside the web WOFF2 files. `design/prepare-print-fonts.py`
documents how they were prepared; it is not needed for a normal rebuild. To
regenerate the font derivatives, install the pinned packages in
`design/requirements-fonts.txt` into a separate Python environment and run
`python design/prepare-print-fonts.py` from the study directory.

For the 11 × 17 booklet, print the imposed PDF in landscape at **100%**,
double-sided, **flip on short edge**, one PDF page per paper side. Disable the
printer's separate booklet mode. It uses nine sheets and one blank inside the
back cover to make 36 folded pages. Print the first two PDF sides as a duplex
test before the full run.

## Checks

From this study directory, after `node build.mjs`:

```sh
node test.mjs
NODE_PATH=./print/node_modules node integrated-browser-test.cjs
NODE_PATH=./print/node_modules node blood-of-moloch-browser-test.cjs
NODE_PATH=./print/node_modules node web-browser-test.cjs
```

Browser suites require Playwright and Chromium from the pinned print toolchain
above. On Windows, set `NODE_PATH` to the absolute `print/node_modules` path
before running these commands.
The generated site uses only local runtime assets. The repository's Docker
build adds analytics and outbound-link tracking under its existing CSP.

Art provenance and content context are in [HANDOFF.md](HANDOFF.md),
`art/`, and `design/`. [ARCHITECTURE.md](ARCHITECTURE.md) explains the shared
content renderers and print pipeline.
