// Ticket-economy sensitivity check. Pocket choices are sampled, not simulated with Rapier.
import {POCKETS} from '../src/challenge.js';
import {newRun,applyScore,addUpgrade,chipsForRun,ROUND_TARGETS} from '../src/state.js';

const samples=15000;
const scenarios=[
  ['base',0,0,0],['early',2,1,1],['middle',4,2,2],['max',8,3,6],
];
const profiles=[['outer x2',2],['equal pockets',1]];
const balls=['chrome','heavy'];
let seed=0x5eed1234;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
function pocket(outerWeight){
  const total=12*outerWeight+7;
  const roll=Math.floor(random()*total);
  return POCKETS[roll<12*outerWeight?Math.floor(roll/outerWeight):12+roll-12*outerWeight];
}
function play(levels,ball,outerWeight){
  let run=newRun({powerLevels:{amplifier:levels[0],reserve:levels[1],jackpot:levels[2]}});
  for(let resolved=0;resolved<180&&run.status!=='won';resolved++){
    if(run.status==='choose'){
      run=addUpgrade(run,['lucky','reserve','capacitor','rim'][run.round]);
      continue;
    }
    if(run.drops<=0)break;
    run={...run,drops:run.drops-1,dropped:run.dropped+1};
    run=applyScore(run,pocket(outerWeight),ball);
  }
  return {won:run.status==='won',round:Math.min(run.round+1,4),chips:chipsForRun(run)};
}
console.log(`Seeded economy sensitivity · ${samples.toLocaleString()} sampled runs per row · targets ${ROUND_TARGETS.join('/')}`);
console.log('Profile          Ball    Levels A/R/J  Win%   Avg chips  Avg reach');
for(const [profile,outerWeight] of profiles)for(const ball of balls)for(const [name,...levels] of scenarios){
  let wins=0,chips=0,reach=0;
  for(let i=0;i<samples;i++){const result=play(levels,ball,outerWeight);wins+=Number(result.won);chips+=result.chips;reach+=result.round;}
  console.log(`${profile.padEnd(16)} ${ball.padEnd(7)} ${`${name} ${levels.join('/')}`.padEnd(13)} ${(wins/samples*100).toFixed(1).padStart(5)} ${(chips/samples).toFixed(1).padStart(10)} ${(reach/samples).toFixed(2).padStart(10)}`);
}
