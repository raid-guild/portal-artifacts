import test from 'node:test';
import assert from 'node:assert/strict';
import {generate,createRunner,advance,exits,connect,decorate,localState,candidates,shortestPath,corridorOutcome,buildQuestions} from '../public/engine.js';
function solve(m,choose=options=>options[0]?.direction){const r=createRunner(m,'Test');let ticks=0;while(!['found','exhausted'].includes(r.status)){advance(m,r,choose(candidates(m,r)));assert.ok(++ticks<=m.cells.length*2+1,'exploration must terminate');}return r;}
test('seed reproduces topology, rule, and clues',()=>{assert.deepEqual(generate(11,'repeat'),generate(11,'repeat'));assert.notDeepEqual(generate(11,'repeat').cells,generate(11,'different').cells);});
test('DFS and arbitrary local exit order solve cyclic and tree mazes without crossing walls',()=>{
  for(const loops of [0,.04,.3])for(let seed=0;seed<35;seed++){
    const m=generate(11,seed,loops);assert.ok(shortestPath(m)>0);
    for(const choose of [o=>o[0]?.direction,o=>o.at(-1)?.direction]){
      const r=solve(m,choose);assert.equal(r.status,'found');assert.ok(r.steps>=shortestPath(m));
      assert.ok(Object.values(r.marks).every(n=>n<=2));
      for(let i=1;i<r.trail.length;i++)assert.ok(exits(m,r.trail[i-1]).some(e=>e.to===r.trail[i]));
    }
  }
});
test('disconnected goal exhausts reachable territory and terminates',()=>{const m=generate(7,'disconnected');for(const e of exits(m,m.goal))connect(m,m.goal,e.d,false);assert.equal(shortestPath(m),null);assert.equal(solve(m).status,'exhausted');});
test('edits maintain symmetric passages and never open outer walls',()=>{const m=generate(7,'edits');connect(m,0,0);assert.equal(m.cells[0]&1,0);connect(m,0,1,false);assert.equal(m.cells[0]&2,0);assert.equal(m.cells[1]&8,0);connect(m,0,1,true);assert.equal(m.cells[1]&8,8);});
test('perfect clues agree with corridor outcomes; rule stays fixed across mazes',()=>{for(let i=0;i<10;i++){const m=generate(11,i,.1,'fixed-rule',1);assert.equal(m.rule.bad,generate(7,'x',0,'fixed-rule',1).rule.bad);for(let id=0;id<m.cells.length;id++)for(const e of exits(m,id))assert.equal(e.symbol===m.rule.bad,corridorOutcome(m,id,e.to)==='dead_end');}});
test('request exposes observations and legal choices, never hidden map, goal, or rule',()=>{const m=generate(7,'local'),r=createRunner(m,'Jev');const state=localState(m,r);assert.deepEqual(Object.keys(state),['objective','current_intersection','exits','local_passages','experience','outcome_definitions']);assert.ok(Object.values(state.experience).every(v=>Object.values(v).every(n=>n===0)));assert.deepEqual(Object.keys(buildQuestions(state).move.criteria),candidates(m,r).map(e=>e.direction));state.experience.zigzag.dead_end=99;assert.equal(r.experience.zigzag.dead_end,0);});
test('experience is recorded only after traversing a corridor',()=>{
  const m={n:3,seed:'corridor',cells:Array(9).fill(0),start:0,goal:8,clues:{}};
  connect(m,0,1);connect(m,1,1);decorate(m,'rule',1);
  const r=createRunner(m,'Jev'),s=m.clues['0:1'];
  advance(m,r);assert.equal(r.experience[s].dead_end,0);
  advance(m,r);assert.equal(r.experience[s].dead_end,1);
  advance(m,r);advance(m,r);advance(m,r);assert.equal(r.experience[s].dead_end,1);assert.equal(r.status,'exhausted');
});
test('start at goal needs no moves; illegal choice does not mutate runner',()=>{const m=generate(7,'goal');m.goal=m.start;assert.equal(createRunner(m,'Test').status,'found');m.goal=48;const r=createRunner(m,'Test');assert.throws(()=>advance(m,r,'diagonal'));assert.equal(r.steps,0);});

import {configureMaze,distancesToGoal,TASKS,baselineChoice,keywordChoice} from '../public/engine.js';
const semanticSettings={n:11,seed:'semantic-test',loops:.04,reliability:1,mode:'semantic',task:'radio'};
test('semantic signs have exactly the configured relationship to progress, for every task',()=>{
  for(const task of Object.keys(TASKS)){
    const m=configureMaze({...semanticSettings,task}),dist=distancesToGoal(m);
    for(let id=0;id<m.cells.length;id++)for(const e of exits(m,id))assert.equal(TASKS[task].helpful.includes(e.description),dist.get(e.to)<dist.get(id));
  }
});
test('semantic observations and questions reveal descriptions, never generator labels or distances',()=>{
  const m=configureMaze(semanticSettings),r=createRunner(m,'Jev'),s=localState(m,r);
  assert.deepEqual(Object.keys(s),['mode','objective','current_intersection','exits','local_passages','observation']);
  assert.equal(s.objective,TASKS.radio.goal);assert.ok(s.exits.every(e=>typeof e.description==='string'&&!('symbol' in e)));
  const q=buildQuestions(s);assert.equal(Object.keys(q).length,s.exits.length+1);assert.ok(Object.values(q.move.criteria).every(v=>typeof v==='string'&&!v.includes('undefined')));
});
test('noise changes signs, not topology, and batches restart at the original seed',()=>{
  for(let round=1;round<=5;round++){
    const a=configureMaze({...semanticSettings,reliability:.8},round),b=configureMaze({...semanticSettings,reliability:.5},round);
    assert.deepEqual(a.cells,b.cells);assert.equal(a.seed,round===1?'semantic-test':`semantic-test:${round}`);assert.notDeepEqual(a.signs,b.signs);
  }
});
test('all baselines terminate and remain reproducible on semantic mazes',()=>{
  for(let seed=0;seed<10;seed++)for(const kind of ['dfs','random','keyword']){
    const m=configureMaze({...semanticSettings,seed:String(seed),reliability:.8});
    const run=()=>{const r=createRunner(m,kind);while(!['found','exhausted'].includes(r.status)){advance(m,r,baselineChoice(m,r,kind));assert.ok(r.steps<=m.cells.length*2);}return r;};
    const first=run();assert.equal(first.status,'found');assert.deepEqual(first.trail,run().trail);
  }
});
test('keyword baseline uses lexical overlap only, including documented distractor failure',()=>{
  assert.equal(keywordChoice({objective:'Find somewhere to repair a broken radio.',exits:[{direction:'north',description:'Soldering station for failed capacitors.'},{direction:'east',description:'Broken radio repair book archive.'}]}),'east');
});
