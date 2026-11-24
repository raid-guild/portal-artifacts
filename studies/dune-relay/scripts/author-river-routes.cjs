// Offline authoring search. Recorded witnesses are checked by test:core; this
// script is intentionally not part of the release test gate.
const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module');
Module._extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const {createPuzzle,playTurn,isSpecial}=require('../src/game/core.ts');
const {LEVEL_ORDER,LEVELS}=require('../src/game/levels.ts');
const {castleLevelForCompanion,companionSnapshot}=require('../src/game/companionAbilities.ts');
const outputFile=require('node:path').resolve(__dirname,'fixtures/river-winning-routes.json');
const existing=fs.existsSync(outputFile)?JSON.parse(fs.readFileSync(outputFile,'utf8')):[];
const result=[];const filter=process.argv[2];const compFilter=process.argv[3];
const names=['keeper','wayfinder','gatewright','fieldkeeper','towncrier'];
const rand=seed=>()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
function cargoLocations(puzzle){const found=new Map();for(let r=0;r<9;r++)for(let c=0;c<9;c++)if(puzzle.board[r][c]?.kind==='crate')found.set(puzzle.board[r][c].id,{row:r,col:c});return found;}
function candidates(puzzle,random,attempt){
 const list=[],crates=cargoLocations(puzzle);
 for(let r=0;r<9;r++)for(let c=0;c<9;c++){
  const from={row:r,col:c};for(const to of [{row:r,col:c+1},{row:r+1,col:c},...(isSpecial(puzzle.board[r][c])?[from]:[])]){
   if(to.row>=9||to.col>=9)continue;
   const turn=playTurn(puzzle,from,to);if(!turn.valid)continue;
   let score=0;
   for(const kind of Object.keys(puzzle.goals)){
    const diff=puzzle.goals[kind]-(turn.state.goals[kind]??0);
    score+=diff*(kind==='crate'?55:kind==='crust'?11:kind==='leaf'?1.4:1.2);
   }
   const nextCargo=cargoLocations(turn.state);
   for(const [id,before] of crates){const after=nextCargo.get(id);if(after){score+=(after.row-before.row)*.14;score+=after.row*.035;}else score+=8;}
   score+=turn.powersCreated.length*2.2+turn.keeperJets.length*2.2;
   score+=turn.stats.saltHits*.8;
   if(turn.state.status==='won')score+=10000;
   list.push({from,to,state:turn.state,score:score+(random()-.5)*Math.min(1.2,attempt*.015)});
  }
 }
 return list.sort((a,b)=>b.score-a.score);
}
const maxAttempts=Number(process.env.RIVER_MAX_ATTEMPTS||120);
for(const id of LEVEL_ORDER.slice(60)){
 if(filter&&id!==filter)continue;
 for(const name of names){
  if(compFilter&&name!==compFilter)continue;
  const old=existing.find(w=>w.levelId===id&&w.companionId===name);
  if(old){
   let check=createPuzzle(castleLevelForCompanion(LEVELS[id],companionSnapshot(name))),valid=true;
   for(const move of old.moves){const turn=playTurn(check,move.from,move.to);if(!turn.valid){valid=false;break;}check=turn.state;}
   if(valid&&check.status==='won'&&check.moves===old.movesRemaining){result.push(old);continue;}
  }
  let found=null;const authored=castleLevelForCompanion(LEVELS[id],companionSnapshot(name));
  for(let attempt=0;attempt<maxAttempts;attempt++){
   const random=rand((authored.seed^(attempt*2654435761)^(name.length*2654435761))>>>0);
   let puzzle=createPuzzle(authored);const moves=[];
   while(puzzle.status==='playing'){
    const list=candidates(puzzle,random,attempt);if(!list.length)break;
    const top=attempt===0?1:Math.min(list.length,attempt<20?3:attempt<65?6:10);
    const roll=random(), choice=list[Math.min(top-1,Math.floor(Math.pow(roll,attempt<20?2.2:1.6)*top))];
    moves.push({from:choice.from,to:choice.to});puzzle=choice.state;
   }
   if(puzzle.status==='won'){found={levelId:id,companionId:name,moves,movesRemaining:puzzle.moves};process.stdout.write(`${id}/${name}: ${puzzle.moves} left, attempt ${attempt}\n`);break;}
   if(attempt%20===0)process.stdout.write(`${id}/${name}: attempt ${attempt}, remaining ${JSON.stringify(puzzle.goals)}\n`);
  }
  if(!found){process.stderr.write(`NO WIN ${id}/${name}\n`);process.exitCode=1;break;}
  result.push(found);
  const merged=[...existing.filter(w=>!(filter? w.levelId===id && w.companionId===name : true)),...result];
  if(!filter)fs.writeFileSync(outputFile,JSON.stringify(merged)+'\n');
 }
 if(process.exitCode)break;
}
if(filter&&result.length){const merged=existing.filter(w=>w.levelId!==filter || compFilter&&w.companionId!==compFilter);fs.writeFileSync(outputFile,JSON.stringify([...merged,...result])+'\n');}
