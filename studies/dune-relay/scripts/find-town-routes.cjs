// Offline authoring aid: reproducible, goal-aware randomized rollouts. The
// recorded routes are replayed by check-core; this search is not a test gate.
const fs=require('node:fs');const ts=require('typescript');const Module=require('node:module');
Module._extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);
const {createPuzzle,playTurn,isSpecial}=require('../src/game/core.ts');
const {LEVEL_ORDER,LEVELS}=require('../src/game/levels.ts');
const output={};
const routeFile=require('node:path').resolve(__dirname,'town-winning-routes.json');
if(fs.existsSync(routeFile))Object.assign(output,JSON.parse(fs.readFileSync(routeFile,'utf8')));
const rand=seed=>()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
function candidates(puzzle){
  const list=[];
  const beforeCargo=puzzle.board.flat().filter(tile=>tile?.kind==='crate').reduce((sum,tile)=>sum+tile.id,0);
  for(let row=0;row<9;row++)for(let col=0;col<9;col++){
    const from={row,col};
    for(const to of [{row,col:col+1},{row:row+1,col},...(isSpecial(puzzle.board[row][col])?[from]:[])]){
      if(to.row>=9||to.col>=9)continue;
      const turn=playTurn(puzzle,from,to);if(!turn.valid)continue;
      let score=0;
      for(const kind of Object.keys(puzzle.goals)){
        const diff=puzzle.goals[kind]-turn.state.goals[kind];
        score+=diff*(kind==='crate'?32:kind==='seedpod'?8:kind==='crust'?7:kind==='pennant'?2.5:1.5);
      }
      const cargo=turn.state.board.flat().filter(tile=>tile?.kind==='crate').reduce((sum,tile)=>sum+tile.id,0);
      if(cargo<beforeCargo)score+=2;
      score+=turn.powersCreated.length*2+turn.keeperJets.length*2+turn.stats.seedpodHits*1.5+turn.stats.saltHits;
      if(turn.state.status==='won')score+=10000;
      list.push({from,to,state:turn.state,score});
    }
  }
  return list.sort((a,b)=>b.score-a.score||a.from.row-b.from.row||a.from.col-b.from.col||a.to.row-b.to.row||a.to.col-b.to.col);
}
for(const id of LEVEL_ORDER.slice(40)){
  if(output[id])continue;
  let found=false;
  for(let attempt=0;attempt<400&&!found;attempt++){
    const rng=rand((LEVELS[id].seed^(attempt*2654435761))>>>0);
    let puzzle=createPuzzle(LEVELS[id]);const route=[];
    while(puzzle.status==='playing'){
      const list=candidates(puzzle);if(!list.length)break;
      const top=Math.min(list.length,attempt===0?1:attempt<40?4:8);
      const roll=rng();const index=attempt===0?0:Math.min(top-1,Math.floor(Math.pow(roll,attempt<40?2.5:1.7)*top));
      const move=list[index];route.push([move.from.row,move.from.col,move.to.row,move.to.col]);puzzle=move.state;
    }
    if(puzzle.status==='won'){
      output[id]=route;fs.writeFileSync(routeFile,JSON.stringify(output,null,2)+'\n');
      process.stdout.write(`${id}: won with ${puzzle.moves} left, attempt ${attempt}\n`);found=true;
    }
    if(attempt%20===0&&!found)process.stdout.write(`${id}: attempt ${attempt}\n`);
  }
  if(!found)throw Error(`${id} route not found`);
}
