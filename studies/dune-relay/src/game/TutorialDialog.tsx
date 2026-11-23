"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { assetUrl } from "./assetUrl";
import { COMPANIONS } from "./chapters";
import type { Tutorial, TutorialId } from "./tutorials";

type Cell = "W" | "L" | "G" | "H" | "V" | "F" | "R" | "S" | "S2" | "P" | "PC" | "C" | ".";
const art: Record<Exclude<Cell,".">,string> = {
  W:"tutorial-water.png", L:"tutorial-leaf.png", G:"tutorial-gear.png", H:"tutorial-jet-row.png", V:"tutorial-jet-column.png", F:"flywheel.png", R:"prism.png", S:"salt-crust.png", S2:"salt-crust-2.png", P:"seedpod.png", PC:"seedpod-cracked.png", C:"delivery-crate.png",
};
const base: Cell[][] = [
  ["G","L","W","G","L"], ["L","G","L","W","G"],
  ["W","L","G","L","W"], ["G","W","L","G","L"], ["L","G","W","L","G"],
];
const loopPath=[6,7,8,13,18,17,16,11];
const wrapPath=[10,11,12,13,14];
const frozenPath=[5,6,11,10];
const flowingPath=[8,9,14,13];
function boardFor(id: TutorialId, step: number): { board: Cell[][]; hot: number[]; beam: "row"|"cross"|"square"|"rainbow"|null; arrow?: [number,number]; fall?: [number,number] } {
  const b=base.map(row=>[...row]); let hot:number[]=[]; let beam: "row"|"cross"|"square"|"rainbow"|null=null; let arrow: [number,number]|undefined; let fall: [number,number]|undefined;
  const put=(r:number,c:number,v:Cell)=>{b[r][c]=v;};
  if (id==="jet") {
    ["W","W","G","W","L"].forEach((v,c)=>put(2,c,v as Cell)); put(3,2,"W"); hot=[12,17]; arrow=[17,12];
    if(step>=1){[".",".","H",".","L"].forEach((v,c)=>put(2,c,v as Cell));put(3,2,"G");hot=[12];arrow=undefined;}
    if(step===2){hot=[12];beam="row";arrow=undefined;}
    if(step>=3){for(let c=0;c<5;c++)put(2,c,".");hot=[];beam=null;}
  } else if(id==="flywheel") {
    put(0,2,"W");put(1,2,"W");put(2,2,"G");put(2,3,"W");put(2,4,"W");put(3,2,"W");hot=[12,17];arrow=[17,12];
    if(step>=1){put(2,2,"F");put(3,2,"G");put(0,2,".");put(1,2,".");put(2,3,".");put(2,4,".");hot=[12];arrow=undefined;}
    if(step===2){hot=[12];beam="square";arrow=undefined;}
    if(step>=3){for(let r=1;r<=3;r++)for(let c=1;c<=3;c++)put(r,c,".");hot=[];beam=null;}
  } else if(id==="prism") {
    ["L","L","G","L","L"].forEach((v,c)=>put(2,c,v as Cell));put(3,2,"L");hot=[12,17];arrow=[17,12];
    if(step>=1){for(let c=0;c<5;c++)put(2,c,c===2?"R":".");put(3,2,"G");hot=[12];arrow=undefined;}
    if(step>=2){put(1,2,"R");put(2,2,"W");hot=[7,12];arrow=[12,7];beam="rainbow";}
    if(step>=3){for(let r=0;r<5;r++)for(let c=0;c<5;c++)if(b[r][c]==="W")put(r,c,".");put(1,2,".");hot=[];beam=null;arrow=undefined;}
  } else if(id==="combo") {
    put(2,1,"H");put(2,2,"H");hot=[11,12];if(step===1)arrow=[11,12];
    if(step===2){beam="cross";hot=[12];}
    if(step>=3){for(let i=0;i<5;i++){put(2,i,".");put(i,2,".");}hot=[];}
  } else if(id==="salt" || id==="layeredSalt") {
    put(2,2,id==="salt"?"S":"S2");put(1,1,"W");put(1,2,"G");put(1,3,"W");put(0,2,"W");hot=[2,7,6,8,12];arrow=[2,7];
    if(step>=1){put(1,2,"W");put(0,2,"G");hot=[6,7,8,12];arrow=[2,7];}
    if(step>=2){put(1,1,".");put(1,2,".");put(1,3,".");put(2,2,id==="salt"?".":"S");hot=[12];}
    if(id==="layeredSalt"&&step>=2){put(3,1,"W");put(3,2,step===2?"G":"W");put(3,3,"W");put(4,2,step===2?"W":"G");if(step===3){hot=[12,16,17,18,22];arrow=[22,17];}}else if(step>=3&&id==="salt"){hot=[];}
    if(step>=4&&id==="layeredSalt"){put(2,2,".");put(3,1,".");put(3,2,".");put(3,3,".");hot=[];}
  } else if(id==="crate") {
    put(1,2,"C"); put(2,1,"W"); put(2,2,"G"); put(2,3,"W"); put(3,2,"W"); hot=[7,11,12,13,17];
    if(step>=1){put(2,2,"W");put(3,2,"G");hot=[7,11,12,13];}
    if(step>=2){put(1,2,".");put(2,2,".");put(3,2,"C");hot=[17];if(step===2)fall=[7,17];}
    if(step>=3){put(3,2,".");put(4,2,".");hot=[22];}
  } else if(id==="current") {
    const before: Cell[][] = [
      ["G","L","G","W","G"], ["L","W","W","L","W"],
      ["G","W","G","G","W"], ["W","L","G","L","G"], ["L","G","W","G","L"],
    ];
    for(let r=0;r<5;r++) for(let c=0;c<5;c++) put(r,c,before[r][c]);
    if(step===0){hot=[3,4,9,14];arrow=[3,4];}
    if(step>=1){put(0,3,"G");put(0,4,"L");put(1,4,"G");put(2,4,"L");hot=[...loopPath];arrow=undefined;}
    if(step>=2){put(1,1,"W");put(1,2,"W");put(1,3,"W");put(2,1,"L");put(2,3,"L");put(3,1,"G");put(3,2,"L");put(3,3,"G");}
    if(step>=3){put(1,1,".");put(1,2,".");put(1,3,".");hot=[6,7,8];}
  } else if(id==="wrapCurrent") {
    ["W","L","G","W","G"].forEach((v,c)=>put(2,c,v as Cell));
    if(step>=1){put(0,1,".");put(0,2,".");put(0,3,".");}
    if(step>=2){["G","W","L","G","W"].forEach((v,c)=>put(2,c,v as Cell));}
    hot=[...wrapPath];
  } else if(id==="frozenCurrent") {
    put(1,0,"L");put(1,1,step<2?"S":"W");put(2,1,"G");put(2,0,"W");
    put(1,3,"W");put(1,4,"L");put(2,4,"W");put(2,3,"G");
    if(step>=1){put(1,3,"G");put(1,4,"W");put(2,4,"L");put(2,3,"W");}
    if(step>=2){put(0,1,".");put(0,2,".");put(0,3,".");}
    if(step>=3){put(1,0,"W");put(1,1,"L");put(2,1,"W");put(2,0,"G");put(1,3,"W");put(1,4,"G");put(2,4,"W");put(2,3,"L");}
    hot=[...frozenPath,...flowingPath];
  } else if(id==="seedpod") {
    put(2,2,"P");put(3,1,"L");put(3,2,"W");put(3,3,"W");put(4,1,"W");put(4,2,"G");hot=[12,16,17,18,21];arrow=[21,16];
    if(step>=1){put(3,1,"W");put(4,1,"L");put(2,2,"PC");hot=[12,16,17,18];arrow=[21,16];}
    if(step>=2){put(2,2,".");put(3,1,"W");put(3,2,"PC");put(3,3,".");put(4,1,"G");put(4,2,"W");put(4,3,"W");hot=[17];arrow=undefined;if(step===2)fall=[12,17];}
    if(step>=3){put(3,1,"G");put(4,1,"W");put(4,2,"W");put(4,3,"W");hot=[17,21,22,23];if(step===3)arrow=[16,21];}
    if(step>=4){put(3,2,".");put(4,1,".");put(4,2,".");put(4,3,".");hot=[];}
  }
  return {board:b,hot,beam,arrow,fall};
}
export function TutorialDialog({tutorial,mode,reducedMotion,onSkip,onContinue,onBack}: {tutorial:Tutorial;mode:"intro"|"replay";reducedMotion:boolean;onSkip:()=>void;onContinue:()=>void;onBack:()=>void}) {
  const [step,setStep]=useState(0),[finished,setFinished]=useState(false);
  const [run,setRun]=useState(0),[hidden,setHidden]=useState(false);
  const firstButton=useRef<HTMLButtonElement>(null);
  const opener=useRef<HTMLElement|null>(null);
  useEffect(()=>{
    opener.current=document.activeElement instanceof HTMLElement ? document.activeElement : null;
    firstButton.current?.focus();
    return ()=>{
      const previous=opener.current;
      requestAnimationFrame(()=>{
        if (previous?.isConnected && !previous.closest("[inert]") && previous.getClientRects().length) previous.focus();
      });
    };
  },[tutorial.id,mode]);
  useEffect(()=>{setStep(0);setFinished(false);},[tutorial.id,run]);
  useEffect(()=>{
    const visibility=()=>setHidden(document.hidden);visibility();
    document.addEventListener("visibilitychange",visibility);
    return ()=>document.removeEventListener("visibilitychange",visibility);
  },[]);
  useEffect(()=>{
    if(hidden || finished) return;
    const timer=window.setTimeout(()=>{if(step<tutorial.stages.length-1)setStep(step+1);else setFinished(true);},step===tutorial.stages.length-1?900:reducedMotion?1450:tutorial.stages.length===5?1450:1850);
    return ()=>clearTimeout(timer);
  },[hidden,finished,step,run,reducedMotion,tutorial.stages.length]);
  const scene=boardFor(tutorial.id,step);
  const routePaths=tutorial.id==="current"?[{cells:loopPath,id:1,frozen:false}]:tutorial.id==="wrapCurrent"?[{cells:wrapPath,id:1,frozen:false}]:tutorial.id==="frozenCurrent"?[{cells:frozenPath,id:1,frozen:step<2},{cells:flowingPath,id:2,frozen:false}]:[];
  const movingPaths=tutorial.id==="current"&&step===2?[loopPath]:tutorial.id==="wrapCurrent"&&step===2?[wrapPath]:tutorial.id==="frozenCurrent"&&step===1?[flowingPath]:tutorial.id==="frozenCurrent"&&step===3?[frozenPath,flowingPath]:[];
  const riverMoving=movingPaths.length>0&&!reducedMotion;
  const riverBefore=tutorial.id==="current"?boardFor("current",1).board:tutorial.id==="wrapCurrent"?boardFor("wrapCurrent",1).board:tutorial.id==="frozenCurrent"?boardFor("frozenCurrent",step===1?0:2).board:base;
  const tutorialSpeaker = tutorial.speaker === "skiff" ? {name:"Skiff",portrait:assetUrl("/sprites/skiff-avatar.png")} : COMPANIONS[tutorial.speaker];
  const moving=scene.fall ?? scene.arrow;
  const motionArt=scene.fall ? tutorial.id==="crate" ? "delivery-crate.png" : "seedpod-cracked.png" : tutorial.id==="prism"&&step===2 ? "prism.png" : tutorial.id==="salt"||tutorial.id==="layeredSalt"||tutorial.id==="seedpod"&&step!==2 ? "tutorial-water.png" : scene.arrow ? art[scene.board[Math.floor(scene.arrow[0]/5)][scene.arrow[0]%5] as Exclude<Cell,".">] : null;
  const direction=scene.arrow ? scene.arrow[1]-scene.arrow[0]===1 ? "→" : scene.arrow[1]-scene.arrow[0]===-1 ? "←" : scene.arrow[1]>scene.arrow[0] ? "↓" : "↑" : "";
  const motionStyle=moving ? {"--from-c":moving[0]%5,"--from-r":Math.floor(moving[0]/5),"--to-c":moving[1]%5,"--to-r":Math.floor(moving[1]/5)} as CSSProperties : undefined;
  return <div className="scrim tutorial-scrim" onKeyDown={event=>{if(event.key!=="Tab")return; const controls=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));if(!controls.length)return;const first=controls[0],last=controls[controls.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}>
    <section className="tutorial-card" role="dialog" aria-modal="true" aria-label={`${tutorial.title} lesson`} data-tutorial={tutorial.id} data-stage={step} data-finished={finished} data-hidden={hidden}>
      <header className="tutorial-header"><div className="tutorial-speaker"><img src={tutorialSpeaker.portrait} alt=""/><div><span className="speaker">{tutorialSpeaker.name.toUpperCase()} SHOWS YOU</span><h2>{tutorial.title}</h2></div></div><span className="tutorial-demo-label">DEMO · NO MOVES USED</span></header>
      <div className="tutorial-content"><div className={`tutorial-board tutorial-beam-${scene.beam ?? "none"}`} aria-label="Scripted example board" data-motion={Boolean(moving)} data-reduced={reducedMotion} data-stage={step}>
        {scene.board.flat().map((cell,index)=><div className={`tutorial-cell ${scene.hot.includes(index)?"is-hot":""} ${routePaths.some(path=>path.cells.includes(index))?"is-current":""} ${riverMoving&&movingPaths.some(path=>path.includes(index))?"is-moving-route":""} ${cell==="."?"is-empty":""}`} key={index}>
          {cell!=="."&&<img src={assetUrl(`/sprites/${art[cell]}`)} alt="" draggable={false}/>}
          {scene.arrow?.[1]===index&&<span className="tutorial-swap-arrow" aria-hidden="true">{direction}</span>}
        </div>)}
        {routePaths.flatMap(path=>path.cells.map((index,order)=><span key={`river-${path.id}-${index}`} className="tutorial-current-cell" data-route={path.id} data-frozen={path.frozen} data-flow={!path.frozen&&(step>=2||tutorial.id==="frozenCurrent")} style={{"--river-col":index%5,"--river-row":Math.floor(index/5),"--river-order":order} as CSSProperties} aria-hidden="true"/>))}
        {tutorial.id==="wrapCurrent"&&<><span className="tutorial-current-port is-in" aria-hidden="true"/><span className="tutorial-current-port is-out" aria-hidden="true"/></>}
        {riverMoving&&movingPaths.flatMap(path=>path.map((index,order)=>{
          const tile=riverBefore[Math.floor(index/5)][index%5],destination=path[(order+1)%path.length];
          return <img key={`${tutorial.id}-${step}-${run}-${index}`} className={`tutorial-current-copy ${tutorial.id==="wrapCurrent"&&order===path.length-1?"is-wrap":""}`} src={assetUrl(`/sprites/${art[tile as Exclude<Cell,".">]}`)} style={{"--from-c":index%5,"--from-r":Math.floor(index/5),"--delta-c":destination%5-index%5,"--delta-r":Math.floor(destination/5)-Math.floor(index/5)} as CSSProperties} alt="" aria-hidden="true"/>;
        }))}
        {scene.beam&&<div className="tutorial-beam" aria-hidden="true"/>}
        {step===2&&["jet","flywheel","combo"].includes(tutorial.id)&&<div className="tutorial-activation" aria-hidden="true"/>}
        {moving&&motionArt&&<img key={`${tutorial.id}-${step}-${run}`} className={`tutorial-motion ${scene.fall?"is-fall":""}`} style={motionStyle} src={assetUrl(`/sprites/${motionArt}`)} alt="" aria-hidden="true"/>}
      </div><div className="tutorial-copy"><span className="tutorial-step">{step+1} / {tutorial.stages.length}</span><p role="status">{tutorial.stages[step]}</p><small>{tutorial.summary}</small></div></div>
      <footer className="tutorial-actions"><button ref={firstButton} className="quiet" onClick={mode==="intro"?onSkip:onBack}>{mode==="intro"?"Skip lesson":"Back to lessons"}</button><button className="quiet" onClick={()=>{setRun(v=>v+1);}}>Watch again</button>{finished&&<button className="primary" onClick={mode==="intro"?onContinue:onBack}>{mode==="intro"?"Let's go":"Back to lessons"} <span>→</span></button>}</footer>
    </section>
  </div>;
}
