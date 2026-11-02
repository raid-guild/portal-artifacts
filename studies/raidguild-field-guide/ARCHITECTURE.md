# Field Guide architecture

`publication.json` contains the illustrated source pages and map geometry;
`content-studies.json` contains the additional workbook pages. The builder
combines them into a 35-page, 18-spread resolved publication. `content/field-guide.mjs`
adapts that shared content for `web-render.mjs`, which creates the modern
longform site. `publication-render.mjs` renders the alternate paginated reader.
The browser keeps both views in the generated HTML and uses ordinary fragment
routes. `web.js` drives the interactive longform sections; `publication.js`
drives page navigation. Both share the same illustration and content sources.

The longform website presents the class portraits as a selector and keeps map
notes beside the current illustration. Selecting or hovering over markers
changes the visible note; complete text is also available to keyboard and
screen-reader users. The illustrated print spread retains numbered callouts and
text cards. Web forms are deliberately absent until they can have real behavior;
the worksheet pages remain in print.

`build.mjs` emits the HTML, resolved JSON, local assets, fonts, and checked-in
Three.js modules to `public/raidguild-field-guide/`. It uses no remote runtime
scripts. The blood-of-Moloch can viewer loads the local model only when
activated; its poster is the baseline image. The published HTML includes static
social metadata and a subpath-correct canonical URL.

Print uses `layouts/make-review-pdf-v7.py` for the illustrated base,
`print/export-dense.cjs` for the print-CSS workbook overlay, and
`layouts/assemble-print-edition-v7.py` to merge them. `print/impose-ledger.py`
reorders the resulting 35-page PDF onto 18 ledger sides with one blank inside
the back cover. `print/build.py` runs these steps into a separate proof folder.
See [README.md](README.md) for installation, verification, and print settings.
