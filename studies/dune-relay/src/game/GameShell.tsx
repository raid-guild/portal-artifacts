"use client";

import { assetUrl } from "./assetUrl";
import { isPlaytestMode } from "./playtestMode";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { coinReward, createPuzzle, type Puzzle } from "./core";
import type { GameEvent } from "./GameCanvas";
import { GameAudio } from "./audio";
import { getUnlockedSoundtracks, normalizeAudioPreferences, SOUNDTRACKS, type TrackPreference } from "./soundtracks";
import { LEVELS, LEVEL_ORDER, type LevelId, nextLevel } from "./levels";
import { advanceChapterTransition, advanceTransition, completeLevel, EMPTY_SAVE, normalizeSave, readSave, type Region, type Save, writeSave } from "./save";
import { addAttempt, appendTurn, archiveCsv, archiveJson, campaignArchiveKey, emptyArchive, finishAttempt, PLAYTEST_KEY, readArchive, readPlaytestWallet, startAttempt, writeArchive, writePlaytestWallet, type AttemptRecord, type PlaytestArchive } from "./playtest";
import { COMPANIONS } from "./chapters";
import { selectCompanionLine, type CompanionLine } from "./companionDialogue";
import { waitForGameIdle } from "./gameLifecycle";
import { diagnosticsJson, logDiagnostic } from "./diagnostics";
import { prepareStartingBoosters, boosterCost, BOOSTERS, type BoosterKind, type BoosterPlacement } from "./boosters";
import * as cloudApi from "./cloud";
import { TUTORIALS, TUTORIAL_BY_LEVEL, tutorialAvailable, type Tutorial } from "./tutorials";
import { markSeen, readSeen, tutorialScopeKey, type TutorialScope } from "./tutorialProgress";
import { TutorialDialog } from "./TutorialDialog";

const GameCanvas = dynamic(() => import("./GameCanvas"), { ssr: false });
type Overlay = "start" | "keeper" | "briefing" | "shop" | "finale" | "lost" | "film" | "handoff" | "atlas" | "kingdom" | "farmland" | "party" | "wayfinder" | "gatewright" | "fieldkeeper" | "companionChat" | "harvestOpen" | "routeLit" | "crossingOpen" | "demoThanks" | "cloudChoice" | null;
type PendingAttempt = { token: number; cloudAttemptId: string; sceneAttempt: number; level: LevelId; selected: BoosterKind[]; cost: number; puzzle: Puzzle; placements: BoosterPlacement[]; status: "prepared" | "committed" | "failed" };
type FullscreenAttempt = { token: number; started: number; timer: ReturnType<typeof setTimeout> };

export default function GameShell() {
  const [playtest, setPlaytest] = useState(false);
  const [ready, setReady] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"checking" | "guest" | "account" | "syncing" | "pending" | "expired">("checking");
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const [portalName, setPortalName] = useState<string | null>(null);
  const [farmland, setFarmland] = useState<cloudApi.FarmlandEntitlement | null>(null);
  const [farmlandState, setFarmlandState] = useState<"idle" | "loading" | "claiming" | "error">("idle");
  const [farmlandError, setFarmlandError] = useState<string | null>(null);
  const [farmlandPreview, setFarmlandPreview] = useState(false);
  const [save, setSave] = useState<Save>({ ...EMPTY_SAVE, completed: [], companions: [] });
  const [mode, setMode] = useState<"map" | "puzzle">("map");
  const [overlay, setOverlay] = useState<Overlay>("start");
  const [keeperMet, setKeeperMet] = useState(false);
  const [companionLine, setCompanionLine] = useState<CompanionLine | null>(null);
  const companionVisits = useRef<Record<Region, number>>({ oasis: 0, caravan: 0, gatehouse: 0, farmland: 0 });
  const lastCompanionLine = useRef<Record<Region, string | undefined>>({ oasis: undefined, caravan: undefined, gatehouse: undefined, farmland: undefined });
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
  const [musicVolume, setMusicVolume] = useState(0.25);
  const [trackPreference, setTrackPreference] = useState<TrackPreference>("auto");
  const [playtestTrack, setPlaytestTrack] = useState<TrackPreference>("auto");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [settings, setSettings] = useState(false);
  const [tutorialLibrary, setTutorialLibrary] = useState(false);
  const [tutorialSession, setTutorialSession] = useState<{ tutorial: Tutorial; mode: "intro" | "replay"; scopeKey: string; cloudGeneration: number; level: LevelId; selected: BoosterKind[] } | null>(null);
  const tutorialContinuing = useRef(false);
  const tutorialReturnFocus = useRef<string | null>(null);
  const tutorialBoardFocus = useRef(false);
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
  const mapPositions = useRef<Record<Region, { x: number; y: number } | null>>({ oasis: null, caravan: null, gatehouse: null, farmland: null });
  const saveRef = useRef<Save>({ ...EMPTY_SAVE, completed: [], companions: [] });
  const cloudRef = useRef<{ accountId: string; profile: cloudApi.CloudProfile; pending: cloudApi.CloudOperation[]; syncing: boolean } | null>(null);
  const cloudGeneration = useRef(0);
  const farmlandGeneration = useRef(0);
  const farmlandClaimId = useRef<string | null>(null);
  const farmlandClaiming = useRef(false);
  const cloudConflict = useRef(false);
  const sound = useRef<GameAudio | null>(null);
  const film = useRef<HTMLVideoElement | null>(null);
  const archive = useRef<PlaytestArchive>(emptyArchive());
  const archiveKey = useRef<string | null>(null);
  const activeRecord = useRef<AttemptRecord | null>(null);
  const activeSince = useRef<number | null>(null);
  const pendingAttempt = useRef<PendingAttempt | null>(null);
  const tokenCounter = useRef(0);
  const launching = useRef(false);
  const authorizing = useRef(false);
  const gateOpenedPending = useRef(false);
  const filmKind = save.farmlandEnding === "film" ? "farmland" : save.demoEnding === "film" ? "gatehouse" : save.transition?.from === "caravan" ? "caravan" : "oasis";
  const filmContent = {
    farmland: { source: "/cinematics/farmland-harvest.mp4", poster: "/cinematics/farmland-harvest-poster.webp", caption: "The seed stores open. The harvest convoy can move again.", label: "The farmland harvest route opens" },
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
    const testing = isPlaytestMode(window.location.search);
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
    if (testing) { loadStatsArchive(PLAYTEST_KEY); const wallet = readPlaytestWallet(); const loaded = normalizeSave({ ...saveRef.current, coins: wallet.coins }); saveRef.current = loaded; setSave(loaded); }
    if (!testing) { const loaded = readSave(); saveRef.current = loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse")); }
    setReady(true);
    void initializeCloud(testing);
    const mixer = new GameAudio();
    sound.current = mixer;
    try {
      const audio = normalizeAudioPreferences(JSON.parse(localStorage.getItem("dune-relay-audio-v1") ?? "null"));
      setMuted(audio.muted); setSfxVolume(audio.sfx); setAmbienceVolume(audio.ambience);
      setMusicVolume(audio.music); setTrackPreference(audio.track);
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
      cloudGeneration.current++;
      farmlandGeneration.current++;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    sound.current?.setLevels(muted, sfxVolume, ambienceVolume, musicVolume);
    try { localStorage.setItem("dune-relay-audio-v1", JSON.stringify({ muted, sfx: sfxVolume, ambience: ambienceVolume, music: musicVolume, track: trackPreference })); }
    catch { /* Private browsing can block storage. */ }
  }, [ready, muted, sfxVolume, ambienceVolume, musicVolume, trackPreference]);
  useEffect(() => {
    const retry = () => { if (cloudRef.current?.pending.length) void flushCloud(); };
    window.addEventListener("online", retry);
    window.addEventListener("focus", retry);
    return () => { window.removeEventListener("online", retry); window.removeEventListener("focus", retry); };
  }, []);

  const unlockedTracks = getUnlockedSoundtracks(save);
  const selectedTrack = playtest ? playtestTrack : trackPreference;
  const effectiveTrack = selectedTrack === "auto" || unlockedTracks.includes(selectedTrack) ? selectedTrack : "auto";
  useEffect(() => {
    if (ready) sound.current?.setScene(save.region, effectiveTrack, overlay === "film");
  }, [ready, save.region, effectiveTrack, overlay]);

  useEffect(() => {
    if (settings || tutorialLibrary || tutorialSession || overlay !== null || wipe !== "hidden" || mode !== "puzzle" || document.hidden || sceneIssue) recordPause(); else recordResume();
    const visibility = () => { if (document.hidden) recordPause(); else if (!settings && !tutorialLibrary && !tutorialSession && overlay === null && wipe === "hidden" && mode === "puzzle" && !sceneIssue) recordResume(); };
    const pagehide = () => recordPause();
    const pageshow = () => { if (!document.hidden && !settings && !tutorialLibrary && !tutorialSession && overlay === null && wipe === "hidden" && mode === "puzzle" && !sceneIssue) recordResume(); };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", pagehide);
    window.addEventListener("pageshow", pageshow);
    return () => { document.removeEventListener("visibilitychange", visibility); window.removeEventListener("pagehide", pagehide); window.removeEventListener("pageshow", pageshow); };
  }, [settings, tutorialLibrary, tutorialSession, overlay, wipe, mode, sceneIssue]);

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
  function loadStatsArchive(key: string) { archiveKey.current = key; archive.current = readArchive(undefined, key); writeArchive(archive.current, undefined, key); activeRecord.current = null; activeSince.current = null; }
  function switchStatsArchive(key: string) { if (archiveKey.current === key) return; abandonRecord("account-changed"); loadStatsArchive(key); }
  function storeRecord() { if (!archiveKey.current || !activeRecord.current) return; archive.current = addAttempt(archive.current, activeRecord.current); writeArchive(archive.current, undefined, archiveKey.current); }
  function abandonRecord(reason: string) { if (!activeRecord.current || activeRecord.current.outcome !== "playing") return; recordPause(); activeRecord.current = finishAttempt(activeRecord.current, "abandoned", reason); storeRecord(); activeRecord.current = null; }
  function downloadStats(format: "json" | "csv") { if (!archiveKey.current || cloudStatus === "checking" || cloudStatus === "expired" && !playtest) return; recordPause(); const body = format === "json" ? archiveJson(archive.current) : archiveCsv(archive.current); const blob = new Blob([body], { type: format === "json" ? "application/json" : "text/csv" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `dune-relay-${playtest ? "playtest" : "campaign"}-${new Date().toISOString().slice(0,10)}.${format}`; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); if (!settings) recordResume(); }
  function downloadDiagnostics() { const blob = new Blob([diagnosticsJson()], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `dune-relay-diagnostics-${new Date().toISOString().slice(0,10)}.json`; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function downloadCloudBackup() {
    const current=cloudRef.current; if (!current) return;
    const body=JSON.stringify({accountId:current.accountId,profile:current.profile,localSave:saveRef.current,pending:current.pending,exportedAt:new Date().toISOString()},null,2);
    const url=URL.createObjectURL(new Blob([body],{type:"application/json"})); const link=document.createElement("a");
    link.href=url; link.download=`dune-relay-cloud-backup-${new Date().toISOString().slice(0,10)}.json`; link.click(); window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function usePortalSave() {
    const current=cloudRef.current; if (!current) return;
    try {
      const result=await cloudApi.campaign(current.accountId); if (cloudRef.current!==current || result.accountId!==current.accountId || !result.profile) return;
      current.profile=result.profile; current.pending=[]; cloudConflict.current=false;
      const loaded=normalizeSave(result.profile.campaign); saveRef.current=loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse")); cacheCloud(); setCloudStatus("account"); setCloudMessage(null);
      setMode("map"); setPuzzle(null); setOverlay("start"); setSettings(false); setAttempt(value=>value+1);
      void refreshFarmland(current);
    } catch (error) { setCloudMessage(`Portal save could not load: ${(error as Error).message}`); }
  }
  function clearFarmland() { farmlandGeneration.current++; farmlandClaimId.current=null; farmlandClaiming.current=false; setFarmland(null); setFarmlandState("idle"); setFarmlandError(null); }
  async function refreshFarmland(current = cloudRef.current) {
    if (!current || playtest || farmlandClaiming.current) return;
    const generation=++farmlandGeneration.current;
    setFarmlandState("loading"); setFarmlandError(null);
    try {
      const result=await cloudApi.entitlements(current.accountId);
      if (cloudRef.current!==current || farmlandGeneration.current!==generation) return;
      setFarmland(result); setFarmlandState("idle");
      if (result.farmland.unlocked) farmlandClaimId.current=null;
    } catch (error) {
      if (cloudRef.current!==current || farmlandGeneration.current!==generation) return;
      setFarmland(null); setFarmlandState("error"); setFarmlandError((error as Error).message);
    }
  }
  async function unlockFarmland() {
    const current=cloudRef.current;
    if (playtest || !current || farmlandClaiming.current || farmland?.accountId!==current.accountId || !farmland.farmland.eligible || farmland.farmland.unlocked || current.syncing || current.pending.length || cloudConflict.current || cloudStatus!=="account" || !["idle","error"].includes(farmlandState)) return;
    const generation=++farmlandGeneration.current;
    const requestId=farmlandClaimId.current??cloudApi.newOperationId(); farmlandClaimId.current=requestId; farmlandClaiming.current=true;
    setFarmlandState("claiming"); setFarmlandError(null);
    try {
      const result=await cloudApi.claimFarmland(requestId,current.accountId);
      if (cloudRef.current!==current || farmlandGeneration.current!==generation) return;
      setFarmland(result); setFarmlandState("idle"); farmlandClaimId.current=null;
    } catch (error) {
      if (cloudRef.current!==current || farmlandGeneration.current!==generation) return;
      setFarmlandState("error"); setFarmlandError((error as Error).message);
    } finally { if (farmlandGeneration.current===generation) farmlandClaiming.current=false; }
  }
  function acknowledgeDemo() {
    if (saveRef.current.demoEnding==="thanks") persist(normalizeSave({ ...saveRef.current, demoEnding:"done" }));
  }
  function persist(next: Save) {
    if (next === saveRef.current) return;
    const before = saveRef.current;
    saveRef.current = next; setSave(next);
    if (playtest) writePlaytestWallet({ version: 1, coins: next.coins });
    else if (cloudRef.current) {
      cacheCloud();
      if (before.completed.length === next.completed.length && before.coins === next.coins) {
        cloudRef.current.pending.push({ kind: "checkpoint", requestId: cloudApi.newOperationId(), campaign: next });
        cacheCloud(); void flushCloud();
      }
    } else writeSave(next);
  }
  function cacheCloud() {
    const current = cloudRef.current;
    const purchase=pendingAttempt.current?.cost && saveRef.current.completed.indexOf(pendingAttempt.current.level) === -1
      ? {attemptId:pendingAttempt.current.cloudAttemptId,levelId:pendingAttempt.current.level,boosters:pendingAttempt.current.selected} : undefined;
    if (current && !cloudApi.writeAccountCache(current.accountId, { profile: current.profile, localSave: saveRef.current, pending: current.pending, purchase })) setCloudMessage("This browser could not store the pending save. Keep this tab open until it syncs.");
  }
  async function initializeCloud(testing: boolean) {
    if (testing) { setCloudStatus("guest"); return; }
    const generation = ++cloudGeneration.current;
    const remembered = cloudApi.rememberedAccount();
    const provisional = remembered ? cloudApi.readAccountCache(remembered) : null;
    if (remembered) {
      setPortalName("Portal player");
      setCloudStatus("checking");
      if (provisional) { const loaded=normalizeSave(provisional.localSave); saveRef.current=loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse")); }
    }
    try {
      const session = await cloudApi.session();
      const result = await cloudApi.campaign(session.accountId);
      if (result.accountId !== session.accountId) throw new Error("Portal account changed during load.");
      if (generation !== cloudGeneration.current) return;
      switchStatsArchive(campaignArchiveKey(session.accountId));
      cloudApi.rememberAccount(session.accountId);
      const cached = cloudApi.readAccountCache(session.accountId);
      const profile = result.profile ?? { revision: 0, imported: false, campaign: { ...EMPTY_SAVE, completed: [], companions: [] } };
      cloudRef.current = { accountId: session.accountId, profile, pending: cached?.pending ?? [], syncing: false };
      setFarmland(null); void refreshFarmland(cloudRef.current);
      if (cached?.purchase && LEVELS[cached.purchase.levelId] && Array.isArray(cached.purchase.boosters)) {
        try {
          const prepared=prepareStartingBoosters(createPuzzle(LEVELS[cached.purchase.levelId]),cached.purchase.boosters);
          pendingAttempt.current={token:0,cloudAttemptId:cached.purchase.attemptId,sceneAttempt:-1,level:cached.purchase.levelId,selected:cached.purchase.boosters,cost:boosterCost(cached.purchase.boosters),puzzle:prepared.puzzle,placements:prepared.placements,status:"failed"};
          setCloudMessage("An earlier booster purchase needs confirmation. Retry the same loadout when you enter that level.");
        } catch { /* A stale loadout remains in the account cache backup. */ }
      }
      setPortalName(session.displayName);
      if ((!result.hasCampaign || profile.revision === 0) && readSave().completed.length && !cached?.pending.length) { setOverlay("cloudChoice"); setCloudStatus("account"); return; }
      const loaded = cached?.pending.length ? normalizeSave(cached.localSave) : normalizeSave(profile.campaign);
      saveRef.current = loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse"));
      setCloudStatus(cached?.pending.length ? "pending" : "account");
      if (cached?.pending.length) void flushCloud();
    } catch (error) {
      if (generation !== cloudGeneration.current) return;
      if (remembered) {
        setCloudStatus("expired");
        setCloudMessage((error as {status?:number}).status === 401 ? "Portal sign-in expired. Sign in again to continue this campaign." : "Portal save could not be checked. Reconnect or sign in again; account progress is held on this device.");
      } else {
        switchStatsArchive(campaignArchiveKey());
        setCloudStatus("guest");
        if ((error as {status?:number}).status !== 401 && (error as {status?:number}).status !== 503) setCloudMessage("Cloud saves could not be checked. Playing with this device's guest save.");
        if (new URLSearchParams(window.location.search).get("login") === "failed") setCloudMessage("Portal sign-in did not finish. Guest progress is still here.");
      }
    }
  }
  async function flushCloud() {
    const current = cloudRef.current;
    if (!current || current.syncing || cloudConflict.current || playtest || !current.pending.length) return;
    current.syncing = true; setCloudStatus("syncing");
    try {
      while (current.pending.length && cloudRef.current === current) {
        const op = current.pending[0];
        const response = op.kind === "finish" ? await cloudApi.finishAttempt(op,current.accountId) : await cloudApi.advanceCheckpoint(op, current.profile.revision,current.accountId);
        current.profile = response.profile;
        current.pending.shift();
        cacheCloud();
      }
      if (cloudRef.current === current) {
        saveRef.current = normalizeSave(current.profile.campaign); setSave(saveRef.current);
        cacheCloud(); setCloudStatus("account"); setCloudMessage(null);
        void refreshFarmland(current);
      }
    } catch (error) {
      if (cloudRef.current === current) {
        const status=(error as {status?:number}).status;
        if (status === 400 || status === 409) cloudConflict.current=true;
        setCloudStatus(status === 401 ? "expired" : "pending");
        setCloudMessage(status === 400 || status === 409 ? "This save needs attention. Download a backup in Settings before loading the Portal campaign." : "Saved on this device, waiting to sync.");
      }
    } finally { current.syncing = false; }
  }
  async function importGuestProgress() {
    const current = cloudRef.current; if (!current) return;
    setCloudStatus("syncing");
    try {
      const response = await cloudApi.importGuest(readSave(), cloudApi.guestImportId(current.accountId),current.accountId);
      if (cloudRef.current !== current) return;
      cloudApi.clearGuestImportId(current.accountId);
      current.profile=response.profile; const loaded=normalizeSave(response.profile.campaign); saveRef.current=loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse")); setCloudStatus("account"); setOverlay("start"); cacheCloud(); setCloudMessage(null);
      void refreshFarmland(current);
    } catch (error) { setCloudStatus("account"); setCloudMessage((error as Error).message); }
  }
  function startFreshPortalCampaign() {
    const current=cloudRef.current; if (!current) return;
    const fresh={...EMPTY_SAVE,completed:[],companions:[]};
    saveRef.current=fresh; setSave(fresh); setKeeperMet(false);
    current.pending.push({kind:"checkpoint",requestId:cloudApi.newOperationId(),campaign:fresh});
    cacheCloud(); void flushCloud(); setOverlay("start");
  }
  async function signOut() {
    if (cloudRef.current?.pending.length) { setCloudMessage("Wait for your campaign to sync before signing out."); return; }
    try { await cloudApi.logout(cloudRef.current?.accountId ?? cloudApi.rememberedAccount() ?? ""); } catch { setCloudMessage("Could not sign out. Try again when connected."); return; }
    switchStatsArchive(campaignArchiveKey());
    cloudGeneration.current++; cloudRef.current=null; cloudConflict.current=false; clearFarmland(); cloudApi.rememberAccount(null); setPortalName(null); setCloudStatus("guest"); setCloudMessage(null);
    const guest=readSave(); saveRef.current=guest; setSave(guest); setMode("map"); setPuzzle(null); setOverlay("start"); setSettings(false); setAttempt(value=>value+1);
  }
  function continueAsGuest() {
    switchStatsArchive(campaignArchiveKey());
    cloudGeneration.current++; cloudRef.current=null; cloudConflict.current=false; clearFarmland(); cloudApi.rememberAccount(null); setPortalName(null); setCloudStatus("guest"); setCloudMessage(null);
    const guest=readSave(); saveRef.current=guest; setSave(guest); setKeeperMet(guest.completed.includes("pumpHouse")); setMode("map"); setPuzzle(null); setOverlay("start"); setSettings(false); setAttempt(value=>value+1);
  }
  function commitWin(levelId: LevelId, movesRemaining: number) {
    if (saveRef.current.completed.includes(levelId)) return;
    reward.current=coinReward(movesRemaining);
    persist(completeLevel(saveRef.current,levelId,reward.current));
    const current=cloudRef.current;
    if (current && !playtest) {
      const attemptId=pendingAttempt.current?.cloudAttemptId ?? cloudApi.newOperationId();
      current.pending.push({kind:"finish",attemptId,levelId,remainingMoves:movesRemaining,contentVersion:cloudApi.contentVersion});
      cacheCloud(); void flushCloud();
    }
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
        let remaining = pendingAttempt.current?.cost && cloudRef.current ? 30_000 : 10_000;
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
          if (!document.hidden && !authorizing.current) remaining -= now - last;
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
    return value.farmlandEnding === "film" ? "film"
      : value.farmlandEnding === "thanks" ? "harvestOpen"
      : value.demoEnding === "film" ? "film"
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
  useEffect(() => {
    if (tutorialSession && (tutorialSession.scopeKey !== tutorialScopeKey(currentTutorialScope()) || tutorialSession.cloudGeneration !== cloudGeneration.current)) {
      setTutorialSession(null); setTutorialLibrary(false);
    }
  }, [tutorialSession, cloudStatus, portalName, playtest]);
  function startLevel(id: LevelId) {
    setTutorialSession(null); setTutorialLibrary(false);
    tokenCounter.current++;
    if (pendingAttempt.current?.level !== id || pendingAttempt.current.cost === 0) pendingAttempt.current = null;
    setShopLevel(id); setShopSelected(pendingAttempt.current?.status === "failed" && pendingAttempt.current.level === id ? pendingAttempt.current.selected : []); setShopError(null);
    setShopReturn(overlay);
    setOverlay("shop");
  }
  function currentTutorialScope(): TutorialScope {
    return playtest ? { kind: "sandbox" } : cloudRef.current ? { kind: "account", accountId: cloudRef.current.accountId } : { kind: "guest" };
  }
  useEffect(() => {
    if (!tutorialLibrary || tutorialSession) return;
    const frame=requestAnimationFrame(()=>{
      const id=tutorialReturnFocus.current;
      const item=id ? document.querySelector<HTMLButtonElement>(`.tutorial-library [data-tutorial-item="${id}"]`) : null;
      (item ?? document.querySelector<HTMLButtonElement>(".tutorial-library-list button, .tutorial-library > button"))?.focus();
      tutorialReturnFocus.current=null;
    });
    return ()=>cancelAnimationFrame(frame);
  },[tutorialLibrary,tutorialSession]);
  useEffect(() => {
    if (!tutorialBoardFocus.current || tutorialSession || mode !== "puzzle" || overlay !== null || wipe !== "hidden") return;
    const frame=requestAnimationFrame(()=>{
      const target=document.querySelector<HTMLButtonElement>('.top-actions button[aria-label="Settings"]');
      if (target?.isConnected && !target.closest("[inert]")) target.focus();
      tutorialBoardFocus.current=false;
    });
    return ()=>cancelAnimationFrame(frame);
  },[tutorialSession,mode,overlay,wipe]);
  function dismissTutorial(start: boolean) {
    const current=tutorialSession;
    if (!current || tutorialContinuing.current) return;
    tutorialContinuing.current=true;
    if (current.mode === "intro") {
      const valid=overlay === "shop" && shopLevel === current.level && current.scopeKey === tutorialScopeKey(currentTutorialScope()) && current.cloudGeneration === cloudGeneration.current;
      setTutorialSession(null);
      if (valid) {
        markSeen(currentTutorialScope(),current.tutorial.id);
        if (start && !launching.current) { tutorialBoardFocus.current=true; launching.current=true; void launchLevelOnce(current.selected).finally(()=>{launching.current=false;}); }
      }
    } else { tutorialReturnFocus.current=current.tutorial.id; setTutorialSession(null); setTutorialLibrary(true); }
    window.setTimeout(()=>{tutorialContinuing.current=false;},0);
  }
  function openTutorialReplay(tutorial: Tutorial) {
    const scope=currentTutorialScope();
    setTutorialLibrary(false); setSettings(false);
    setTutorialSession({tutorial,mode:"replay",scopeKey:tutorialScopeKey(scope),cloudGeneration:cloudGeneration.current,level:tutorial.level,selected:[]});
  }
  async function launchLevel(selected: BoosterKind[] = shopSelected) {
    if (tutorialSession || transitioning.current || launching.current) return;
    const cost=boosterCost(selected);
    const unresolved=pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0 ? pendingAttempt.current : null;
    if (unresolved && (unresolved.level !== shopLevel || JSON.stringify([...unresolved.selected].sort()) !== JSON.stringify([...selected].sort()))) {
      setShopError("Retry the same purchase first so its coin charge can be confirmed."); return;
    }
    if (cost > saveRef.current.coins && !unresolved) { setShopError("Not enough coins for this loadout."); return; }
    const intro=TUTORIAL_BY_LEVEL[shopLevel];
    if (intro && !saveRef.current.completed.includes(shopLevel) && !readSeen(currentTutorialScope()).has(intro.id)) {
      const scope=currentTutorialScope();
      setTutorialSession({tutorial:intro,mode:"intro",scopeKey:tutorialScopeKey(scope),cloudGeneration:cloudGeneration.current,level:shopLevel,selected:[...selected]});
      return;
    }
    launching.current=true;
    try { await launchLevelOnce(selected); } finally { launching.current=false; }
  }
  async function launchLevelOnce(selected: readonly BoosterKind[]) {
    const id = shopLevel;
    if (LEVELS[id].chapter === "farmland" && !playtest && !(farmland?.farmland.unlocked && farmland.accountId === cloudRef.current?.accountId)) { setShopError("Sign in and unlock Farmland first."); return; }
    const cost = boosterCost(selected);
    if (cost > saveRef.current.coins && !pendingAttempt.current?.cost) { setShopError("Not enough coins for this loadout."); return; }
    let prepared: ReturnType<typeof prepareStartingBoosters>;
    try { prepared = prepareStartingBoosters(createPuzzle(LEVELS[id]), selected); }
    catch (error) { setShopError(String(error)); return; }
    const token = ++tokenCounter.current;
    const unresolved = pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0 ? pendingAttempt.current : null;
    if (unresolved && (unresolved.level !== id || JSON.stringify([...unresolved.selected].sort()) !== JSON.stringify([...selected].sort()))) {
      setShopError("Retry the same purchase first so its coin charge can be confirmed."); return;
    }
    const cloudAttemptId = unresolved?.cloudAttemptId ?? cloudApi.newOperationId();
    if (cloudRef.current && !playtest) {
      if (cloudRef.current.pending.length) { setShopError("Your last move is still syncing. Reconnect before starting a new level."); return; }
      if (cost > 0 || LEVELS[id].chapter === "farmland") {
        try { await cloudApi.prepareAttempt(cloudAttemptId,id,[...selected],cloudRef.current.accountId); }
        catch (error) { setShopError(`Could not prepare this level: ${(error as Error).message}`); return; }
        if (token !== tokenCounter.current) return;
      }
    }
    pendingAttempt.current = { token, cloudAttemptId, sceneAttempt: attempt + 1, level: id, selected: [...selected], cost, puzzle: prepared.puzzle, placements: prepared.placements, status: "prepared" };
    if (cost && cloudRef.current) cacheCloud();
    setRevealing(false);
    abandonRecord("started-another-level");
    activeRecord.current = null;
    void transitionTo(() => {
      setActiveLevel(id); setPuzzle(prepared.puzzle); setMode("puzzle");
      setAttempt(value => value + 1); setOverlay(null);
    });
  }
  function cancelShop() {
    tokenCounter.current++;
    if (!pendingAttempt.current?.cost) pendingAttempt.current = null; setShopError(null);
    if (shopReturn === null && mode === "map") void transitionTo(() => { setOverlay(null); setAttempt(value => value + 1); });
    else setOverlay(shopReturn);
  }
  function toggleBooster(kind: BoosterKind) {
    setShopSelected(current => {
      if (pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0) return current;
      if (current.includes(kind)) return current.filter(selected => selected !== kind);
      const proposed=[...current,kind];
      if (boosterCost(proposed) > saveRef.current.coins) return current;
      return proposed;
    });
    setShopError(null);
  }
  function closeBriefing() {
    setOverlay(null);
    setAttempt(value => value + 1);
  }
  function recoverShop() {
    const unresolved=pendingAttempt.current;
    setShopReturn(null);
    if (unresolved?.cost) { setShopLevel(unresolved.level); setShopSelected(unresolved.selected); setShopError("Retry this purchase to confirm its coin charge. It will not charge twice."); }
    else { pendingAttempt.current=null; setShopSelected([]); setShopError("The purchase could not be saved. Choose no boosters to play for free, or try again after storage is available."); }
    void transitionTo(() => { setMode("map"); setPuzzle(null); setOverlay("shop"); setAttempt(value => value + 1); });
  }
  async function authorizeSceneReady(): Promise<boolean> {
    const current = pendingAttempt.current;
    if (mode !== "puzzle") return true;
    if (!current || current.sceneAttempt !== attempt || current.level !== activeLevel || current.status === "failed") return false;
    if (current.status === "committed") return true;
    if ((!cloudRef.current || playtest) && current.cost > saveRef.current.coins) { current.status = "failed"; setSceneIssue("Not enough coins for this loadout."); return false; }
    if (cloudRef.current && !playtest && (current.cost > 0 || LEVELS[current.level].chapter === "farmland")) {
      const account = cloudRef.current;
      authorizing.current=true;
      try {
        const response = await cloudApi.activateAttempt(current.cloudAttemptId,account.profile.revision,account.accountId);
        if (cloudRef.current !== account) return false;
        account.profile=response.profile;
        const next={...saveRef.current,coins:response.profile.campaign.coins};
        saveRef.current=next; setSave(next); cacheCloud();
        if (pendingAttempt.current !== current || current.status !== "prepared" || response.status !== "active") return false;
      } catch (error) {
        current.status="failed";
        setSceneIssue(`The level could not be confirmed: ${(error as Error).message}`);
        return false;
      } finally {
        authorizing.current=false;
      }
      current.status="committed";
      return true;
    }
    if (LEVELS[current.level].chapter === "farmland" && !playtest && !cloudRef.current) { current.status = "failed"; setSceneIssue("Sign in to play Farmland."); return false; }
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
    if (event.type === "playReady") { if (archiveKey.current && !activeRecord.current) { activeRecord.current = startAttempt(LEVELS[activeLevel], puzzle ?? createPuzzle(LEVELS[activeLevel]), new Date(), pendingAttempt.current?.selected ?? [], pendingAttempt.current?.cost ?? 0, playtest ? "sandbox" : "campaign"); storeRecord(); if (!settings && !tutorialLibrary && !tutorialSession && overlay === null && wipe === "hidden") recordResume(); } return; }
    if (event.type === "gateOpened") { if (saveRef.current.demoEnding === "gate") { if (transitioning.current) gateOpenedPending.current = true; else beginDemoFilm(); } return; }
    if (event.type === "resolvedTurn") {
      // Commit a terminal reward when the rule engine accepts the move. If the
      // renderer is interrupted during its animation, a reload keeps the win.
      if (event.turn.state.status === "won") commitWin(activeLevel,event.turn.state.moves);
      if (activeRecord.current) { recordPause(); activeRecord.current = appendTurn(activeRecord.current, event.turn, event.from, event.to); if (event.turn.state.status !== "playing") { activeRecord.current = finishAttempt(activeRecord.current, event.turn.state.status, "goals-or-moves"); } storeRecord(); }
      return;
    }
    if (event.type === "keeper" || event.type === "fieldkeeper" || event.type === "gatewright" || event.type === "wayfinder") {
      const region: Region = event.type === "keeper" ? "oasis" : event.type === "wayfinder" ? "caravan" : event.type === "gatewright" ? "gatehouse" : "farmland";
      const introduced = region === "oasis" ? keeperMet : region === "caravan" ? saveRef.current.oasisTransition === "ready" : region === "gatehouse" ? saveRef.current.gatehouseReady : saveRef.current.farmlandReady;
      if (introduced) {
        const pending = nextLevel(saveRef.current.completed);
        const regionalPending = pending && (LEVELS[pending].chapter ?? "oasis") === region ? pending : null;
        const line = selectCompanionLine(region, regionalPending, companionVisits.current[region]++, lastCompanionLine.current[region]);
        lastCompanionLine.current[region] = line.id;
        setCompanionLine(line);
        setOverlay("companionChat");
      } else setOverlay(event.type);
      sound.current?.play("ui"); return;
    }
    if (event.type === "pump") {
      const next = nextLevel(saveRef.current.completed);
      if (saveRef.current.region === "farmland") {
        if (next === "seedStore" && !saveRef.current.farmlandReady) setOverlay("fieldkeeper");
        else if (next && LEVELS[next].chapter === "farmland") { setOverlay("briefing"); sound.current?.play("ui"); }
        return;
      }
      if (saveRef.current.region === "gatehouse") {
        if (next === "gatehouseApproach" && !saveRef.current.gatehouseReady) setOverlay("gatewright");
        else if (next && LEVELS[next].chapter === "gatehouse") { setOverlay("briefing"); sound.current?.play("ui"); }
        return;
      }
      if (saveRef.current.region === "caravan") {
        if (next === "caravanPennants" && saveRef.current.oasisTransition !== "ready") setOverlay("wayfinder");
        else if (next && LEVELS[next].chapter === "caravan") { setOverlay("briefing"); sound.current?.play("ui"); }
        return;
      }
      if (next === "pumpHouse" && !keeperMet) return;
      if (next !== "pumpHouse" && next && LEVELS[next].chapter !== "caravan") { setOverlay("briefing"); sound.current?.play("ui"); return; }
      if (next === "pumpHouse") startLevel(next);
      return;
    }
    if (event.type === "turn") { setPuzzle(event.puzzle); if (activeRecord.current?.outcome === "playing" && !settings && !sceneIssue) recordResume(); return; }
    if (event.type === "lose") { setOverlay("lost"); sound.current?.play("lose"); return; }
    if (event.type === "revealStarted") { setRevealing(true); return; }
    if (event.type === "victory") {
      commitWin(activeLevel,event.puzzle.moves);
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
  function closeCompanionChat() {
    setCompanionLine(null);
    setOverlay(null);
    setAttempt(value => value + 1);
  }
  function beginDemoFilm() {
    if (saveRef.current.demoEnding !== "gate") return;
    persist(normalizeSave({ ...saveRef.current, demoEnding: "film" }));
    setOverlay("film");
  }
  function finishFilm() {
    if (saveRef.current.farmlandEnding === "film") { persist(normalizeSave({ ...saveRef.current, farmlandEnding: "thanks" })); setOverlay("harvestOpen"); return; }
    if (saveRef.current.farmlandEnding === "thanks") return;
    if (saveRef.current.demoEnding === "film") { persist(normalizeSave({ ...saveRef.current, demoEnding: "thanks" })); setOverlay("demoThanks"); return; }
    if (saveRef.current.transition?.from === "caravan" && saveRef.current.transition.stage === "film") { persist(advanceChapterTransition(saveRef.current, "film", "handoff")); setOverlay("handoff"); return; }
    if (saveRef.current.oasisTransition !== "film") { setOverlay(null); return; }
    checkpoint("film", "keeper");
    setOverlay("handoff");
  }
  function acceptHandoff() {
    if (saveRef.current.transition?.from === "gatehouse") { persist(advanceChapterTransition(saveRef.current, "handoff", "atlas")); setOverlay("atlas"); return; }
    if (saveRef.current.transition?.from === "caravan") { persist(advanceChapterTransition(saveRef.current, "handoff", "atlas")); setOverlay("atlas"); return; }
    checkpoint("keeper", "atlas");
    setOverlay("atlas");
  }
  function travelToCaravan() {
    if (saveRef.current.transition?.from === "gatehouse") { persist(advanceChapterTransition(saveRef.current, "atlas", "arrival")); void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); }); return; }
    if (saveRef.current.transition?.from === "caravan") { persist(advanceChapterTransition(saveRef.current, "atlas", "arrival")); void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); }); return; }
    checkpoint("atlas", "arrival");
    void transitionTo(() => {
      setMode("map"); setOverlay(null); setAttempt(value => value + 1);
    });
  }
  function visitRegion(region: Region) {
    if (saveRef.current.oasisTransition !== "ready" || region === "gatehouse" && !saveRef.current.gatehouseReady || region === "farmland" && !saveRef.current.farmlandReady) return;
    if (region === "farmland" && !playtest && !farmland?.farmland.unlocked) return;
    persist({ ...saveRef.current, region });
    void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); });
  }
  function openFarmland() { persist(advanceChapterTransition(saveRef.current, "arrival", "ready")); startLevel("seedStore"); }
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
          oasisTransition: chapter !== "oasis" ? "ready" : "locked", gatehouseReady: chapter === "gatehouse" || chapter === "farmland", farmlandReady: chapter === "farmland", transition: null, demoEnding: chapter === "farmland" ? "done" : "locked", farmlandEnding: "locked",
          companions: chapter === "farmland" ? ["keeper", "wayfinder", "gatewright", "fieldkeeper"] : chapter === "gatehouse" ? ["keeper", "wayfinder", "gatewright"] : chapter === "caravan" ? ["keeper", "wayfinder"] : completed.length ? ["keeper"] : [] }));
        setKeeperMet(completed.includes("pumpHouse"));
    }
    setSettings(false); startLevel(id);
  }
  function leaveBoard(reason: string) {
    if (transitioning.current) return;
    setSettings(false); setRevealing(false); skipReveal.current = null;
    sound.current?.stopTransientSounds();
    abandonRecord(reason); activeRecord.current = null;
    const chapterEnd = activeLevel === "openWaterway" && saveRef.current.oasisTransition === "film" || activeLevel === "lightTheRoute" && saveRef.current.transition?.from === "caravan" && saveRef.current.transition.stage === "film" || activeLevel === "openTheHarvestRoad" && saveRef.current.farmlandEnding === "film";
    const harvestOpen = activeLevel === "openTheHarvestRoad" && saveRef.current.farmlandEnding === "thanks";
    void transitionTo(() => {
        pendingAttempt.current = null; cacheCloud(); setShopSelected([]); setShopError(null);
        setMode("map"); setPuzzle(null); setAttempt(value => value + 1); setOverlay(chapterEnd ? "film" : harvestOpen ? "harvestOpen" : null);
      }, !chapterEnd);
  }
  function finish() { leaveBoard("left-board"); }
  function previewTransition(kind: "oasis" | "caravan" | "gatehouse") {
    if (!playtest || transitioning.current) return;
    abandonRecord("preview-transition"); activeRecord.current = null;
    setSettings(false); setRevealing(false); skipReveal.current = null;
    sound.current?.stopTransientSounds();
    const chapters: Record<typeof kind, Partial<Save>> = {
      oasis: { completed: LEVEL_ORDER.slice(0, 10) as LevelId[], oasisTransition: "film", transition: { from: "oasis", to: "caravan", stage: "film" }, region: "oasis", companions: [], gatehouseReady: false, demoEnding: "locked" },
      caravan: { completed: LEVEL_ORDER.slice(0, 20) as LevelId[], oasisTransition: "ready", transition: { from: "caravan", to: "gatehouse", stage: "film" }, region: "caravan", companions: ["keeper", "wayfinder"], gatehouseReady: false, demoEnding: "locked" },
      gatehouse: { completed: LEVEL_ORDER.slice(0,30) as LevelId[], oasisTransition: "ready", transition: null, region: "gatehouse", companions: ["keeper", "wayfinder", "gatewright"], gatehouseReady: true, demoEnding: "gate" },
    };
    void transitionTo(() => {
      pendingAttempt.current = null; setShopSelected([]); setShopError(null); setPuzzle(null);
      persist(normalizeSave({ ...saveRef.current, ...chapters[kind] }));
      setMode("map"); setOverlay(kind === "gatehouse" ? null : "film"); setAttempt(value => value + 1);
    }, kind === "gatehouse");
  }
  function previewFarmlandStory() {
    if (!playtest || transitioning.current) return;
    abandonRecord("preview-transition"); activeRecord.current = null;
    setSettings(false); setRevealing(false); skipReveal.current = null;
    setFarmlandPreview(true);
    sound.current?.stopTransientSounds();
    const preview = normalizeSave({ ...saveRef.current,
      completed: LEVEL_ORDER.slice(0, 30) as LevelId[], oasisTransition: "ready",
      gatehouseReady: true, farmlandReady: false, region: "gatehouse", demoEnding: "done",
      transition: { from: "gatehouse", to: "farmland", stage: "handoff" },
    });
    void transitionTo(() => {
      pendingAttempt.current = null; setShopSelected([]); setShopError(null); setPuzzle(null);
      persist(preview); setMode("map"); setOverlay("handoff"); setAttempt(value => value + 1);
    });
  }
  function previewFarmlandEnding() {
    if (!playtest || transitioning.current) return;
    abandonRecord("preview-transition"); activeRecord.current = null;
    setSettings(false); setRevealing(false); skipReveal.current = null;
    setFarmlandPreview(true); sound.current?.stopTransientSounds();
    const preview = normalizeSave({ ...saveRef.current,
      completed: [...LEVEL_ORDER] as LevelId[], oasisTransition: "ready", transition: null,
      gatehouseReady: true, farmlandReady: true, region: "farmland", demoEnding: "done", farmlandEnding: "film",
    });
    void transitionTo(() => {
      pendingAttempt.current = null; setShopSelected([]); setShopError(null); setPuzzle(null);
      persist(preview); setMode("map"); setOverlay("film"); setAttempt(value => value + 1);
    }, false);
  }
  function reset() {
    if (cloudRef.current && !playtest) { setCloudMessage("Portal progress cannot be reset from the demo. Sign out to restart the guest campaign on this device."); return; }
    abandonRecord("reset"); activeRecord.current = null;
    if (playtest) setPlaytestTrack("auto"); else setTrackPreference("auto");
    void transitionTo(() => {
      const fresh: Save = { ...EMPTY_SAVE, completed: [], companions: [] };
      saveRef.current = fresh; setSave(fresh);
      if (playtest) writePlaytestWallet({ version: 1, coins: 0 });
      else writeSave(fresh);
      setMode("map"); mapPositions.current = { oasis: null, caravan: null, gatehouse: null, farmland: null }; setKeeperMet(false);
      setPuzzle(null); setSettings(false); setOverlay("start"); setAttempt(value => value + 1);
    });
  }

  if (!ready) return <main className="loading">Loading the kingdom…</main>;
  const repaired = save.completed.includes("pumpHouse");
  const available = nextLevel(save.completed);
  const level = LEVELS[activeLevel];
  const chapter = level.chapter ?? "oasis";
  const chapterNumber = [...new Set(LEVEL_ORDER.map(id => LEVELS[id].chapter ?? "oasis"))].indexOf(chapter) + 1;
  const chapterLevel = LEVEL_ORDER.filter(id => (LEVELS[id].chapter ?? "oasis") === chapter).indexOf(activeLevel) + 1;
  const mapLevel = available && (LEVELS[available].chapter ?? "oasis") === save.region ? available : null;
  const partyUnlocked = save.companions.includes("keeper");
  const isCaravan = save.region === "caravan";
  const isGatehouse = save.region === "gatehouse";
  const isFarmland = save.region === "farmland";
  const saveStatus = cloudStatus === "account" ? "Saved to Portal" : cloudStatus === "syncing" ? "Saving…" : cloudStatus === "pending" ? "Waiting to sync" : cloudStatus === "expired" ? "Sign in again" : cloudStatus === "checking" ? "Checking save…" : "Saved on this device";
  const speakerId = isFarmland ? "fieldkeeper" : isGatehouse ? "gatewright" : isCaravan ? "wayfinder" : "keeper";
  const speaker = COMPANIONS[speakerId];
  const companionIntroduced = isFarmland ? save.farmlandReady : isGatehouse ? save.gatehouseReady : isCaravan ? save.oasisTransition === "ready" : keeperMet;
  const goalsLeft = Object.entries(puzzle?.goals ?? {}).filter(([, count]) => count > 0).map(([kind, count]) => `${count} ${kind === "leaf" ? "reeds" : kind === "pennant" ? "pennants" : kind === "key" ? "keys" : kind === "crust" ? "salt blocks" : kind}`).join(" and ");
  const demoComplete=save.completed.includes("openTheCrossing");
  const farmlandUnlocked=playtest ? farmlandPreview : Boolean(farmland && farmland.accountId===cloudRef.current?.accountId && farmland.farmland.unlocked);
  const farmlandEligible=Boolean(farmland && farmland.accountId===cloudRef.current?.accountId && farmland.farmland.eligible);
  const farmlandBlocked=cloudStatus==="pending" || cloudStatus==="syncing" || cloudConflict.current || Boolean(cloudRef.current?.pending.length);
  function beginFarmland() {
    if (playtest && !demoComplete) { previewFarmlandStory(); return; }
    if (!farmlandUnlocked || !demoComplete) return;
    if (saveRef.current.farmlandReady) { visitRegion("farmland"); return; }
    if (saveRef.current.transition?.to === "farmland") { setOverlay(overlayForSave(saveRef.current)); return; }
    // The server requires the demo acknowledgment as its own durable checkpoint
    // before it accepts the first Farmland transition checkpoint.
    if (saveRef.current.demoEnding === "thanks") acknowledgeDemo();
    if (saveRef.current.demoEnding !== "done") return;
    persist(normalizeSave({ ...saveRef.current, transition: { from: "gatehouse", to: "farmland", stage: "handoff" } }));
    setOverlay("handoff");
  }
  function farmlandAccess() {
    if (farmlandUnlocked) return <button className="farmland-action" onClick={beginFarmland}>Travel to Farmland →</button>;
    if (playtest) return <button className="farmland-action" onClick={previewFarmlandStory}>Preview Farmland →</button>;
    if (!cloudRef.current) return demoComplete ? <a className="farmland-action" href={cloudApi.PORTAL_LOGIN_URL} onClick={acknowledgeDemo}>Sign in to unlock Farmland →</a> : <p className="farmland-status">Complete the 30 demo levels to unlock Farmland with a Portal login.</p>;
    if (cloudStatus==="expired") return <a className="farmland-action" href={cloudApi.PORTAL_LOGIN_URL} onClick={acknowledgeDemo}>Sign in again to unlock Farmland →</a>;
    if (farmlandBlocked) return <><p className="farmland-status">Sync progress to unlock Farmland.</p><button className="farmland-action" onClick={() => void flushCloud()} disabled={cloudStatus==="syncing" || cloudConflict.current}>Sync progress →</button></>;
    if (farmlandState==="loading") return <p className="farmland-status" role="status">Checking Farmland access…</p>;
    if (farmlandState==="claiming") return <p className="farmland-status" role="status">Unlocking Farmland…</p>;
    if (farmlandState==="error" || !farmland) return <><p className="farmland-status" role="alert">{farmlandError??"Farmland access could not be checked."}</p><button className="farmland-action" onClick={() => void (farmlandClaimId.current && farmlandEligible ? unlockFarmland() : refreshFarmland())}>Retry Farmland access →</button></>;
    if (!farmlandEligible) return <p className="farmland-status">Complete all 30 demo levels on this Portal account to unlock Farmland.</p>;
    return <button className="farmland-action" onClick={() => void unlockFarmland()}>Unlock Farmland →</button>;
  }
  return <main className="viewport">
    <div className="frame" aria-label="Dune Relay game" data-mode={mode} data-moves={mode === "puzzle" ? puzzle?.moves : undefined} data-reduced-motion={reducedMotion}>
      {overlay !== "film" && overlay !== "start" && <GameCanvas key={`${mode}-${save.region}-${attempt}`} mode={mode} region={save.region} mapPosition={mapPositions.current[save.region]} repaired={repaired} caravanComplete={save.completed.includes("lightTheRoute")} gatehouseComplete={save.completed.includes("openTheCrossing")} gateOpening={save.demoEnding === "gate"} nextLevel={mapLevel} keeperMet={keeperMet} companionIntroduced={companionIntroduced} level={level} puzzle={puzzle} startingBoosters={mode === "puzzle" && pendingAttempt.current?.sceneAttempt === attempt && pendingAttempt.current.level === activeLevel && pendingAttempt.current.status !== "failed" ? pendingAttempt.current.placements : []} audio={sound.current} reducedMotion={reducedMotion} transitioning={wipe !== "hidden"} interactionBlocked={settings || tutorialLibrary || tutorialSession !== null || overlay !== null || sceneIssue !== null} onReady={async () => { const authorized = await authorizeSceneReady(); if (sceneReady.current?.attempt === attempt) sceneReady.current.settle(authorized ? "ready" : "failed"); return authorized; }} onFailure={reason => {
        logDiagnostic("scene-failure", { reason, attempt });
        if (pendingAttempt.current?.sceneAttempt === attempt && pendingAttempt.current.status === "prepared") pendingAttempt.current.status = "failed";
        if (sceneReady.current?.attempt === attempt) sceneReady.current.settle("failed");
        setSceneIssue(reason === "context-lost" ? "The graphics context was interrupted." : "The scene could not load.");
      }} onEvent={onEvent} skipReveal={skipReveal} />}
      <div className="save-hud">
        {mode === "puzzle" && <span className="level-pill" aria-label={`Chapter ${chapterNumber}, level ${chapterLevel}`}>{chapterNumber}.{chapterLevel}</span>}
        <span className="coin-pill" aria-label={`${save.coins} coins`}><img src={assetUrl("/sprites/coin.png")} alt="" />{save.coins.toLocaleString("en-US")}</span>
        {!playtest && <div className="cloud-pill" role="status" title={`${portalName ?? "Guest"} · ${saveStatus}`} aria-label={`${portalName ?? "Guest"} · ${saveStatus}`}><span className="cloud-name">{portalName ?? "Guest"} · </span><span className="cloud-status">{saveStatus}</span></div>}
      </div>
      <div className="top-actions" inert={wipe !== "hidden"}>
        {mode === "map" && partyUnlocked && <>
          <button className="nav-button" onClick={() => setOverlay("kingdom")}>Kingdom Map</button>
          <button className="nav-button" onClick={() => setOverlay("party")}>Raid Party</button>
        </>}
        <button className="icon-button" onClick={toggleSound} aria-label={muted ? "Unmute" : "Mute"}>{muted ? "♪̸" : "♪"}</button>
        <button className="icon-button" onClick={() => setSettings(true)} aria-label="Settings">⚙</button>
      </div>
      {revealing && mode === "puzzle" && <button className="skip-reveal" onClick={() => skipReveal.current?.()}>Skip reveal →</button>}
      {fullscreenAvailable && !isFullscreen && overlay === null && !settings && !tutorialLibrary && !tutorialSession && <button className="fullscreen-return" onClick={() => requestGameFullscreen()}>⛶ Full screen</button>}
      {fullscreenIssue && <div className="fullscreen-issue" role="status">{fullscreenIssue}</div>}
      {fullscreenEmbeddedBlocked && <a className="fullscreen-new-tab" href={typeof window === "undefined" ? undefined : window.location.href} target="_blank" rel="noopener noreferrer">Open game in a new tab ↗</a>}
      {overlay === "start" && <div className={`scrim intro${isFarmland ? " intro-farmland" : isGatehouse ? " intro-gatehouse" : isCaravan ? " intro-caravan" : ""}`}><div className="intro-card">
        <div className="eyebrow">A RAIDGUILD ADVENTURE</div><h1>DUNE<br />RELAY</h1>
        <p>{isFarmland ? save.completed.includes("openTheHarvestRoad") ? "The harvest road is open. The next clue points to the town on the hill." : "Beyond the bridge, sealed seed stores are holding up the harvest convoy. Find the Fieldkeeper." : demoComplete ? "The bridge is open. Your party has cleared the demo journey. Explore the kingdom to see what lies ahead." : isGatehouse ? "The caravan has reached the river. The Gatewright needs our help opening the crossing." : save.completed.includes("lightTheRoute") ? "The beacon lights the desert road. The caravan chapter is complete." : isCaravan ? "The waterway is alive. The caravan road is open." : available === "caravanPennants" ? "The pump house has come to life. A new route waits beyond the oasis." : repaired ? "The intake is flowing. Follow the path to the next station." : "The oasis pump has gone quiet. Find the keeper, bring the machine to life, and follow the water."}</p>
        <button className="primary" disabled={cloudStatus === "checking" || (cloudStatus === "expired" && !cloudRef.current)} onClick={enter}>{save.oasisTransition !== "locked" && save.oasisTransition !== "ready" ? "Continue the journey" : isFarmland ? "Enter the fields" : isGatehouse ? "Enter the gatehouse" : isCaravan ? "Enter the desert" : "Enter the oasis"} <span>↗</span></button>
        {!playtest && (!portalName || cloudStatus === "expired") && <a className="quiet portal-login" href={cloudApi.PORTAL_LOGIN_URL}>Sign in with RaidGuild Portal →</a>}
        {!playtest && cloudStatus === "expired" && !cloudRef.current && <button className="quiet" onClick={continueAsGuest}>Play as guest on this device</button>}
        {cloudMessage && <small role="status">{cloudMessage}</small>}
        <small>Touch to walk · Mobile landscape · WASD and mouse on desktop</small>
      </div></div>}
      {overlay === "cloudChoice" && <div className="scrim"><div className="dialog-card">
        <span className="speaker">WELCOME TO PORTAL{portalName ? ` · ${portalName.toUpperCase()}` : ""}</span>
        <h2>Bring this device's progress?</h2>
        <p>Your Portal account has no Dune Relay campaign yet. You can move this guest campaign into the account once, or start a new Portal campaign. The guest save stays on this device either way.</p>
        {cloudMessage && <p role="alert">{cloudMessage}</p>}
        <button className="primary" disabled={cloudStatus === "syncing"} onClick={() => void importGuestProgress()}>Continue with this progress <span>→</span></button>
        <button className="quiet" disabled={cloudStatus === "syncing"} onClick={startFreshPortalCampaign}>Start a fresh Portal campaign</button>
      </div></div>}
      {overlay === "keeper" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/keeper-avatar.png")} alt="" /><span className="speaker">THE KEEPER</span></div>
        <p>{LEVELS.pumpHouse.briefing}</p><button className="primary" onClick={closeDialogue}>Let's do it <span>→</span></button>
      </div></div>}
      {overlay === "companionChat" && companionLine && <div className="scrim"><div className="dialog-card companion-chat" role="dialog" aria-label={`Talk to ${speaker.name}`}>
        <div className="speaker-row"><img className="speaker-avatar" src={speaker.portrait} alt="" /><span className="speaker">{speaker.name.toUpperCase()}</span></div>
        <p>{companionLine.text}</p>
        {companionLine.source && <a className="handbook-source" href={companionLine.source} target="_blank" rel="noopener noreferrer">From the RaidGuild Handbook ↗</a>}
        <button className="primary" onClick={closeCompanionChat}>Close</button>
      </div></div>}
      {overlay === "briefing" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={speaker.portrait} alt="" /><span className="speaker">{speaker.name.toUpperCase()} · {mapLevel ? LEVELS[mapLevel].title : isFarmland ? "FARMLAND" : isGatehouse ? "RIVER GATEHOUSE" : isCaravan ? "OPEN DESERT" : "OASIS"}</span></div>
        <p>{mapLevel ? LEVELS[mapLevel].briefing : "The oasis is flowing."}</p>
        <div className="briefing-actions"><button className="quiet" onClick={closeBriefing}>Back to story</button><button className="primary" onClick={startBriefing}>Start level <span>→</span></button></div>
      </div></div>}
      {overlay === "shop" && <div className="scrim"><div className="dialog-card booster-shop">
        <span className="speaker">{LEVELS[shopLevel].title.toUpperCase()} · OPTIONAL STARTING BOOSTERS</span>
        <p>You can play without boosters for free. Bought boosters start on this board and are used for this attempt.</p>
        <div className="shop-balance">{save.coins.toLocaleString("en-US")} coins available{playtest && <small>Test wallet · campaign coins stay untouched</small>}</div>
        <div className="booster-options">{BOOSTERS.map(item => { const selected=shopSelected.includes(item.kind); const shortfall=boosterCost(shopSelected)+item.cost-save.coins; const unresolved=pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0; const unavailable=unresolved || !selected && shortfall > 0; return <button key={item.kind} className={`booster-option${selected ? " selected" : ""}`} aria-pressed={selected} disabled={unavailable} onClick={() => toggleBooster(item.kind)}>
          <img src={assetUrl(item.image as `/${string}`)} alt="" />
          <strong>{item.title}</strong><small>{item.description}</small><b>{item.cost} coins</b>{unavailable && shortfall > 0 && <small className="booster-shortfall">Need {shortfall.toLocaleString("en-US")} more</small>}
        </button>; })}</div>
        <div className="shop-total">Total: {boosterCost(shopSelected).toLocaleString("en-US")} coins</div>
        {pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0 && <p className="shop-error" role="status">This purchase still needs confirmation. Retry it to avoid a second charge.</p>}
        {shopError && <p className="shop-error" role="alert">{shopError}</p>}
        <div className="shop-actions"><button className="quiet" onClick={cancelShop}>Back</button><div className="shop-launch-actions">{shopSelected.length > 0 && !(pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0) && <button className="quiet" onClick={() => { setShopSelected([]); void launchLevel([]); }}>Play without boosters</button>}<button className="primary" onClick={() => void launchLevel([...shopSelected])}>{pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0 ? "Retry purchase" : `Start level · ${shopSelected.length ? `${boosterCost(shopSelected).toLocaleString("en-US")} coins` : "Free"}`} <span>→</span></button></div></div>
      </div></div>}
      {overlay === "film" && <div className="film-screen">
        <video ref={film} src={filmReady ? assetUrl(filmContent.source as `/${string}`) : undefined} poster={assetUrl(filmContent.poster as `/${string}`)} playsInline preload="metadata" onEnded={finishFilm} onLoadedMetadata={event => logDiagnostic("film-metadata", { film: filmKind, width: event.currentTarget.videoWidth, height: event.currentTarget.videoHeight })} onError={() => { logDiagnostic("film-media-error", { film: filmKind }); setFilmBlocked(true); }} aria-label={filmContent.label} />
        <div className="film-caption">{filmContent.caption}</div>
        {filmBlocked && <button className="primary film-play" onClick={() => { void film.current?.play().then(() => setFilmBlocked(false)).catch(() => setFilmBlocked(true)); }}>Play scene <span>▶</span></button>}
        <button className="film-skip" onClick={finishFilm}>Skip scene →</button>
      </div>}
      {overlay === "handoff" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={save.transition?.from === "gatehouse" ? assetUrl("/sprites/gatewright-avatar.png") : save.transition?.from === "caravan" ? assetUrl("/sprites/wayfinder-avatar.png") : assetUrl("/sprites/keeper-avatar.png")} alt="" /><span className="speaker">{save.transition?.from === "gatehouse" ? "THE GATEWRIGHT" : save.transition?.from === "caravan" ? "THE WAYFINDER" : "THE KEEPER"}</span></div>
        {save.transition?.from === "gatehouse" ? <p>The bridge is open, but the seed ledger is wrong: stores are sealed while the harvest route waits. The Fieldkeeper keeps the terrace records. Follow me across and ask him what was diverted.</p> : save.transition?.from === "caravan" ? <p>The beacon connects the desert road, but the river crossing is sealed. Walkers cannot carry the caravan over it. The Gatewright tends the bridge winches. Let’s bring her the keys and reopen the way into farmland.</p> : <p>Listen to that water. The pump can run without us now. Beyond the dunes, the walker train needs a marked route. Take the map, and find the Wayfinder. A shared road is how we carry this oasis to the rest of the kingdom.</p>}
        <button className="primary" onClick={acceptHandoff}>Open the kingdom map <span>→</span></button>
      </div></div>}
      {(overlay === "atlas" || overlay === "kingdom") && <div className="atlas-screen">
        <div className="atlas-plane">
          <img src={assetUrl("/kingdom.webp")} alt="Illustrated kingdom with the oasis, camel caravan, river bridge, farmland, and distant regions" />
          <svg className="atlas-path" viewBox="0 0 1774 887" aria-hidden="true">
            <path className="atlas-path-shadow" d="M444 580 C620 610 720 682 885 695 M885 695 C1005 716 1074 751 1195 768" />
            <path className="atlas-path-light" d="M444 580 C620 610 720 682 885 695 M885 695 C1005 716 1074 751 1195 768" />
            {demoComplete && <><path className="atlas-path-shadow" d="M1195 768 C1285 760 1370 727 1453 699" /><path className="atlas-path-light" d="M1195 768 C1285 760 1370 727 1453 699" /></>}
          </svg>
          <span className="atlas-anchor oasis-anchor" /><span className="atlas-anchor caravan-anchor" /><span className="atlas-anchor bridge-anchor" />{demoComplete && <span className="atlas-anchor farmland-anchor" />}
          <div className="atlas-route">
            <button className="atlas-stamp" disabled={save.oasisTransition !== "ready"} onClick={() => visitRegion("oasis")}>OASIS ✓<small>Waterway restored · visit</small></button>
            <button className="atlas-active" disabled={save.oasisTransition !== "ready"} onClick={() => visitRegion("caravan")}>OPEN DESERT {save.completed.includes("lightTheRoute") ? "✓" : ""}<small>{save.completed.includes("lightTheRoute") ? "Route beacon lit · visit" : "Walker train · route beacon"}</small></button>
            {save.completed.includes("lightTheRoute") && <button className="atlas-gatehouse" disabled={!save.gatehouseReady} onClick={() => visitRegion("gatehouse")}>RIVER GATEHOUSE {save.completed.includes("openTheCrossing") ? "✓" : ""}<small>{save.gatehouseReady ? "Bridge crossing · visit" : "River crossing ahead"}</small></button>}
          </div>
        </div>
        <div className="atlas-heading">THE KINGDOM <span>{overlay === "atlas" ? "A NEW ROUTE OPENS" : "THE JOURNEY"}</span></div>
        <div className="atlas-future">{save.completed.includes("openTheCrossing") ? "The bridge is open. The Fieldkeeper is waiting beyond the river." : save.completed.includes("lightTheRoute") ? "The caravan has reached the river bridge." : "Follow the lighted road through the desert."}</div>
        {save.completed.includes("openTheCrossing") && <button className="atlas-farmland" onClick={() => farmlandUnlocked ? beginFarmland() : setOverlay("farmland")}>FARMLAND {save.completed.includes("openTheHarvestRoad") ? "✓" : farmlandUnlocked ? "●" : <span className="atlas-lock" role="img" aria-label="Locked">🔒</span>}<small>{save.completed.includes("openTheHarvestRoad") ? "Harvest road open · visit" : farmlandUnlocked ? "Unlocked · travel" : "Chapter 4 · locked"}</small></button>}
        <button className="primary atlas-action" onClick={overlay === "atlas" ? travelToCaravan : () => setOverlay(null)}>{overlay === "atlas" ? save.transition?.to === "farmland" ? "Cross into Farmland" : save.transition?.to === "gatehouse" ? "Travel to the river bridge" : "Travel to the caravan" : "Return to the path"} <span>→</span></button>
      </div>}
      {overlay === "farmland" && <div className="scrim"><div className="dialog-card farmland-card"><span className="speaker">THE ROAD BEYOND THE BRIDGE</span><h2>Farmland · Chapter 4</h2><p>The gate is open. Farmland is the Portal login bonus for players who finish this 30-level demo. The seed stores and water terraces are ready to explore.</p>{farmlandAccess()}<button className="quiet" onClick={() => setOverlay("kingdom")}>Back to the kingdom map</button></div></div>}
      {overlay === "party" && <div className="scrim"><div className="party-card">
        <div className="eyebrow">THE RAID PARTY</div><h2>Those who keep the road open</h2>
        <div className="party-list">
          {(["keeper", "wayfinder", "gatewright", "fieldkeeper"] as const).map(id => save.companions.includes(id) ? <div className="party-member" key={id}><img src={COMPANIONS[id].portrait} alt="" /><div><strong>{COMPANIONS[id].name}</strong><p>{COMPANIONS[id].chapter} · {COMPANIONS[id].power}.</p></div></div> : <div className="party-member unknown" key={id}><span>?</span><div><strong>Future companion</strong><p>Waiting farther along the road.</p></div></div>)}
        </div><button className="primary" onClick={() => setOverlay(null)}>Back to the path <span>→</span></button>
      </div></div>}
      {overlay === "wayfinder" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/wayfinder-avatar.png")} alt="" /><span className="speaker">THE WAYFINDER · WINDWARD TRAIL</span></div>
        <p>These coral pennants mark the route for every walker. Match them with the familiar oasis symbols. Every nine pennants gives me enough tailwind to send two Flywheels. Help me set the trail, and I’ll travel with your party.</p>
        <button className="primary" onClick={followPennants}>Follow the pennants <span>→</span></button>
      </div></div>}
      {overlay === "fieldkeeper" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/fieldkeeper-avatar.png")} alt="" /><span className="speaker">THE FIELDKEEPER · SEED LEDGER</span></div>
        <p>These sealed seedpods have fallen through the stores. Match beside a pod twice to open it. Pods can fall but won't swap. Clear twelve reeds and I’ll send two Flywheels to help. The ledger says deliveries went missing farther upstream.</p>
        <button className="primary" onClick={openFarmland}>Open the seed store <span>→</span></button>
      </div></div>}
      {overlay === "gatewright" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/gatewright-avatar.png")} alt="" /><span className="speaker">THE GATEWRIGHT · RIVER GATEHOUSE</span></div>
        <p>The bridge winches have locked under salt. These violet keys fit the old controls. Match them to help me free the gate. Every nine keys, I can place one Prism on your board; swap it with a symbol or double-tap it when you need it.</p>
        <button className="primary" onClick={openGatehouse}>Open the gatehouse <span>→</span></button>
      </div></div>}
      {overlay === "harvestOpen" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/fieldkeeper-avatar.png")} alt="" /><span className="speaker">THE FIELDKEEPER · HARVEST ROAD</span></div>
        <h2>The convoy can move</h2><p>The seed stores are open and the terraces are flowing. The ledger points to missing deliveries near the town on the hill. The raid continues there in a future chapter.</p>
        <button className="primary" onClick={() => { if (saveRef.current.farmlandEnding === "thanks") persist(normalizeSave({ ...saveRef.current, farmlandEnding: "done" })); setOverlay("kingdom"); }}>View the kingdom <span>→</span></button>
      </div></div>}
      {overlay === "crossingOpen" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/gatewright-avatar.png")} alt="" /><span className="speaker">THE GATEWRIGHT · CROSSING OPEN</span></div>
        <h2>The bridge is open</h2><p>The counterweights lift, and water runs through the gatehouse. The walkers can cross toward the farmland. The Fieldkeeper needs help with the sealed stores.</p>
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
        <p>You completed all 30 demo levels. More characters, tiles, power-ups, and adventures are coming soon. Explore the kingdom to see where the story goes next.</p>
        <p className="demo-story">The story continues…</p>
        <button className="primary" onClick={() => { persist(normalizeSave({ ...saveRef.current, demoEnding: "done" })); setOverlay("kingdom"); }}>Explore the kingdom <span>→</span></button>
      </div></div>}
      {overlay === "lost" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={COMPANIONS[level.chapter === "farmland" ? "fieldkeeper" : level.chapter === "gatehouse" ? "gatewright" : level.chapter === "caravan" ? "wayfinder" : "keeper"].portrait} alt="" /><span className="speaker">{COMPANIONS[level.chapter === "farmland" ? "fieldkeeper" : level.chapter === "gatehouse" ? "gatewright" : level.chapter === "caravan" ? "wayfinder" : "keeper"].name.toUpperCase()}</span></div><h2>{level.title} stalls</h2>
        <p>The trail still needs {goalsLeft}.</p>
        <button className="primary" onClick={retry}>Try again <span>↻</span></button>
        <button className="quiet" onClick={finish}>Back to the {level.chapter === "farmland" ? "farmland" : level.chapter === "gatehouse" ? "gatehouse" : level.chapter === "caravan" ? "caravan" : "oasis"}</button>
      </div></div>}
      {overlay === "finale" && <div className="result-overlay"><div className="result-card">
        <span className="eyebrow">{level.victoryEyebrow}</span><h2>{level.victoryTitle}</h2>
        <p>{level.victoryMessage} {puzzle?.moves} spare moves fired as {puzzle?.grantedPower === "flywheels" ? "Flywheels" : "Pressure Jets"}.</p>
        <div className="coin-reveal"><img src={assetUrl("/sprites/coin.png")} alt="" />+{reward.current} coins</div>
        <button className="primary" onClick={finish}>{activeLevel === "openWaterway" ? "See the pump awaken" : activeLevel === "lightTheRoute" ? "See the walkers depart" : activeLevel === "openTheCrossing" ? "See the bridge open" : activeLevel === "openTheHarvestRoad" ? "See the harvest road open" : level.chapter === "farmland" ? "Return to the fields" : level.chapter === "gatehouse" ? "Return to the gatehouse" : level.chapter === "caravan" ? "Return to the caravan" : "Follow the water"} <span>→</span></button>
      </div></div>}
      {tutorialSession && <TutorialDialog key={`${tutorialSession.mode}-${tutorialSession.tutorial.id}`} tutorial={tutorialSession.tutorial} mode={tutorialSession.mode} reducedMotion={reducedMotion} onSkip={()=>dismissTutorial(true)} onContinue={()=>dismissTutorial(true)} onBack={()=>dismissTutorial(false)} />}
      {tutorialLibrary && !tutorialSession && <div className="scrim tutorial-scrim"><div className="dialog-card tutorial-library" role="dialog" aria-modal="true" aria-label="How to play"><span className="speaker">HOW TO PLAY</span><h2>Lessons</h2><div className="tutorial-library-list">{TUTORIALS.filter(t=>tutorialAvailable(t,save.completed,mapLevel,farmlandUnlocked,playtest,readSeen(currentTutorialScope()))).map(t=><button key={t.id} data-tutorial-item={t.id} onClick={()=>openTutorialReplay(t)}>{t.title}<small>{t.summary}</small></button>)}</div><button className="quiet" onClick={()=>{setTutorialLibrary(false);setSettings(true);}}>Back to Settings</button></div></div>}
      {settings && <div className="scrim"><div className="dialog-card settings-card">
        <span className="speaker">SETTINGS</span>
        {!playtest && <><small className="setting-note">{portalName ? `${portalName} · ${cloudStatus === "account" ? "Saved to Portal" : cloudStatus === "syncing" ? "Saving" : "Saved locally, waiting to sync"}` : "Guest progress is saved on this device."}</small>{cloudMessage && <small className="setting-note" role="status">{cloudMessage}</small>}
          {cloudStatus === "expired" && <a className="setting" href={cloudApi.PORTAL_LOGIN_URL}>Sign in to Portal again</a>}
          {cloudConflict.current && cloudRef.current && <><button className="setting" onClick={downloadCloudBackup}>Download unsynced backup</button><button className="setting" onClick={() => void usePortalSave()}>Use Portal save</button></>}
          {portalName && cloudRef.current ? <><button className="setting" onClick={() => void flushCloud()}>Sync now</button><button className="setting" onClick={() => void signOut()}>Sign out of Portal</button></> : !portalName ? <a className="setting" href={cloudApi.PORTAL_LOGIN_URL}>Sign in with RaidGuild Portal</a> : null}</>}
        {mode === "puzzle" && <><button className="setting return-story" onClick={() => leaveBoard("returned-to-story")}>Return to story <span aria-hidden="true">→</span></button><small className="setting-note">Unfinished levels restart. Used boosters stay spent.</small></>}
        <button className="setting" onClick={() => {setSettings(false);setTutorialLibrary(true);}}>How to play <span aria-hidden="true">→</span></button>
        <button className="setting" onClick={toggleSound}>Sound <strong>{muted ? "Off" : "On"}</strong></button>
        <label className="volume-setting">Effects <span>{Math.round(sfxVolume * 100)}%</span><input type="range" min="0" max="100" value={Math.round(sfxVolume * 100)} onChange={event => setSfxVolume(Number(event.target.value) / 100)} /></label>
        <label className="volume-setting">Ambience <span>{Math.round(ambienceVolume * 100)}%</span><input type="range" min="0" max="100" value={Math.round(ambienceVolume * 100)} onChange={event => setAmbienceVolume(Number(event.target.value) / 100)} /></label>
        <label className="volume-setting">Music <span>{Math.round(musicVolume * 100)}%</span><input type="range" min="0" max="100" value={Math.round(musicVolume * 100)} onChange={event => setMusicVolume(Number(event.target.value) / 100)} /></label>
        <label className="soundtrack-setting">Soundtrack<select value={effectiveTrack} onChange={event => { const choice = event.target.value as TrackPreference; if (choice !== "auto" && !unlockedTracks.includes(choice)) return; if (playtest) setPlaytestTrack(choice); else setTrackPreference(choice); }}><option value="auto">Follow chapter</option>{SOUNDTRACKS.map(track => <option key={track.id} value={track.id} disabled={!unlockedTracks.includes(track.id)}>{track.title}{unlockedTracks.includes(track.id) ? "" : ` · unlock in ${track.chapter}`}</option>)}</select></label>
        <button className="setting" onClick={() => setReducedMotion(value => !value)}>Reduced motion <strong>{reducedMotion ? "On" : "Off"}</strong></button>
        <a className="raidguild-credit" href="https://raidguild.org" target="_blank" rel="noopener noreferrer"><img src={assetUrl("/raidguild-stamp.svg")} alt="" /><span>Built by <strong>RaidGuild</strong><small>raidguild.org <span aria-hidden="true">↗</span></small></span></a>
        <button className="quiet" onClick={() => setSettings(false)}>Close</button>
        <button className="setting" onClick={downloadDiagnostics}>Export diagnostics (JSON)</button>
        {archiveKey.current && cloudStatus !== "checking" && (playtest || cloudStatus !== "expired") && <><small className="setting-note">Level stats stay on this device{playtest ? " in a separate playtest archive" : cloudRef.current ? " for this Portal account" : " for this guest campaign"}. Export a copy here.</small><button className="setting" onClick={() => downloadStats("json")}>Export level stats (JSON)</button><button className="setting" onClick={() => downloadStats("csv")}>Export level stats (CSV)</button></>}
        {playtest ? <>
          <button className="setting" onClick={() => setFarmlandPreview(value=>!value)}>Preview Farmland access <strong>{farmlandPreview ? "Unlocked" : "Locked"}</strong></button>
          <button className="setting" onClick={() => window.location.assign(window.location.pathname)}>Return to campaign</button>
          {LEVEL_ORDER.map(id => <button className="setting" key={id} onClick={() => replayLevel(id)}>Replay {LEVELS[id].title}</button>)}
          <button className="setting" onClick={() => previewTransition("oasis")}>Preview Oasis → desert transition</button>
          <button className="setting" onClick={() => previewTransition("caravan")}>Preview desert → gatehouse transition</button>
          <button className="setting" onClick={() => previewTransition("gatehouse")}>Preview Gatehouse → demo ending</button>
          <button className="setting" onClick={previewFarmlandStory}>Preview Gatehouse → Farmland story</button>
          <button className="setting" onClick={previewFarmlandEnding}>Preview Farmland → harvest ending</button>
          <button className="setting" onClick={reset}>Restart sequence</button>
        </> : <>{!portalName && <button className="reset" onClick={reset}>Reset prototype progress</button>}</>}
      </div></div>}
      {sceneIssue && <div className="scrim scene-error"><div className="dialog-card">
        <span className="speaker">SCENE INTERRUPTED</span>
        <p>{sceneIssue} Reloading returns to the path. {playtest ? "This test level restarts; recorded playtest attempts stay on this device." : "Unfinished levels restart; completed levels and coins are saved on this device."}</p>
        <button className="primary" onClick={() => window.location.reload()}>Reload game <span>↻</span></button>
        {sceneIssue.includes("purchase") && <button className="quiet" onClick={recoverShop}>{pendingAttempt.current?.cost ? "Resolve booster purchase" : "Choose a free loadout"}</button>}
        <button className="quiet" onClick={downloadDiagnostics}>Export diagnostics (JSON)</button>
      </div></div>}
      {overlay !== "film" && <img className="background-watermark" src={assetUrl("/raidguild-stamp.svg")} alt="" aria-hidden="true" draggable={false} />}
      {wipe !== "hidden" && <div className={`awning-wipe awning-${wipe}`} aria-hidden="true"><div className="awning-panel awning-left" /><div className="awning-panel awning-right" /></div>}
      <div className="rotate"><div className="rotate-icon">▭</div><strong>Rotate your device</strong><p>Dune Relay plays in landscape.</p></div>
    </div>
  </main>;
}
