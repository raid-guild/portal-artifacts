# Level Workshop

Open [the workshop](http://127.0.0.1:5180/editor.html) while the existing local server runs.

Choose a pressure, low-passage, tendril-channel, or grip/slip preset and click **Load preset**. Each preset uses the game's actual level definition and three-terrace geometry. The workshop is a separate page; it does not replace campaign levels or edit their source files.

Select a placement tool and click the plan to add gems, gold, or flesh pools. Choose **Select** to drag an existing object, including the start, exit, casting bank, basin, gate, low passage, grip assembly, and slippery strip. Edit its precise position and available dimensions in the inspector. A quarter-unit grid is enabled by default. Delete removes selected collectibles, pools, or channels. Undo and redo cover placement, removal, settings, imports, and preset changes.

Terrace settings regenerate all four stair steps so their heights match the edited terrain. The grip ramp and wall move as one assembly. Puzzle-specific fixtures remain with their preset in this first version; arbitrary terrain sculpting, ceiling surfaces, and combinations of all puzzle types are not supported yet.

**Play test** starts an isolated instance of the existing particle simulation with your custom definition. WASD/arrows or the touch buttons move, holding Space contracts, tapping Space recalls tendrils, E casts in Reach, F sheds in pressure layouts, and Shift pushes harder. Click the 3D floor to aim/cast in Reach. Escape or **Back to edit** restores editing without losing changes. **Restart test** resets the test. Gem enclosure, pickups, surface grip/slip, pressure gates, and drain completion use the same game physics.

Valid edits automatically save in this browser. **Save locally** confirms storage; **Export JSON** downloads a portable .puddle.json definition. **Import JSON** validates and loads a version 1 workshop file. Invalid edits remain undoable but do not overwrite the last valid local save. A local save holds one garden; export files to keep multiple versions.

Checks catch malformed files, over-budget flesh, unsafe starts, overlapping funnels, fixtures crossing terrace boundaries, and objects embedded in solids. They cannot prove a puzzle is solvable; play-test every route. The particle budget is capped at 297. To add a pool, reduce an existing pool's particle count first.

The production build includes both the game and editor.html. Run node --test tests/editor-model.test.js for workshop model/import/history/isolation checks and npm run build to bundle both pages.
