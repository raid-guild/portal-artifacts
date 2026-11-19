"use client";

import { assetUrl } from "./assetUrl";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { coinReward, createPuzzle, type Puzzle } from "./core";
import type { GameEvent } from "./GameCanvas";
import { GameAudio } from "./audio";
import { LEVELS, LEVEL_ORDER, type LevelId, nextLevel } from "./levels";
import { advanceChapterTransition, advanceTransition, completeLevel, EMPTY_SAVE, normalizeSave, readSave, type Region, type Save, writeSave } from "./save";
import { addAttempt, appendTurn, archiveCsv, archiveJson, emptyArchive, finishAttempt, readArchive, readPlaytestWallet, startAttempt, writeArchive, writePlaytestWallet, type AttemptRecord, type PlaytestArchive } from "./playtest";
import { COMPANIONS } from "./chapters";
import { waitForGameIdle } from "./gameLifecycle";
import { diagnosticsJson, logDiagnostic } from "./diagnostics";
import { prepareStartingBoosters, boosterCost, BOOSTERS, type BoosterKind, type BoosterPlacement } from "./boosters";

const GameCanvas = dynamic(() => import("./GameCanvas"), { ssr: false });
type Overlay = "start" | "keeper" | "briefing" | "shop" | "finale" | "lost" | "film" | "handoff" | "atlas" | "kingdom" | "party" | "wayfinder" | "gatewright" | "routeLit" | "crossingOpen" | "demoThanks" | null;
type PendingAttempt = { token: number; sceneAttempt: number; level: LevelId; selected: BoosterKind[]; cost: number; puzzle: Puzzle; placements: BoosterPlacement[]; status: "prepared" | "committed" | "failed" };
type FullscreenAttempt = { token: number; started: number; timer: ReturnType<typeof setTimeout> };

export default function GameShell() {
  const [playtest, setPlaytest] = useState(false);
  const [ready, setReady] = useState(false);
  const [save, setSave] = useState<Save>({ ...EMPTY_SAVE, completed: [], companions: [] });
  const [mode, setMode] = useState<"map" | "puzzle">("map");
  const [overlay, setOverlay] = useState<Overlay>("start");
  const [keeperMet, setKeeperMet] = useState(false);
  const [activeLevel, setActiveLevel] = useState<LevelId>("pumpHouse");
  const [shopLevel, setShopLevel] = useState<LevelId>("pumpHouse");
  const [shopReturn, setShopReturn] = useState<Overlay>(null);
  const [shopSelected, setShopSelected] = useState<BoosterKind[]>([]);
  const [shopError, setShopError] = useState<string | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [muted, setMuted] = useState(false);
  const [sfxVolume, setSfxVolume] = useState(0.7);
  const [ambienceVolume, setAmbienceVolume] = useState(0.22);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [settings, setSettings] = useState(false);
  const [filmBlocked, setFilmBlocked] = useState(false);
  const [filmReady, setFilmReady] = useState(false);
  const [sceneIssue, setSceneIssue] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const skipReveal = useRef<(() => void) | null>(null);
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIssue, setFullscreenIssue] = useState<string | null>(null);
  const [fullscreenEmbeddedBlocked, setFullscreenEmbeddedBlocked] = useState(false);
  const fullscreenPending = useRef<FullscreenAttempt | null>(null);
  const fullscreenToken = useRef(0);
  const [wipe, setWipe] = useState<"hidden" | "closing" | "covered" | "opening">("hidden");
  const transitioning = useRef(false);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const sceneReady = useRef<{ generation: number; attempt: number; settle: (status: "ready" | "failed" | "timeout") => void } | null>(null);
  const transitionGeneration = useRef(0);
  const reward = useRef(0);
  const mapPositions = useRef<Record<Region, { x: number; y: number } | null>>({ oasis: null, caravan: null, gatehouse: null });
  const saveRef = useRef<Save>({ ...EMPTY_SAVE, completed: [], companions: [] });
  const sound = useRef<GameAudio | null>(null);
  const film = useRef<HTMLVideoElement | null>(null);
  const archive = useRef<PlaytestArchive>(emptyArchive());
  const activeRecord = useRef<AttemptRecord | null>(null);
  const activeSince = useRef<number | null>(null);
  const pendingAttempt = useRef<PendingAttempt | null>(null);
  const tokenCounter = useRef(0);
  const gateOpenedPending = useRef(false);
  const filmKind = save.demoEnding === "film" ? "gatehouse" : save.transition?.from === "caravan" ? "caravan" : "oasis";
  const filmContent = {
    gatehouse: { source: "/cinematics/gatehouse-crossing.mp4", poster: "/cinematics/gatehouse-crossing-poster.webp", caption: "The bridge opens. The road carries on into farmland.", label: "The gate rises and the bridge opens into farmland" },
    caravan: { source: "/cinematics/caravan-departure.mp4", poster: "/cinematics/caravan-departure-poster.webp", caption: "The beacon lights the path. The walkers depart for the river.", label: "The walker train departs for the river" },
    oasis: { source: "/cinematics/oasis-awakens.mp4", poster: "/cinematics/oasis-awakens-poster.webp", caption: "The pump house wakes. Water crosses the oasis.", label: "The pump house comes to life" },
  }[filmKind];

  function finishFullscreenAttempt() {
    if (!fullscreenPending.current) return;
    clearTimeout(fullscreenPending.current.timer);
    fullscreenPending.current = null;
  }
  function lockLandscape() {
    const orientation = screen as Screen & { orientation?: ScreenOrientation & { lock?: (direction: string) => Promise<void> } };
    try { void orientation.orientation?.lock?.("landscape").catch(() => undefined); }
    catch { /* Orientation locking is optional. */ }
  }

  useEffect(() => {
    const testing = new URLSearchParams(window.location.search).get("playtest") === "1";
    const fullscreenChanged = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      setFullscreenAvailable(Boolean(document.documentElement.requestFullscreen) && document.fullscreenEnabled);
      setFullscreenEmbeddedBlocked(window.self !== window.top && !document.fullscreenEnabled);
      if (active) { finishFullscreenAttempt(); setFullscreenIssue(null); lockLandscape(); }
      logDiagnostic(active ? "fullscreen-entered" : "fullscreen-exited");
    };
    const fullscreenSync = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (active) { finishFullscreenAttempt(); setFullscreenIssue(null); }
      setFullscreenAvailable(Boolean(document.documentElement.requestFullscreen) && document.fullscreenEnabled);
      setFullscreenEmbeddedBlocked(window.self !== window.top && !document.fullscreenEnabled);
    };
    fullscreenSync();
    document.addEventListener("fullscreenchange", fullscreenChanged);
    window.addEventListener("pageshow", fullscreenSync);
    document.addEventListener("visibilitychange", fullscreenSync);
    setPlaytest(testing);
    if (testing) { archive.current = readArchive(); writeArchive(archive.current); const wallet = readPlaytestWallet(); const loaded = normalizeSave({ ...saveRef.current, coins: wallet.coins }); saveRef.current = loaded; setSave(loaded); }
    if (!testing) { const loaded = readSave(); saveRef.current = loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse")); }
    setReady(true);
    const mixer = new GameAudio();
    sound.current = mixer;
    try {
      const audio = JSON.parse(localStorage.getItem("dune-relay-audio-v1") ?? "null");
      if (audio && typeof audio === "object") {
        setMuted(Boolean(audio.muted));
        if (typeof audio.sfx === "number") setSfxVolume(Math.max(0, Math.min(1, audio.sfx)));
        if (typeof audio.ambience === "number") setAmbienceVolume(Math.max(0, Math.min(1, audio.ambience)));
      }
    } catch { /* Audio settings remain available for this session. */ }
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const pageError = (event: ErrorEvent) => logDiagnostic("window-error", { message: String(event.message).slice(0, 160) });
    const rejection = (event: PromiseRejectionEvent) => logDiagnostic("unhandled-rejection", { message: String(event.reason).slice(0, 160) });
    window.addEventListener("error", pageError);
    window.addEventListener("unhandledrejection", rejection);
    return () => {
      finishFullscreenAttempt();
      fullscreenToken.current++;
      for (const timer of timers.current) clearTimeout(timer);
      timers.current.clear();
      sceneReady.current = null;
      mixer.dispose(); if (sound.current === mixer) sound.current = null;
      document.removeEventListener("fullscreenchange", fullscreenChanged);
      window.removeEventListener("pageshow", fullscreenSync);
      document.removeEventListener("visibilitychange", fullscreenSync);
      window.removeEventListener("error", pageError);
      window.removeEventListener("unhandledrejection", rejection);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    sound.current?.setLevels(muted, sfxVolume, overlay === "film" ? 0 : ambienceVolume);
    try { localStorage.setItem("dune-relay-audio-v1", JSON.stringify({ muted, sfx: sfxVolume, ambience: ambienceVolume })); }
    catch { /* Private browsing can block storage. */ }
  }, [ready, muted, sfxVolume, ambienceVolume, overlay]);

  useEffect(() => {
    if (!playtest) return;
    if (settings || overlay !== null || wipe !== "hidden" || mode !== "puzzle" || document.hidden) recordPause(); else recordResume();
    const visibility = () => { if (document.hidden) recordPause(); else if (!settings && overlay === null && wipe === "hidden" && mode === "puzzle") recordResume(); };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [playtest, settings, overlay, wipe, mode]);

  useEffect(() => {
    if (overlay !== "film") { setFilmReady(false); return; }
    let cancelled = false;
    void waitForGameIdle().then(() => {
      if (cancelled) return;
      logDiagnostic("film-renderer-idle");
      setFilmReady(true);
    });
    return () => { cancelled = true; };
  }, [overlay]);

  useEffect(() => {
    if (overlay !== "film" || !filmReady || !film.current) return;
    const video = film.current;
    logDiagnostic("film-source-attached", { film: filmKind });
    return () => {
      video.pause(); video.removeAttribute("src"); video.load();
      logDiagnostic("film-source-released", { film: filmKind });
    };
  }, [overlay, filmReady]);

  useEffect(() => {
    if (overlay !== "film" || !filmReady || wipe !== "hidden" || !film.current) return;
    let cancelled = false;
    let playGeneration = 0;
    const video = film.current;
    setFilmBlocked(false);
    video.muted = muted;
    video.volume = sfxVolume;
    const play = () => {
      if (cancelled || document.hidden || video.ended) return;
      const generation = ++playGeneration;
      void video.play().then(() => {
        if (!cancelled && generation === playGeneration) logDiagnostic("film-playing", { film: filmKind });
      }).catch(error => {
        if (!cancelled && generation === playGeneration) { logDiagnostic("film-play-failed", { message: String(error).slice(0, 160) }); setFilmBlocked(true); }
      });
    };
    const visibility = () => {
      if (document.hidden) { playGeneration++; video.pause(); logDiagnostic("film-paused-hidden"); }
      else if (!video.ended) { logDiagnostic("film-resume-visible"); play(); }
    };
    document.addEventListener("visibilitychange", visibility);
    play();
    return () => { cancelled = true; playGeneration++; document.removeEventListener("visibilitychange", visibility); video.pause(); };
  }, [overlay, filmReady, muted, sfxVolume, wipe]);

  function recordPause() { if (activeRecord.current && activeSince.current !== null) { activeRecord.current = { ...activeRecord.current, activeMs: activeRecord.current.activeMs + Math.max(0, performance.now() - activeSince.current) }; activeSince.current = null; storeRecord(); } }
  function recordResume() { if (activeRecord.current?.outcome === "playing" && activeSince.current === null && !document.hidden) activeSince.current = performance.now(); }
  function storeRecord() { if (!playtest || !activeRecord.current) return; archive.current = addAttempt(archive.current, activeRecord.current); writeArchive(archive.current); }
  function abandonRecord(reason: string) { if (!activeRecord.current || activeRecord.current.outcome !== "playing") return; recordPause(); activeRecord.current = finishAttempt(activeRecord.current, "abandoned", reason); storeRecord(); activeRecord.current = null; }
  function downloadStats(format: "json" | "csv") { if (!playtest) return; recordPause(); const body = format === "json" ? archiveJson(archive.current) : archiveCsv(archive.current); const blob = new Blob([body], { type: format === "json" ? "application/json" : "text/csv" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `dune-relay-playtest-${new Date().toISOString().slice(0,10)}.${format}`; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); if (!settings) recordResume(); }
  function downloadDiagnostics() { const blob = new Blob([diagnosticsJson()], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `dune-relay-diagnostics-${new Date().toISOString().slice(0,10)}.json`; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function persist(next: Save) {
    if (next === saveRef.current) return;
    saveRef.current = next; setSave(next);
    if (playtest) writePlaytestWallet({ version: 1, coins: next.coins });
    else writeSave(next);
  }
  function checkpoint(from: Save["oasisTransition"], to: Save["oasisTransition"]) {
    persist(advanceTransition(saveRef.current, from, to));
  }
  function toggleSound() { sound.current?.unlock(); setMuted(value => !value); }
  function delay(ms: number) {
    return new Promise<void>(resolve => {
      const timer = setTimeout(() => { timers.current.delete(timer); resolve(); }, ms);
      timers.current.add(timer);
    });
  }
  async function transitionTo(changeScene: () => void, createsScene = true) {
    if (transitioning.current) return;
    const generation = ++transitionGeneration.current;
    transitioning.current = true; recordPause(); setSceneIssue(null); setWipe("closing"); sound.current?.play("awning");
    logDiagnostic("transition-start", { generation, createsScene });
    try {
      await delay(reducedMotion ? 110 : 275);
      setWipe("covered");
      let readyScene: Promise<"ready" | "failed" | "timeout"> = Promise.resolve("ready");
      if (createsScene) readyScene = new Promise(resolve => {
        let remaining = 10_000;
        let last = performance.now();
        let timer: ReturnType<typeof setTimeout>;
        const settle = (status: "ready" | "failed" | "timeout") => {
          clearTimeout(timer); timers.current.delete(timer);
          if (sceneReady.current?.generation === generation) sceneReady.current = null;
          resolve(status);
        };
        const check = () => {
          timers.current.delete(timer);
          const now = performance.now();
          if (!document.hidden) remaining -= now - last;
          last = now;
          if (remaining <= 0) settle("timeout");
          else { timer = setTimeout(check, Math.min(1000, remaining)); timers.current.add(timer); }
        };
        sceneReady.current = { generation, attempt: attempt + 1, settle };
        timer = setTimeout(check, 1000); timers.current.add(timer);
      });
      changeScene();
      const status = await readyScene;
      logDiagnostic("transition-scene", { generation, status });
      if (status !== "ready") setSceneIssue(previous => previous?.includes("purchase") ? previous : status === "timeout" ? "The scene took too long to load." : "The scene could not load.");
      await delay(reducedMotion ? 30 : 70);
    } catch (error) {
      logDiagnostic("transition-error", { generation, message: String(error).slice(0, 160) });
      setSceneIssue(previous => previous?.includes("purchase") ? previous : "The scene could not load.");
    } finally {
      if (sceneReady.current?.generation === generation) sceneReady.current.settle("failed");
      if (transitionGeneration.current === generation) {
        setWipe("opening");
        await delay(reducedMotion ? 110 : 305);
        setWipe("hidden");
        transitioning.current = false;
        logDiagnostic("transition-finished", { generation });
        if (gateOpenedPending.current) { gateOpenedPending.current = false; beginDemoFilm(); }
      }
    }
  }
  function overlayForSave(value: Save): Overlay {
    return value.demoEnding === "film" ? "film"
      : value.demoEnding === "thanks" ? "demoThanks"
      : value.transition?.stage === "film" ? "film"
      : value.transition?.stage === "handoff" ? "handoff"
      : value.transition?.stage === "atlas" ? "atlas"
      : value.oasisTransition === "film" ? "film"
      : value.oasisTransition === "keeper" ? "handoff"
      : value.oasisTransition === "atlas" ? "atlas"
      : null;
  }
  function requestGameFullscreen(source: "intro" | "manual" = "manual") {
    const pending = fullscreenPending.current;
    if (source === "manual") logDiagnostic("fullscreen-button-activated", {
      active: Boolean(navigator.userActivation?.isActive), fullscreen: Boolean(document.fullscreenElement),
      pendingMs: pending ? Math.round(performance.now() - pending.started) : -1,
    });
    if (pending && !document.fullscreenElement && performance.now() - pending.started >= 5_000) {
      finishFullscreenAttempt();
      logDiagnostic("fullscreen-timeout", { elapsedMs: Math.round(performance.now() - pending.started), source: "retry" });
    }
    if (fullscreenPending.current || document.fullscreenElement) return;
    const coarse = window.matchMedia("(pointer: coarse) and (hover: none)").matches;
    const embedded = window.self !== window.top;
    const details = { enabled: document.fullscreenEnabled, embedded, coarse, active: Boolean(navigator.userActivation?.isActive) };
    logDiagnostic("fullscreen-request", details);
    setFullscreenIssue(null);
    if (!document.documentElement.requestFullscreen || !document.fullscreenEnabled) {
      logDiagnostic("fullscreen-failed", { ...details, name: "Unavailable" });
      setFullscreenEmbeddedBlocked(embedded);
      setFullscreenIssue("Fullscreen couldn't open. Tap Full screen to try again.");
      return;
    }
    const token = ++fullscreenToken.current;
    const started = performance.now();
    const timer = setTimeout(() => {
      if (fullscreenPending.current?.token !== token) return;
      finishFullscreenAttempt();
      if (document.fullscreenElement) { setIsFullscreen(true); setFullscreenIssue(null); return; }
      logDiagnostic("fullscreen-timeout", { ...details, elapsedMs: Math.round(performance.now() - started) });
      setFullscreenIssue("Fullscreen didn't open. Tap Full screen to try again.");
    }, 5_000);
    fullscreenPending.current = { token, started, timer };
    setFullscreenIssue("Opening fullscreen…");
    // Begin the request in the click handler. Waiting for audio or a scene wipe
    // would let the browser's transient user activation expire.
    let request: Promise<void>;
    try { request = document.documentElement.requestFullscreen({ navigationUI: "hide" }); }
    catch (error) { request = Promise.reject(error); }
    void request.then(() => {
      if (fullscreenPending.current?.token !== token) return;
      finishFullscreenAttempt();
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (active) { setFullscreenIssue(null); lockLandscape(); }
      else { logDiagnostic("fullscreen-failed", { ...details, name: "NoFullscreenElement" }); setFullscreenIssue("Fullscreen didn't open. Tap Full screen to try again."); }
    }).catch(error => {
      if (fullscreenPending.current?.token !== token) return;
      finishFullscreenAttempt();
      logDiagnostic("fullscreen-failed", { ...details, name: String(error?.name ?? "Error").slice(0, 60), message: String(error?.message ?? error).slice(0, 160) });
      setFullscreenIssue("Fullscreen couldn't open. Tap Full screen to try again.");
      setFullscreenEmbeddedBlocked(embedded && !document.fullscreenEnabled);
    });
  }
  function enter() {
    if (window.matchMedia("(pointer: coarse) and (hover: none)").matches) requestGameFullscreen("intro");
    const unlocked = sound.current?.unlock();
    void unlocked?.then(() => sound.current?.play("ui"));
    const enteringOverlay = overlayForSave(saveRef.current);
    void transitionTo(() => { setOverlay(enteringOverlay); setAttempt(value => value + 1); }, enteringOverlay !== "film");
  }
  function startLevel(id: LevelId) {
    pendingAttempt.current = null;
    setShopLevel(id); setShopSelected([]); setShopError(null);
    setShopReturn(overlay);
    setOverlay("shop");
  }
  function launchLevel() {
    if (transitioning.current) return;
    const id = shopLevel;
    const cost = boosterCost(shopSelected);
    if (cost > saveRef.current.coins) { setShopError("Not enough coins for this loadout."); return; }
    let prepared: ReturnType<typeof prepareStartingBoosters>;
    try { prepared = prepareStartingBoosters(createPuzzle(LEVELS[id]), shopSelected); }
    catch (error) { setShopError(String(error)); return; }
    const token = ++tokenCounter.current;
    pendingAttempt.current = { token, sceneAttempt: attempt + 1, level: id, selected: [...shopSelected], cost, puzzle: prepared.puzzle, placements: prepared.placements, status: "prepared" };
    setRevealing(false);
    abandonRecord("started-another-level");
    activeRecord.current = null;
    void transitionTo(() => {
      setActiveLevel(id); setPuzzle(prepared.puzzle); setMode("puzzle");
      setAttempt(value => value + 1); setOverlay(null);
    });
  }
  function cancelShop() {
    pendingAttempt.current = null; setShopError(null);
    if (shopReturn === null && mode === "map") void transitionTo(() => { setOverlay(null); setAttempt(value => value + 1); });
    else setOverlay(shopReturn);
  }
  function recoverShop() {
    pendingAttempt.current = null;
    setShopReturn(null);
    setShopSelected([]);
    setShopError("The purchase could not be saved. Choose no boosters to play for free, or try again after storage is available.");
    void transitionTo(() => { setMode("map"); setPuzzle(null); setOverlay("shop"); setAttempt(value => value + 1); });
  }
  function authorizeSceneReady(): boolean {
    const current = pendingAttempt.current;
    if (mode !== "puzzle") return true;
    if (!current || current.sceneAttempt !== attempt || current.level !== activeLevel || current.status === "failed") return false;
    if (current.status === "committed") return true;
    if (current.cost > saveRef.current.coins) { current.status = "failed"; setSceneIssue("Not enough coins for this loadout."); return false; }
    if (current.cost > 0) {
      const next = { ...saveRef.current, coins: saveRef.current.coins - current.cost };
      if (!(playtest ? writePlaytestWallet({ version: 1, coins: next.coins }) : writeSave(next))) { current.status = "failed"; setSceneIssue("The purchase could not be saved. Reload and try again."); return false; }
      saveRef.current = next; setSave(next);
    }
    current.status = "committed";
    logDiagnostic("starting-boosters-committed", { token: current.token, level: current.level, selected: current.selected.join(","), cost: current.cost });
    return true;
  }
  function onEvent(event: GameEvent) {
    if (event.type === "gateOpened" && transitioning.current) { gateOpenedPending.current = true; return; }
    if (transitioning.current) return;
    if ("position" in event) mapPositions.current[saveRef.current.region] = event.position;
    if (event.type === "playReady") { if (playtest && !activeRecord.current) { activeRecord.current = startAttempt(LEVELS[activeLevel], puzzle ?? createPuzzle(LEVELS[activeLevel]), new Date(), pendingAttempt.current?.selected ?? [], pendingAttempt.current?.cost ?? 0, "sandbox"); storeRecord(); recordResume(); } return; }
    if (event.type === "gateOpened") { if (saveRef.current.demoEnding === "gate") { if (transitioning.current) gateOpenedPending.current = true; else beginDemoFilm(); } return; }
    if (event.type === "resolvedTurn") {
      // Commit a terminal reward when the rule engine accepts the move. If the
      // renderer is interrupted during its animation, a reload keeps the win.
      if (event.turn.state.status === "won") {
        reward.current = coinReward(event.turn.state.moves);
        persist(completeLevel(saveRef.current, activeLevel, reward.current));
      }
      if (playtest && activeRecord.current) { recordPause(); activeRecord.current = appendTurn(activeRecord.current, event.turn, event.from, event.to); if (event.turn.state.status !== "playing") { activeRecord.current = finishAttempt(activeRecord.current, event.turn.state.status, "goals-or-moves"); } storeRecord(); }
      return;
    }
    if (event.type === "keeper") { setOverlay("keeper"); sound.current?.play("ui"); return; }
    if (event.type === "gatewright") { setOverlay("gatewright"); sound.current?.play("ui"); return; }
    if (event.type === "wayfinder") { setOverlay("wayfinder"); sound.current?.play("ui"); return; }
    if (event.type === "pump") {
      const next = nextLevel(saveRef.current.completed);
      if (saveRef.current.region === "gatehouse") {
        if (next === "gatehouseApproach") setOverlay("gatewright");
        else if (next && LEVELS[next].chapter === "gatehouse") { setOverlay("briefing"); sound.current?.play("ui"); }
        return;
      }
      if (saveRef.current.region === "caravan") {
        if (next === "caravanPennants") setOverlay("wayfinder");
        else if (next && LEVELS[next].chapter === "caravan") { setOverlay("briefing"); sound.current?.play("ui"); }
        return;
      }
      if (next === "pumpHouse" && !keeperMet) return;
      if (next !== "pumpHouse" && next && LEVELS[next].chapter !== "caravan") { setOverlay("briefing"); sound.current?.play("ui"); return; }
      if (next === "pumpHouse") startLevel(next);
      return;
    }
    if (event.type === "turn") { setPuzzle(event.puzzle); if (playtest && activeRecord.current?.outcome === "playing" && !settings) recordResume(); return; }
    if (event.type === "lose") { setOverlay("lost"); sound.current?.play("lose"); return; }
    if (event.type === "revealStarted") { setRevealing(true); return; }
    if (event.type === "victory") {
      reward.current = coinReward(event.puzzle.moves);
      persist(completeLevel(saveRef.current, activeLevel, reward.current));
      return;
    }
    if (event.type === "win") { setRevealing(false); setOverlay("finale"); sound.current?.play("win"); }
  }
  function closeDialogue() {
    void transitionTo(() => {
      if (overlay === "keeper") setKeeperMet(true);
      setOverlay(null); setAttempt(value => value + 1);
    });
  }
  function beginDemoFilm() {
    if (saveRef.current.demoEnding !== "gate") return;
    persist(normalizeSave({ ...saveRef.current, demoEnding: "film" }));
    setOverlay("film");
  }
  function finishFilm() {
    if (saveRef.current.demoEnding === "film") { persist(normalizeSave({ ...saveRef.current, demoEnding: "thanks" })); setOverlay("demoThanks"); return; }
    if (saveRef.current.transition?.from === "caravan" && saveRef.current.transition.stage === "film") { persist(advanceChapterTransition(saveRef.current, "film", "handoff")); setOverlay("handoff"); return; }
    if (saveRef.current.oasisTransition !== "film") { setOverlay(null); return; }
    checkpoint("film", "keeper");
    setOverlay("handoff");
  }
  function acceptHandoff() {
    if (saveRef.current.transition?.from === "caravan") { persist(advanceChapterTransition(saveRef.current, "handoff", "atlas")); setOverlay("atlas"); return; }
    checkpoint("keeper", "atlas");
    setOverlay("atlas");
  }
  function travelToCaravan() {
    if (saveRef.current.transition?.from === "caravan") { persist(advanceChapterTransition(saveRef.current, "atlas", "arrival")); void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); }); return; }
    checkpoint("atlas", "arrival");
    void transitionTo(() => {
      setMode("map"); setOverlay(null); setAttempt(value => value + 1);
    });
  }
  function visitRegion(region: Region) {
    if (saveRef.current.oasisTransition !== "ready" || region === "gatehouse" && !saveRef.current.gatehouseReady) return;
    persist({ ...saveRef.current, region });
    void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); });
  }
  function openGatehouse() { persist(advanceChapterTransition(saveRef.current, "arrival", "ready")); startLevel("gatehouseApproach"); }
  function followPennants() {
    checkpoint("arrival", "ready");
    startLevel("caravanPennants");
  }
  function startBriefing() {
    const next = nextLevel(saveRef.current.completed);
    if (next && (LEVELS[next].chapter ?? "oasis") === saveRef.current.region) startLevel(next);
  }
  function retry() { abandonRecord("retry"); activeRecord.current = null; setRevealing(false); startLevel(activeLevel); }
  function replayLevel(id: LevelId) {
    abandonRecord("replay"); activeRecord.current = null;
    if (playtest) {
        const chapter = LEVELS[id].chapter ?? "oasis";
        const completed = LEVEL_ORDER.slice(0, LEVEL_ORDER.indexOf(id)) as LevelId[];
        persist(normalizeSave({ ...saveRef.current, completed, region: chapter,
          oasisTransition: chapter !== "oasis" ? "ready" : "locked", gatehouseReady: chapter === "gatehouse", transition: null, demoEnding: "locked",
          companions: chapter === "gatehouse" ? ["keeper", "wayfinder", "gatewright"] : chapter === "caravan" ? ["keeper", "wayfinder"] : completed.length ? ["keeper"] : [] }));
        setKeeperMet(completed.includes("pumpHouse"));
    }
    setSettings(false); startLevel(id);
  }
  function finish() {
    setRevealing(false);
    abandonRecord("left-board"); activeRecord.current = null;
    const chapterEnd = activeLevel === "openWaterway" && saveRef.current.oasisTransition === "film" || activeLevel === "lightTheRoute" && saveRef.current.transition?.from === "caravan" && saveRef.current.transition.stage === "film";
    void transitionTo(() => {
        setMode("map"); setAttempt(value => value + 1); setOverlay(chapterEnd ? "film" : null);
      }, !chapterEnd);
  }
  function reset() {
    abandonRecord("reset"); activeRecord.current = null;
    void transitionTo(() => {
      const fresh: Save = { ...EMPTY_SAVE, completed: [], companions: [] };
      saveRef.current = fresh; setSave(fresh);
      if (playtest) writePlaytestWallet({ version: 1, coins: 0 });
      else writeSave(fresh);
      setMode("map"); mapPositions.current = { oasis: null, caravan: null, gatehouse: null }; setKeeperMet(false);
      setPuzzle(null); setSettings(false); setOverlay("start"); setAttempt(value => value + 1);
    });
  }

  if (!ready) return <main className="loading">Loading the kingdom…</main>;
  const repaired = save.completed.includes("pumpHouse");
  const available = nextLevel(save.completed);
  const level = LEVELS[activeLevel];
  const mapLevel = available && (LEVELS[available].chapter ?? "oasis") === save.region ? available : null;
  const partyUnlocked = save.companions.includes("keeper");
  const isCaravan = save.region === "caravan";
  const isGatehouse = save.region === "gatehouse";
  const speakerId = isGatehouse ? "gatewright" : isCaravan ? "wayfinder" : "keeper";
  const speaker = COMPANIONS[speakerId];
  const goalsLeft = Object.entries(puzzle?.goals ?? {}).filter(([, count]) => count > 0).map(([kind, count]) => `${count} ${kind === "leaf" ? "reeds" : kind === "pennant" ? "pennants" : kind === "key" ? "keys" : kind === "crust" ? "salt blocks" : kind}`).join(" and ");
  return <main className="viewport">
    <div className="frame" aria-label="Dune Relay game" data-mode={mode} data-moves={mode === "puzzle" ? puzzle?.moves : undefined} data-reduced-motion={reducedMotion}>
      {overlay !== "film" && overlay !== "start" && <GameCanvas key={`${mode}-${save.region}-${attempt}`} mode={mode} region={save.region} mapPosition={mapPositions.current[save.region]} repaired={repaired} caravanComplete={save.completed.includes("lightTheRoute")} gatehouseComplete={save.completed.includes("openTheCrossing")} gateOpening={save.demoEnding === "gate"} nextLevel={mapLevel} keeperMet={keeperMet} level={level} puzzle={puzzle} startingBoosters={mode === "puzzle" && pendingAttempt.current?.sceneAttempt === attempt && pendingAttempt.current.level === activeLevel && pendingAttempt.current.status !== "failed" ? pendingAttempt.current.placements : []} audio={sound.current} reducedMotion={reducedMotion} transitioning={wipe !== "hidden"} onReady={() => { const authorized = authorizeSceneReady(); if (sceneReady.current?.attempt === attempt) sceneReady.current.settle(authorized ? "ready" : "failed"); return authorized; }} onFailure={reason => {
        logDiagnostic("scene-failure", { reason, attempt });
        if (pendingAttempt.current?.sceneAttempt === attempt && pendingAttempt.current.status === "prepared") pendingAttempt.current.status = "failed";
        if (sceneReady.current?.attempt === attempt) sceneReady.current.settle("failed");
        setSceneIssue(reason === "context-lost" ? "The graphics context was interrupted." : "The scene could not load.");
      }} onEvent={onEvent} skipReveal={skipReveal} />}
      <span className="coin-pill" aria-label={`${save.coins} coins`}><img src={assetUrl("/sprites/coin.png")} alt="" />{save.coins.toLocaleString("en-US")}</span>
      <div className="top-actions" inert={wipe !== "hidden"}>
        {mode === "map" && partyUnlocked && <>
          <button className="nav-button" onClick={() => setOverlay("kingdom")}>Kingdom Map</button>
          <button className="nav-button" onClick={() => setOverlay("party")}>Raid Party</button>
        </>}
        <button className="icon-button" onClick={toggleSound} aria-label={muted ? "Unmute" : "Mute"}>{muted ? "♪̸" : "♪"}</button>
        <button className="icon-button" onClick={() => setSettings(true)} aria-label="Settings">⚙</button>
      </div>
      {revealing && mode === "puzzle" && <button className="skip-reveal" onClick={() => skipReveal.current?.()}>Skip reveal →</button>}
      {fullscreenAvailable && !isFullscreen && <button className="fullscreen-return" onClick={() => requestGameFullscreen()}>⛶ Full screen</button>}
      {fullscreenIssue && <div className="fullscreen-issue" role="status">{fullscreenIssue}</div>}
      {fullscreenEmbeddedBlocked && <a className="fullscreen-new-tab" href={typeof window === "undefined" ? undefined : window.location.href} target="_blank" rel="noopener noreferrer">Open game in a new tab ↗</a>}
      {overlay === "start" && <div className={`scrim intro${isGatehouse ? " intro-gatehouse" : isCaravan ? " intro-caravan" : ""}`}><div className="intro-card">
        <div className="eyebrow">A RAIDGUILD ADVENTURE</div><h1>DUNE<br />RELAY</h1>
        <p>{isGatehouse ? "The caravan has reached the river. The Gatewright needs our help opening the crossing." : save.completed.includes("lightTheRoute") ? "The beacon lights the desert road. The caravan chapter is complete." : isCaravan ? "The waterway is alive. The caravan road is open." : available === "caravanPennants" ? "The pump house has come to life. A new route waits beyond the oasis." : repaired ? "The intake is flowing. Follow the path to the next station." : "The oasis pump has gone quiet. Find the keeper, bring the machine to life, and follow the water."}</p>
        <button className="primary" onClick={enter}>{save.oasisTransition !== "locked" && save.oasisTransition !== "ready" ? "Continue the journey" : isGatehouse ? "Enter the gatehouse" : isCaravan ? "Enter the desert" : "Enter the oasis"} <span>↗</span></button>
        {save.demoEnding === "done" && !playtest && <button className="quiet" onClick={() => window.location.assign("?playtest=1")}>Playtest levels →</button>}
        <small>Touch to walk · Mobile landscape · WASD and mouse on desktop</small>
      </div></div>}
      {overlay === "keeper" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/keeper-avatar.png")} alt="" /><span className="speaker">THE KEEPER</span></div>
        <p>{LEVELS.pumpHouse.briefing}</p><button className="primary" onClick={closeDialogue}>Let's do it <span>→</span></button>
      </div></div>}
      {overlay === "briefing" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={speaker.portrait} alt="" /><span className="speaker">{speaker.name.toUpperCase()} · {mapLevel ? LEVELS[mapLevel].title : isGatehouse ? "RIVER GATEHOUSE" : isCaravan ? "OPEN DESERT" : "OASIS"}</span></div>
        <p>{mapLevel ? LEVELS[mapLevel].briefing : "The oasis is flowing."}</p>
        <button className="primary" onClick={startBriefing}>Start level <span>→</span></button>
      </div></div>}
      {overlay === "shop" && <div className="scrim"><div className="dialog-card booster-shop">
        <span className="speaker">{LEVELS[shopLevel].title.toUpperCase()} · STARTING BOOSTERS</span>
        <p>Choose up to one of each. Boosters start on the board and are used for this attempt.</p>
        <div className="shop-balance">{save.coins.toLocaleString("en-US")} coins available{playtest && <small>Test wallet · campaign coins stay untouched</small>}</div>
        <div className="booster-options">{BOOSTERS.map(item => <button key={item.kind} className={`booster-option${shopSelected.includes(item.kind) ? " selected" : ""}`} aria-pressed={shopSelected.includes(item.kind)} onClick={() => { setShopError(null); setShopSelected(current => current.includes(item.kind) ? current.filter(kind => kind !== item.kind) : [...current, item.kind]); }}>
          <img src={assetUrl(item.image as `/${string}`)} alt="" />
          <strong>{item.title}</strong><small>{item.description}</small><b>{item.cost} coins</b>
        </button>)}</div>
        <div className="shop-total">Total: {boosterCost(shopSelected).toLocaleString("en-US")} coins</div>
        {shopError && <p className="shop-error" role="alert">{shopError}</p>}
        <div className="shop-actions"><button className="quiet" onClick={cancelShop}>Cancel</button><button className="primary" onClick={launchLevel}>Start level <span>→</span></button></div>
      </div></div>}
      {overlay === "film" && <div className="film-screen">
        <video ref={film} src={filmReady ? assetUrl(filmContent.source as `/${string}`) : undefined} poster={assetUrl(filmContent.poster as `/${string}`)} playsInline preload="metadata" onEnded={finishFilm} onLoadedMetadata={event => logDiagnostic("film-metadata", { film: filmKind, width: event.currentTarget.videoWidth, height: event.currentTarget.videoHeight })} onError={() => { logDiagnostic("film-media-error", { film: filmKind }); setFilmBlocked(true); }} aria-label={filmContent.label} />
        <div className="film-caption">{filmContent.caption}</div>
        {filmBlocked && <button className="primary film-play" onClick={() => { void film.current?.play().then(() => setFilmBlocked(false)).catch(() => setFilmBlocked(true)); }}>Play scene <span>▶</span></button>}
        <button className="film-skip" onClick={finishFilm}>Skip scene →</button>
      </div>}
      {overlay === "handoff" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={save.transition?.from === "caravan" ? assetUrl("/sprites/wayfinder-avatar.png") : assetUrl("/sprites/keeper-avatar.png")} alt="" /><span className="speaker">{save.transition?.from === "caravan" ? "THE WAYFINDER" : "THE KEEPER"}</span></div>
        {save.transition?.from === "caravan" ? <p>The beacon connects the desert road, but the river crossing is sealed. Walkers cannot carry the caravan over it. The Gatewright tends the bridge winches. Let’s bring her the keys and reopen the way into farmland.</p> : <p>Listen to that water. The pump can run without us now. Beyond the dunes, the walker train needs a marked route. Take the map, and find the Wayfinder. A shared road is how we carry this oasis to the rest of the kingdom.</p>}
        <button className="primary" onClick={acceptHandoff}>Open the kingdom map <span>→</span></button>
      </div></div>}
      {(overlay === "atlas" || overlay === "kingdom") && <div className="atlas-screen">
        <div className="atlas-plane">
          <img src={assetUrl("/kingdom.webp")} alt="Illustrated kingdom with the oasis, camel caravan, river bridge, farmland, and distant regions" />
          <svg className="atlas-path" viewBox="0 0 1774 887" aria-hidden="true">
            <path className="atlas-path-shadow" d="M444 580 C620 610 720 682 885 695 M885 695 C1005 716 1074 751 1195 768" />
            <path className="atlas-path-light" d="M444 580 C620 610 720 682 885 695 M885 695 C1005 716 1074 751 1195 768" />
          </svg>
          <span className="atlas-anchor oasis-anchor" /><span className="atlas-anchor caravan-anchor" /><span className="atlas-anchor bridge-anchor" />
          <div className="atlas-route">
            <button className="atlas-stamp" disabled={save.oasisTransition !== "ready"} onClick={() => visitRegion("oasis")}>OASIS ✓<small>Waterway restored · visit</small></button>
            <button className="atlas-active" disabled={save.oasisTransition !== "ready"} onClick={() => visitRegion("caravan")}>OPEN DESERT {save.completed.includes("lightTheRoute") ? "✓" : ""}<small>{save.completed.includes("lightTheRoute") ? "Route beacon lit · visit" : "Walker train · route beacon"}</small></button>
            {save.completed.includes("lightTheRoute") && <button className="atlas-gatehouse" disabled={!save.gatehouseReady} onClick={() => visitRegion("gatehouse")}>RIVER GATEHOUSE {save.completed.includes("openTheCrossing") ? "✓" : ""}<small>{save.gatehouseReady ? "Bridge crossing · visit" : "River crossing ahead"}</small></button>}
          </div>
        </div>
        <div className="atlas-heading">THE KINGDOM <span>{overlay === "atlas" ? "A NEW ROUTE OPENS" : "THE JOURNEY"}</span></div>
        <div className="atlas-future">{save.completed.includes("openTheCrossing") ? "The bridge is open toward the farmland. That road belongs to a later chapter." : save.completed.includes("lightTheRoute") ? "The caravan has reached the river bridge." : "Follow the lighted road through the desert."}</div>
        <button className="primary atlas-action" onClick={overlay === "atlas" ? travelToCaravan : () => setOverlay(null)}>{overlay === "atlas" ? save.transition?.to === "gatehouse" ? "Travel to the river bridge" : "Travel to the caravan" : "Return to the path"} <span>→</span></button>
      </div>}
      {overlay === "party" && <div className="scrim"><div className="party-card">
        <div className="eyebrow">THE RAID PARTY</div><h2>Those who keep the road open</h2>
        <div className="party-list">
          {(["keeper", "wayfinder", "gatewright"] as const).map(id => save.companions.includes(id) ? <div className="party-member" key={id}><img src={COMPANIONS[id].portrait} alt="" /><div><strong>{COMPANIONS[id].name}</strong><p>{COMPANIONS[id].chapter} · {COMPANIONS[id].power}.</p></div></div> : <div className="party-member unknown" key={id}><span>?</span><div><strong>Future companion</strong><p>Waiting farther along the road.</p></div></div>)}
        </div><button className="primary" onClick={() => setOverlay(null)}>Back to the path <span>→</span></button>
      </div></div>}
      {overlay === "wayfinder" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/wayfinder-avatar.png")} alt="" /><span className="speaker">THE WAYFINDER · WINDWARD TRAIL</span></div>
        <p>These coral pennants mark the route for every walker. Match them with the familiar oasis symbols. Every nine pennants gives me enough tailwind to send two Flywheels. Help me set the trail, and I’ll travel with your party.</p>
        <button className="primary" onClick={followPennants}>Follow the pennants <span>→</span></button>
      </div></div>}
      {overlay === "gatewright" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/gatewright-avatar.png")} alt="" /><span className="speaker">THE GATEWRIGHT · RIVER GATEHOUSE</span></div>
        <p>The bridge winches have locked under salt. These violet keys fit the old controls. Match them to help me free the gate. Every nine keys, I can place one Prism on your board; swap it with a symbol or double-tap it when you need it.</p>
        <button className="primary" onClick={openGatehouse}>Open the gatehouse <span>→</span></button>
      </div></div>}
      {overlay === "crossingOpen" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/gatewright-avatar.png")} alt="" /><span className="speaker">THE GATEWRIGHT · CROSSING OPEN</span></div>
        <h2>The bridge is open</h2><p>The counterweights lift, and water runs through the gatehouse. The walkers can cross toward the farmland when that chapter is ready.</p>
        <button className="primary" onClick={() => setOverlay("kingdom")}>View the kingdom map <span>→</span></button>
        <button className="quiet" onClick={() => setOverlay(null)}>Return to the gatehouse</button>
      </div></div>}
      {overlay === "demoThanks" && <div className="scrim demo-ending">
        <div className="demo-confetti" data-paused={wipe !== "hidden"} aria-hidden="true">{Array.from({ length: 36 }, (_, index) => <span key={index} style={{
          "--x": `${(index * 37 + 3) % 100}%`, "--drift": `${(index * 17 % 25) - 12}cqw`,
          "--spin": `${(index % 2 ? -1 : 1) * (360 + index * 31)}deg`,
          "--delay": `${index % 7 * 80}ms`, "--duration": `${2600 + index % 5 * 180}ms`,
          backgroundColor: ["#ffd77d", "#78dfca", "#e8ad59", "#df8b73", "#a8d8cc", "#b39bd5"][index % 6],
        } as CSSProperties} />)}</div>
        <div className="dialog-card demo-thanks">
        <span className="speaker">YOUR RAID IS JUST BEGINNING</span><h2>Thanks for playing the demo.</h2>
        <p>70 new levels are coming soon, with tons of new characters, tiles, and power-ups.</p>
        <p className="demo-story">The story continues…</p>
        <button className="primary" onClick={() => { persist(normalizeSave({ ...saveRef.current, demoEnding: "done" })); setOverlay("kingdom"); }}>Explore the kingdom <span>→</span></button>
        <button className="quiet" onClick={() => { persist(normalizeSave({ ...saveRef.current, demoEnding: "done" })); window.location.assign("?playtest=1"); }}>Playtest levels →</button>
      </div></div>}
      {overlay === "lost" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={COMPANIONS[level.chapter === "gatehouse" ? "gatewright" : level.chapter === "caravan" ? "wayfinder" : "keeper"].portrait} alt="" /><span className="speaker">{COMPANIONS[level.chapter === "gatehouse" ? "gatewright" : level.chapter === "caravan" ? "wayfinder" : "keeper"].name.toUpperCase()}</span></div><h2>{level.title} stalls</h2>
        <p>The trail still needs {goalsLeft}.</p>
        <button className="primary" onClick={retry}>Try again <span>↻</span></button>
        <button className="quiet" onClick={finish}>Back to the {level.chapter === "gatehouse" ? "gatehouse" : level.chapter === "caravan" ? "caravan" : "oasis"}</button>
      </div></div>}
      {overlay === "finale" && <div className="result-overlay"><div className="result-card">
        <span className="eyebrow">{level.victoryEyebrow}</span><h2>{level.victoryTitle}</h2>
        <p>{level.victoryMessage} {puzzle?.moves} spare moves fired as {puzzle?.grantedPower === "flywheels" ? "Flywheels" : "Pressure Jets"}.</p>
        <div className="coin-reveal"><img src={assetUrl("/sprites/coin.png")} alt="" />+{reward.current} coins</div>
        <button className="primary" onClick={finish}>{activeLevel === "openWaterway" ? "See the pump awaken" : activeLevel === "lightTheRoute" ? "See the walkers depart" : activeLevel === "openTheCrossing" ? "See the bridge open" : level.chapter === "gatehouse" ? "Return to the gatehouse" : level.chapter === "caravan" ? "Return to the caravan" : "Follow the water"} <span>→</span></button>
      </div></div>}
      {settings && <div className="scrim"><div className="dialog-card settings-card">
        <span className="speaker">SETTINGS</span>
        <button className="setting" onClick={toggleSound}>Sound <strong>{muted ? "Off" : "On"}</strong></button>
        <label className="volume-setting">Effects <span>{Math.round(sfxVolume * 100)}%</span><input type="range" min="0" max="100" value={Math.round(sfxVolume * 100)} onChange={event => setSfxVolume(Number(event.target.value) / 100)} /></label>
        <label className="volume-setting">Ambience <span>{Math.round(ambienceVolume * 100)}%</span><input type="range" min="0" max="100" value={Math.round(ambienceVolume * 100)} onChange={event => setAmbienceVolume(Number(event.target.value) / 100)} /></label>
        <button className="setting" onClick={() => setReducedMotion(value => !value)}>Reduced motion <strong>{reducedMotion ? "On" : "Off"}</strong></button>
        <button className="quiet" onClick={() => setSettings(false)}>Close</button>
        <button className="setting" onClick={downloadDiagnostics}>Export diagnostics (JSON)</button>
        {playtest ? <>
          <button className="setting" onClick={() => window.location.assign(window.location.pathname)}>Return to campaign</button>
          <button className="setting" onClick={() => downloadStats("json")}>Export level stats (JSON)</button>
          <button className="setting" onClick={() => downloadStats("csv")}>Export level stats (CSV)</button>
          {LEVEL_ORDER.map(id => <button className="setting" key={id} onClick={() => replayLevel(id)}>Replay {LEVELS[id].title}</button>)}
          <button className="setting" onClick={() => {
            abandonRecord("preview-transition"); activeRecord.current = null;
            setSettings(false);
            void transitionTo(() => {
              persist(normalizeSave({ ...saveRef.current, completed: LEVEL_ORDER.slice(0, 10) as LevelId[], oasisTransition: "film", region: "oasis", companions: [] }));
              setMode("map"); setOverlay("film"); setAttempt(value => value + 1);
            }, false);
          }}>Preview Oasis → desert transition</button>
          <button className="setting" onClick={() => { abandonRecord("preview-transition"); void transitionTo(() => { persist(normalizeSave({ ...saveRef.current, completed: LEVEL_ORDER.slice(0,20) as LevelId[], oasisTransition: "ready", gatehouseReady: false, transition: { from: "caravan", to: "gatehouse", stage: "film" }, region: "caravan", companions: ["keeper","wayfinder"] })); setMode("map"); setOverlay("film"); setSettings(false); setAttempt(value => value+1); }, false); }}>Preview desert → gatehouse transition</button>
          <button className="setting" onClick={reset}>Restart sequence</button>
        </> : <>{save.demoEnding === "done" && <button className="setting" onClick={() => window.location.assign("?playtest=1")}>Playtest levels</button>}<button className="reset" onClick={reset}>Reset prototype progress</button></>}
      </div></div>}
      {sceneIssue && <div className="scrim scene-error"><div className="dialog-card">
        <span className="speaker">SCENE INTERRUPTED</span>
        <p>{sceneIssue} Reloading returns to the path. {playtest ? "This test level restarts; recorded playtest attempts stay on this device." : "Unfinished levels restart; completed levels and coins are saved on this device."}</p>
        <button className="primary" onClick={() => window.location.reload()}>Reload game <span>↻</span></button>
        {sceneIssue.includes("purchase") && <button className="quiet" onClick={recoverShop}>Choose a free loadout</button>}
        <button className="quiet" onClick={downloadDiagnostics}>Export diagnostics (JSON)</button>
      </div></div>}
      {wipe !== "hidden" && <div className={`awning-wipe awning-${wipe}`} aria-hidden="true"><div className="awning-panel awning-left" /><div className="awning-panel awning-right" /></div>}
      <div className="rotate"><div className="rotate-icon">▭</div><strong>Rotate your device</strong><p>Dune Relay plays in landscape.</p></div>
    </div>
  </main>;
}
