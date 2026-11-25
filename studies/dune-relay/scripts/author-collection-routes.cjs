// Offline authoring search. Verified witnesses are checked by check-collection;
// this search is intentionally outside the release test gate.
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
Module._extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const {createPuzzle,playTurn,isSpecial}=require('../src/game/core.ts');
const {LEVEL_ORDER,LEVELS}=require('../src/game/levels.ts');
const {castleLevelForCompanion,companionSnapshot}=require('../src/game/companionAbilities.ts');
const outputFile=path.resolve(__dirname,'fixtures/collection-winning-routes.json');
let existing=fs.existsSync(outputFile)?JSON.parse(fs.readFileSync(outputFile,'utf8')):[];
const filter=process.argv[2],compFilter=process.argv[3];
const names=['keeper','wayfinder','gatewright','fieldkeeper','towncrier','artificer'];
const rand=seed=>()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
function cargoLocations(puzzle){const found=new Map();for(let r=0;r<9;r++)for(let c=0;c<9;c++)if(puzzle.board[r][c]?.kind==='crate')found.set(puzzle.board[r][c].id,{row:r,col:c});return found;}
function candidates(puzzle,random,attempt){
  const list=[],crates=cargoLocations(puzzle);
  for(let r=0;r<9;r++)for(let c=0;c<9;c++){
    const from={row:r,col:c};
    for(const to of [{row:r,col:c+1},{row:r+1,col:c},...(isSpecial(puzzle.board[r][c])?[from]:[])]){
      if(to.row>=9||to.col>=9)continue;
      const turn=playTurn(puzzle,from,to);if(!turn.valid)continue;
      let score=0;
      for(const kind of Object.keys(puzzle.goals)){
        const diff=puzzle.goals[kind]-(turn.state.goals[kind]??0);
        score+=diff*({condensation:9,crate:48,crust:12,water:1.3,leaf:1.3}[kind]??1.3);
      }
      const nextCargo=cargoLocations(turn.state);
      for(const [id,before] of crates){const after=nextCargo.get(id);if(after){score+=(after.row-before.row)*.23+after.row*.025;}else score+=8;}
      score+=turn.powersCreated.length*2.5+turn.keeperJets.length*2.5;
      score+=turn.stats.saltHits*.7;
      if(turn.state.status==='won')score+=10000;
      list.push({from,to,state:turn.state,score:score+(random()-.5)*Math.min(2,attempt*.025)});
    }
  }
  return list.sort((a,b)=>b.score-a.score);
}
const maxAttempts=Number(process.env.COLLECTION_MAX_ATTEMPTS||160);
for(const id of LEVEL_ORDER.slice(70)){
  if(filter&&id!==filter)continue;
  for(const name of names){
    if(compFilter&&name!==compFilter)continue;
    const authored=castleLevelForCompanion(LEVELS[id],companionSnapshot(name));
    const old=existing.find(w=>w.levelId===id&&w.companionId===name);
    if(old){let puzzle=createPuzzle(authored),valid=true;const moves=[];for(const move of old.moves){const turn=playTurn(puzzle,move.from,move.to);if(!turn.valid){valid=false;break;}moves.push(move);puzzle=turn.state;if(puzzle.status==='won')break;}if(valid&&puzzle.status==='won'){if(moves.length!==old.moves.length||puzzle.moves!==old.movesRemaining){existing=existing.filter(w=>!(w.levelId===id&&w.companionId===name));existing.push({levelId:id,companionId:name,moves,movesRemaining:puzzle.moves});fs.writeFileSync(outputFile,JSON.stringify(existing)+'\n');}process.stdout.write(`${id}/${name}: cached ${puzzle.moves} left\n`);continue;}}
    let found=null;
    for(let attempt=0;attempt<maxAttempts;attempt++){
      const random=rand((authored.seed^(attempt*2654435761)^(name.length*2654435761))>>>0);
      let puzzle=createPuzzle(authored);const moves=[];
      while(puzzle.status==='playing'){
        const list=candidates(puzzle,random,attempt);if(!list.length)break;
        const top=attempt===0?1:Math.min(list.length,attempt<20?3:attempt<65?6:12);
        const roll=random(),choice=list[Math.min(top-1,Math.floor(Math.pow(roll,attempt<20?2.2:1.5)*top))];
        moves.push({from:choice.from,to:choice.to});puzzle=choice.state;
      }
      if(puzzle.status==='won'){found={levelId:id,companionId:name,moves,movesRemaining:puzzle.moves};process.stdout.write(`${id}/${name}: ${puzzle.moves} left, attempt ${attempt}\n`);break;}
      if(attempt%20===0)process.stdout.write(`${id}/${name}: attempt ${attempt}, remaining ${JSON.stringify(puzzle.goals)}\n`);
    }
    if(!found){process.stderr.write(`NO WIN ${id}/${name}\n`);process.exitCode=1;break;}
    existing=existing.filter(w=>!(w.levelId===id&&w.companionId===name));existing.push(found);
    fs.writeFileSync(outputFile,JSON.stringify(existing)+'\n');
  }
  if(process.exitCode)break;
}
