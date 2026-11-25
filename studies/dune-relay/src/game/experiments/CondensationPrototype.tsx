"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { assetUrl } from "../assetUrl";
import { GameAudio } from "../audio";
import { createPuzzle, type Puzzle } from "../core";
import type { GameEvent } from "../GameCanvas";
import { isPlaytestMode } from "../playtestMode";
import { CONDENSATION_LEVEL } from "./condensation";

const GameCanvas = dynamic(() => import("../GameCanvas"), { ssr: false });

export default function CondensationPrototype() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<"won" | "lost" | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [issue, setIssue] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const audio = useRef<GameAudio | null>(null);
  const skipReveal = useRef<(() => void) | null>(null);
  const back = `${assetUrl("/")}?playtest=1`;

  useEffect(() => {
    if (!isPlaytestMode(window.location.search)) { setAllowed(false); return; }
    setAllowed(true);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const sound = new GameAudio();
    sound.setScene("river", "auto", false);
    audio.current = sound;
    return () => { sound.dispose(); audio.current = null; };
  }, []);

  const restart = () => {
    audio.current?.unlock();
    setPuzzle(createPuzzle(CONDENSATION_LEVEL));
    setResult(null);
    setIssue(null);
    setStarted(true);
    setRun(value => value + 1);
  };
  const onEvent = (event: GameEvent) => {
    if (event.type === "resolvedTurn") setPuzzle(event.puzzle);
    if (event.type === "win") setResult("won");
    if (event.type === "lose") setResult("lost");
  };

  if (allowed === null) return <main className="loading">Loading Condensation test…</main>;
  if (!allowed) return <main className="loading"><div>Condensation is available only in the local playtest preview. <a href={back}>Back to Dune Relay</a></div></main>;
  return <main className="viewport">
    <div className="frame condensation-prototype" data-mode="puzzle" data-result={result ?? "playing"}>
      {started && puzzle && <GameCanvas key={run} prototype="condensation" mode="puzzle" region="river" activeCompanion="keeper" boardCompanion="keeper" mapPosition={null} repaired={false} caravanComplete={false} gatehouseComplete={false} gateOpening={false} nextLevel={null} replayDestinations={[]} replayMode={false} keeperMet={true} companionIntroduced={true} level={CONDENSATION_LEVEL} puzzle={puzzle} startingBoosters={[]} audio={audio.current} reducedMotion={reducedMotion} transitioning={false} interactionBlocked={result !== null || issue !== null} toolMode={null} authorizeTool={async () => false} onReady={() => true} onFailure={reason => setIssue(`The board could not load (${reason}).`)} onEvent={onEvent} skipReveal={skipReveal} />}
      <div className="condensation-nav"><a href={back}>← Back to playtest</a><button onClick={restart}>Retry</button><button onClick={() => void document.documentElement.requestFullscreen?.().catch(() => undefined)}>Full screen</button></div>
      {!started && <div className="scrim"><div className="dialog-card condensation-intro" role="dialog" aria-label="Condensation test"><span className="speaker">PLAYTEST · EXPERIMENT</span><h2>Condensation</h2><p>Match through a silver wet collector to spread water. Powers swapped off wet nets carry water, and Jets pick it up as their beams cross wet nets. Cover all 25 collectors in 26 moves.</p><p>Wet ground stays in its square when tiles fall. This test has no coins, rewards, or saved progress.</p><div className="briefing-actions"><a className="quiet" href={back}>Back</a><button className="primary" onClick={restart}>Test Condensation →</button></div></div></div>}
      {(result || issue) && <div className="scrim"><div className="dialog-card condensation-intro" role="dialog" aria-label="Condensation result"><span className="speaker">CONDENSATION TEST</span><h2>{result === "won" ? "All collectors filled!" : result === "lost" ? "Out of moves" : "Board interrupted"}</h2>{issue && <p>{issue}</p>}<div className="briefing-actions"><a className="quiet" href={back}>Back to playtest</a><button className="primary" onClick={restart}>Retry →</button></div></div></div>}
    </div>
  </main>;
}
