"use client";

import { assetUrl } from "./assetUrl";
import type { ToolKind } from "./inventory";

const water = assetUrl("/sprites/tutorial-water.png");
const leaf = assetUrl("/sprites/tutorial-leaf.png");
const gear = assetUrl("/sprites/tutorial-gear.png");

export function ToolLesson({ kind, replay, reducedMotion, onDone, onBack }: {
  kind: ToolKind; replay: boolean; reducedMotion: boolean;
  onDone: () => void; onBack: () => void;
}) {
  const bomb = kind === "tileBomb";
  const cells = [leaf, water, gear, water, leaf, gear, gear, water, leaf];
  return <div className="scrim tutorial-scrim"><div className="dialog-card tool-lesson" role="dialog" aria-modal="true" aria-label={`${bomb ? "Tile Bomb" : "Free Swap"} lesson`}>
    <span className="speaker">FIELD TOOLS · {bomb ? "TILE BOMB" : "FREE SWAP"}</span>
    <h2>{bomb ? "Pick one tile to bust" : "Move a tile into place"}</h2>
    <div className={`tool-lesson-demo ${bomb ? "bomb" : "swap"}${reducedMotion ? " still" : ""}`} aria-hidden="true">
      {cells.map((src,index) => <span className={`tool-lesson-cell cell-${index}`} key={index}><img src={src} alt="" /></span>)}
      <img className="tool-lesson-icon" src={assetUrl(bomb ? "/sprites/tile-bomb.png" : "/sprites/free-swap.png")} alt="" />
    </div>
    <p>{bomb ? "Tap a symbol, salt crust, or seedpod. The blast hits that one square; it does not crack its neighbors." : "Tap two adjacent movable tiles. They swap even when they do not make a match. Swapping a power-up can still fire it."}</p>
    <p className="tool-lesson-cost">No move used · One tool used only after you choose a valid target.</p>
    <div className="briefing-actions"><button className="quiet" onClick={onBack}>{replay ? "Back to lessons" : "Skip lesson"}</button><button className="primary" onClick={onDone}>{replay ? "Done" : "Use tool →"}</button></div>
  </div></div>;
}
