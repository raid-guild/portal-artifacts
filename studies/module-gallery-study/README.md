# Module Gallery Study

An accessible 30-module elastic editorial mosaic with responsive 1–8 column
controls, independent row hover stretching, and a directionally navigable spatial
arrangement. Selecting a card expands it into a feature above a horizontally
scrollable strip of the other modules. Select a thumbnail to switch; use Back
or Escape to restore the collection and keyboard focus. Mobile uses the same
inline expansion without locking page scrolling. Reduced-motion preferences
disable the layout animation.

## Build

From the repository root:

```sh
node studies/module-gallery-study/build.mjs
```

The build copies the editable source and checked-in Three.js dependency to
`public/module-gallery-study/`.

Hover widens just the targeted card and shrinks its row neighbors; other rows
keep their widths. A dark outline identifies the hovered card. The mini-card
strip also widens its hovered preview, including keyboard focus.
