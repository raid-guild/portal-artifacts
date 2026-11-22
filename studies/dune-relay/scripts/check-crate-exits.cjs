const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { BOARD_SIZE, boardMask } = require('../src/game/core.ts');
const { crateExitCells } = require('../src/game/crateExits.ts');
const row=(r,cols)=>cols.map(col=>({row:r,col}));
assert.deepEqual(crateExitCells(boardMask()),row(8,[0,1,2,3,4,5,6,7,8]));
assert.deepEqual(crateExitCells(boardMask('clippedCorners')),[...row(7,[0,8]),...row(8,[1,2,3,4,5,6,7])]);
assert.deepEqual(crateExitCells(boardMask('steppedBasin')),row(8,[0,1,2,3,4,5,6,7,8]));
assert.deepEqual(crateExitCells(boardMask('twinChambers')),[...row(5,[3,4,5]),...row(8,[0,1,2,6,7,8])]);
const mask=Array.from({length:BOARD_SIZE},()=>Array(BOARD_SIZE).fill(false));
mask[0][1]=mask[1][1]=true;
mask[3][1]=mask[4][1]=true;
mask[8][4]=mask[8][5]=true;
assert.deepEqual(crateExitCells(mask),[{row:1,col:1},{row:4,col:1},{row:8,col:4},{row:8,col:5}], 'ledge before internal gap and board bottom are exits');
mask[2][1]=true;
assert.deepEqual(crateExitCells(mask),[{row:4,col:1},{row:8,col:4},{row:8,col:5}], 'a playable cell below closes the upper exit');
console.log('Crate exits follow all authored masks, including clipped edges and internal gaps.');
