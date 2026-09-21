# Elastic gallery regression checks

Serve `public` with a static server and open `/module-gallery-study/`.

- On desktop, move diagonally and vertically across tiles. Tracks stretch smoothly;
  modules keep their row/column order and a stationary pointer does not cause
  repeated hover changes.
- Open Soft Atlas, then Tidal Memory directly below it. Only Tidal Memory remains
  expanded, its trigger stays visible, and details appear below its row.
- Switch between different rows and close with Escape. The clicked tile stays at
  its viewport position when the detail panel moves; closing restores focus.
- With a detail open, change the column slider (3–8 desktop). The detail follows
  the selected module's new row, without duplicating or losing content.
- Repeat selection in Spatial mode and verify arrow-key navigation after closing.
- Resize to 390px. The desktop panel closes, the mobile column range returns,
  and selecting a tile opens the full-screen detail view. Tab remains within it;
  Escape restores the trigger and clears background inert state.
- Enable reduced motion: track changes should be immediate, with no FLIP motion.

Syntax check: `node --check public/module-gallery-study/app.js`.
