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
import { advanceChapterTransition, advanceTransition, completeLevel, EMPTY_SAVE, normalizeSave, readSave, setActiveCompanion, type CompanionId, type Region, type Save, writeSave } from "./save";
import { castleLevelForCompanion, companionSnapshot, sameCompanionSnapshot, type CompanionSnapshot } from "./companionAbilities";
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
import { chapterLevelLabel, chapterReplayReady, isChapterFinalLevel, replayAllowed, replayDestinations, type ReplayDestination } from "./chapterReplay";
import { useInstallApp } from "./useInstallApp";
import { InstallDialog } from "./InstallDialog";
import { CHAPTER_FINALES } from "./chapterFinales";
import { pendingKingdomPreview } from "./kingdomPreview";

const GameCanvas = dynamic(() => import("./GameCanvas"), { ssr: false });
const usesSelectableCompanion = (id: LevelId) => LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river";
type Overlay = "start" | "keeper" | "briefing" | "shop" | "replayPicker" | "replayBriefing" | "finale" | "lost" | "film" | "handoff" | "atlas" | "kingdom" | "farmland" | "dunePass" | "party" | "quartermaster" | "castleOpen" | "skiff" | "riverOpen" | "wayfinder" | "gatewright" | "fieldkeeper" | "towncrier" | "townOpen" | "companionChat" | "harvestOpen" | "routeLit" | "crossingOpen" | "demoThanks" | "cloudChoice" | null;
type PendingAttempt = { token: number; cloudAttemptId: string; sceneAttempt: number; level: LevelId; selected: BoosterKind[]; cost: number; puzzle: Puzzle; placements: BoosterPlacement[]; companionSnapshot: CompanionSnapshot | null; status: "prepared" | "committed" | "failed" };
type FullscreenAttempt = { token: number; started: number; timer: ReturnType<typeof setTimeout> };
type FinaleReplay = { token: number; generation: number; accountId: string | null; region: Region; returnTo?: "settings" };

export default function GameShell() {
  const installApp = useInstallApp();
  const [playtest, setPlaytest] = useState(false);
  const [ready, setReady] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"checking" | "guest" | "account" | "syncing" | "pending" | "expired">("checking");
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const [portalName, setPortalName] = useState<string | null>(null);
  const [farmland, setFarmland] = useState<cloudApi.FarmlandEntitlement | null>(null);
  const [farmlandState, setFarmlandState] = useState<"idle" | "loading" | "claiming" | "error">("idle");
  const [farmlandError, setFarmlandError] = useState<string | null>(null);
  const [farmlandPreview, setFarmlandPreview] = useState(false);
  const [campaignPass, setCampaignPass] = useState<cloudApi.CampaignPass | null>(null);
  const [passChecking, setPassChecking] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [save, setSave] = useState<Save>({ ...EMPTY_SAVE, completed: [], companions: [] });
  const [mode, setMode] = useState<"map" | "puzzle">("map");
  const [visitedRegion, setVisitedRegion] = useState<Region | null>(null);
  const [replayActive, setReplayActive] = useState(false);
  const [replayChoices, setReplayChoices] = useState<LevelId[]>([]);
  const [replaySelection, setReplaySelection] = useState<LevelId>("pumpHouse");
  const [replayError, setReplayError] = useState<string | null>(null);
  const [replayChecking, setReplayChecking] = useState(false);
  const [finaleReplay, setFinaleReplay] = useState<FinaleReplay | null>(null);
  const [overlay, setOverlay] = useState<Overlay>("start");
  const [keeperMet, setKeeperMet] = useState(false);
  const [companionLine, setCompanionLine] = useState<CompanionLine | null>(null);
  const companionVisits = useRef<Record<Region, number>>({ oasis: 0, caravan: 0, gatehouse: 0, farmland: 0, town: 0, castle: 0, river: 0 });
  const lastCompanionLine = useRef<Record<Region, string | undefined>>({ oasis: undefined, caravan: undefined, gatehouse: undefined, farmland: undefined, town: undefined, castle: undefined, river: undefined });
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
  const mapPositions = useRef<Record<Region, { x: number; y: number } | null>>({ oasis: null, caravan: null, gatehouse: null, farmland: null, town: null, castle: null, river: null });
  const saveRef = useRef<Save>({ ...EMPTY_SAVE, completed: [], companions: [] });
  const cloudRef = useRef<{ accountId: string; profile: cloudApi.CloudProfile; pending: cloudApi.CloudOperation[]; syncing: boolean } | null>(null);
  const cloudGeneration = useRef(0);
  const farmlandGeneration = useRef(0);
  const passGeneration = useRef(0);
  const passRequest = useRef(0);
  const passRef = useRef<{ accountId: string; generation: number; value: cloudApi.CampaignPass } | null>(null);
  const lastPassRefresh = useRef(0);
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
  const replaySession = useRef<{ token: number; generation: number; accountId: string | null; level: LevelId; sceneAttempt: number; farmlandUnlocked: boolean; townUnlocked: boolean } | null>(null);
  const finaleReplayRef = useRef<FinaleReplay | null>(null);
  const finaleReplayFinishing = useRef(false);
  const replayToken = useRef(0);
  const tokenCounter = useRef(0);
  const launching = useRef(false);
  const authorizing = useRef(false);
  const gateOpenedPending = useRef(false);
  const displayRegion=visitedRegion??save.region;
  const filmKind: Region = finaleReplay?.region ?? (save.castleEnding === "film" ? "castle" : save.townEnding === "film" ? "town" : save.farmlandEnding === "film" ? "farmland" : save.demoEnding === "film" ? "gatehouse" : save.transition?.from === "caravan" ? "caravan" : "oasis");
  const filmContent = CHAPTER_FINALES[filmKind];

  function clearFinaleReplay() {
    finaleReplayRef.current = null;
    finaleReplayFinishing.current = false;
    setFinaleReplay(null);
  }

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
      passGeneration.current++;
      finaleReplayRef.current = null;
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
  useEffect(() => {
    if (overlay !== "dunePass") return;
    const returned = () => { if (!document.hidden && Date.now()-lastPassRefresh.current>5_000) void refreshPass(true); };
    window.addEventListener("focus",returned);
    document.addEventListener("visibilitychange",returned);
    return () => { window.removeEventListener("focus",returned); document.removeEventListener("visibilitychange",returned); };
  }, [overlay]);

  const unlockedTracks = getUnlockedSoundtracks(save);
  const selectedTrack = playtest ? playtestTrack : trackPreference;
  const effectiveTrack = selectedTrack === "auto" || unlockedTracks.includes(selectedTrack) ? selectedTrack : "auto";
  useEffect(() => {
    if (ready) sound.current?.setScene(displayRegion, effectiveTrack, overlay === "film");
  }, [ready, displayRegion, effectiveTrack, overlay]);

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
      replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
      abandonRecord("used-portal-save"); activeRecord.current=null; setRevealing(false); skipReveal.current=null;
      current.profile=result.profile; current.pending=[]; cloudConflict.current=false;
      const loaded=normalizeSave(result.profile.campaign); saveRef.current=loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse")); cacheCloud(); setCloudStatus("account"); setCloudMessage(null);
      setMode("map"); setPuzzle(null); setOverlay("start"); setSettings(false); setAttempt(value=>value+1);
      void refreshFarmland(current);
    } catch (error) { setCloudMessage(`Portal save could not load: ${(error as Error).message}`); }
  }
  function clearCampaignPass() { passRequest.current++; passRef.current=null; setCampaignPass(null); }
  function publishCampaignPass(account: NonNullable<typeof cloudRef.current>, generation: number, request: number, value: cloudApi.CampaignPass) {
    if (cloudRef.current!==account || cloudGeneration.current!==generation || passRequest.current!==request) return null;
    passRef.current={accountId:account.accountId,generation,value}; setCampaignPass(value);
    return value;
  }
  function currentCampaignPass() {
    const current=cloudRef.current, published=passRef.current;
    return current && published?.accountId===current.accountId && published.generation===cloudGeneration.current ? published.value : null;
  }
  function clearFarmland() { farmlandGeneration.current++; passGeneration.current++; farmlandClaimId.current=null; farmlandClaiming.current=false; setFarmland(null); setFarmlandState("idle"); setFarmlandError(null); clearCampaignPass(); setPassError(null); setPassChecking(false); }
  async function refreshPass(refresh = false) {
    const current=cloudRef.current;
    if (!current || playtest) return;
    const generation=++passGeneration.current, accountGeneration=cloudGeneration.current, request=++passRequest.current;
    if (refresh) lastPassRefresh.current=Date.now();
    setPassChecking(true); setPassError(null);
    try {
      const result=await cloudApi.entitlements(current.accountId,refresh);
      if (cloudRef.current!==current || passGeneration.current!==generation) return;
      publishCampaignPass(current,accountGeneration,request,result.campaignPass);
    } catch (error) {
      if (cloudRef.current!==current || cloudGeneration.current!==accountGeneration || passGeneration.current!==generation || passRequest.current!==request) return;
      setPassError((error as Error).message);
    } finally { if (passGeneration.current===generation) setPassChecking(false); }
  }
  async function verifyTownPass(): Promise<boolean> {
    if (playtest) return true;
    const account=cloudRef.current, generation=cloudGeneration.current;
    if (!account || cloudStatus === "expired") return false;
    const request=++passRequest.current;
    try {
      const result=await cloudApi.entitlements(account.accountId,true);
      if (cloudRef.current!==account || cloudGeneration.current!==generation) return false;
      const published=publishCampaignPass(account,generation,request,result.campaignPass);
      if (published) setPassError(null);
      return published?.state === "active";
    } catch(error) {
      if (cloudRef.current!==account || cloudGeneration.current!==generation) return false;
      if (passRequest.current===request) setPassError((error as Error).message);
      return false;
    }
  }
  async function refreshFarmland(current = cloudRef.current) {
    if (!current || playtest || farmlandClaiming.current) return;
    const generation=++farmlandGeneration.current, accountGeneration=cloudGeneration.current, request=++passRequest.current;
    setFarmlandState("loading"); setFarmlandError(null);
    try {
      const result=await cloudApi.entitlements(current.accountId);
      if (cloudRef.current!==current || farmlandGeneration.current!==generation) return;
      setFarmland(result); setFarmlandState("idle");
      publishCampaignPass(current,accountGeneration,request,result.campaignPass);
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
    const purchase=pendingAttempt.current && (pendingAttempt.current.cost > 0 || usesSelectableCompanion(pendingAttempt.current.level)) && saveRef.current.completed.indexOf(pendingAttempt.current.level) === -1
      ? {attemptId:pendingAttempt.current.cloudAttemptId,levelId:pendingAttempt.current.level,boosters:pendingAttempt.current.selected,companionSnapshot:pendingAttempt.current.companionSnapshot} : undefined;
    if (current && !cloudApi.writeAccountCache(current.accountId, { profile: current.profile, localSave: saveRef.current, pending: current.pending, purchase })) setCloudMessage("This browser could not store the pending save. Keep this tab open until it syncs.");
  }
  async function initializeCloud(testing: boolean) {
    if (testing) { setCloudStatus("guest"); return; }
    replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
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
      setFarmland(null); clearCampaignPass(); void refreshFarmland(cloudRef.current);
      if (cached?.purchase && LEVELS[cached.purchase.levelId] && Array.isArray(cached.purchase.boosters)) {
        try {
          const source=LEVELS[cached.purchase.levelId];
          const prepared=prepareStartingBoosters(createPuzzle(usesSelectableCompanion(source.id) && cached.purchase.companionSnapshot ? castleLevelForCompanion(source,cached.purchase.companionSnapshot) : source),cached.purchase.boosters);
          pendingAttempt.current={token:0,cloudAttemptId:cached.purchase.attemptId,sceneAttempt:-1,level:cached.purchase.levelId,selected:cached.purchase.boosters,cost:boosterCost(cached.purchase.boosters),puzzle:prepared.puzzle,placements:prepared.placements,companionSnapshot:cached.purchase.companionSnapshot??null,status:"failed"};
          setCloudMessage(cached.purchase.boosters.length ? "An earlier booster purchase needs confirmation. Retry the same loadout when you enter that level." : "This chapter level is ready to restart with your chosen raid member.");
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
      replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
      current.profile=response.profile; const loaded=normalizeSave(response.profile.campaign); saveRef.current=loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse")); setCloudStatus("account"); setOverlay("start"); cacheCloud(); setCloudMessage(null);
      void refreshFarmland(current);
    } catch (error) { setCloudStatus("account"); setCloudMessage((error as Error).message); }
  }
  function startFreshPortalCampaign() {
    const current=cloudRef.current; if (!current) return;
    replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
    const fresh={...EMPTY_SAVE,completed:[],companions:[]};
    saveRef.current=fresh; setSave(fresh); setKeeperMet(false);
    current.pending.push({kind:"checkpoint",requestId:cloudApi.newOperationId(),campaign:fresh});
    cacheCloud(); void flushCloud(); setOverlay("start");
  }
  async function signOut() {
    if (cloudRef.current?.pending.length) { setCloudMessage("Wait for your campaign to sync before signing out."); return; }
    try { await cloudApi.logout(cloudRef.current?.accountId ?? cloudApi.rememberedAccount() ?? ""); } catch { setCloudMessage("Could not sign out. Try again when connected."); return; }
    replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
    switchStatsArchive(campaignArchiveKey());
    cloudGeneration.current++; cloudRef.current=null; cloudConflict.current=false; clearFarmland(); cloudApi.rememberAccount(null); setPortalName(null); setCloudStatus("guest"); setCloudMessage(null);
    const guest=readSave(); saveRef.current=guest; setSave(guest); setMode("map"); setPuzzle(null); setOverlay("start"); setSettings(false); setAttempt(value=>value+1);
  }
  function continueAsGuest() {
    replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
    switchStatsArchive(campaignArchiveKey());
    cloudGeneration.current++; cloudRef.current=null; cloudConflict.current=false; clearFarmland(); cloudApi.rememberAccount(null); setPortalName(null); setCloudStatus("guest"); setCloudMessage(null);
    const guest=readSave(); saveRef.current=guest; setSave(guest); setKeeperMet(guest.completed.includes("pumpHouse")); setMode("map"); setPuzzle(null); setOverlay("start"); setSettings(false); setAttempt(value=>value+1);
  }
  function commitWin(levelId: LevelId, movesRemaining: number) {
    if (replayActive) return;
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
    return value.riverEnding === "thanks" ? "riverOpen"
      : value.castleEnding === "film" ? "film"
      : value.castleEnding === "thanks" ? "castleOpen"
      : value.townEnding === "film" ? "film"
      : value.townEnding === "thanks" ? "townOpen"
      : value.farmlandEnding === "film" ? "film"
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
    if (installApp.isAppWindow) { lockLandscape(); return; }
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
      if (source === "manual") setFullscreenIssue("Fullscreen couldn't open. You can keep playing in this window.");
      return;
    }
    const token = ++fullscreenToken.current;
    const started = performance.now();
    const timer = setTimeout(() => {
      if (fullscreenPending.current?.token !== token) return;
      finishFullscreenAttempt();
      if (document.fullscreenElement) { setIsFullscreen(true); setFullscreenIssue(null); return; }
      logDiagnostic("fullscreen-timeout", { ...details, elapsedMs: Math.round(performance.now() - started) });
      if (source === "manual") setFullscreenIssue("Fullscreen didn't open. You can keep playing in this window.");
    }, 5_000);
    fullscreenPending.current = { token, started, timer };
    if (source === "manual") setFullscreenIssue("Opening fullscreen…");
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
      else { logDiagnostic("fullscreen-failed", { ...details, name: "NoFullscreenElement" }); if (source === "manual") setFullscreenIssue("Fullscreen didn't open. You can keep playing in this window."); }
    }).catch(error => {
      if (fullscreenPending.current?.token !== token) return;
      finishFullscreenAttempt();
      logDiagnostic("fullscreen-failed", { ...details, name: String(error?.name ?? "Error").slice(0, 60), message: String(error?.message ?? error).slice(0, 160) });
      if (source === "manual") setFullscreenIssue("Fullscreen couldn't open. You can keep playing in this window.");
      setFullscreenEmbeddedBlocked(embedded && !document.fullscreenEnabled);
    });
  }
  function enter() {
    if (window.matchMedia("(pointer: coarse) and (hover: none)").matches && !installApp.isAppWindow) requestGameFullscreen("intro");
    else if (installApp.isAppWindow) lockLandscape();
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
    if (visitedRegion) { setVisitedRegion(null); return; }
    setTutorialSession(null); setTutorialLibrary(false);
    tokenCounter.current++;
    if (pendingAttempt.current?.level !== id || pendingAttempt.current.cost === 0 && !["castle","river"].includes(LEVELS[id].chapter ?? "oasis")) pendingAttempt.current = null;
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
    if ((LEVELS[id].chapter === "town" || LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && !playtest) { const allowed = await verifyTownPass(); if (!allowed) { setShopError("Sign in and activate the Dune Pass to play this chapter."); return; } }
    if (LEVELS[id].chapter === "farmland" && !playtest && !(farmland?.farmland.unlocked && farmland.accountId === cloudRef.current?.accountId)) { setShopError("Sign in and unlock Farmland first."); return; }
    if ((LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && (!(LEVELS[id].chapter === "river" ? saveRef.current.riverReady : saveRef.current.castleReady) || !saveRef.current.activeCompanion)) { setShopError("Choose an active raid member before entering this chapter."); setOverlay("party"); return; }
    const cost = boosterCost(selected);
    if (cost > saveRef.current.coins && !pendingAttempt.current?.cost) { setShopError("Not enough coins for this loadout."); return; }
    const restored=pendingAttempt.current?.status === "failed" && pendingAttempt.current.level === id && (LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && JSON.stringify([...pendingAttempt.current.selected].sort()) === JSON.stringify([...selected].sort()) ? pendingAttempt.current : null;
    const chosenSnapshot = restored?.companionSnapshot ?? ((LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && saveRef.current.activeCompanion ? companionSnapshot(saveRef.current.activeCompanion) : null);
    let prepared: ReturnType<typeof prepareStartingBoosters>;
    try { prepared = prepareStartingBoosters(createPuzzle(chosenSnapshot ? castleLevelForCompanion(LEVELS[id],chosenSnapshot) : LEVELS[id]), selected); }
    catch (error) { setShopError(String(error)); return; }
    const token = ++tokenCounter.current;
    const unresolved = pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0 ? pendingAttempt.current : null;
    if (unresolved && (unresolved.level !== id || JSON.stringify([...unresolved.selected].sort()) !== JSON.stringify([...selected].sort()))) {
      setShopError("Retry the same purchase first so its coin charge can be confirmed."); return;
    }
    const cloudAttemptId = unresolved?.cloudAttemptId ?? restored?.cloudAttemptId ?? cloudApi.newOperationId();
    if (cloudRef.current && !playtest) {
      if (cloudRef.current.pending.length) { setShopError("Your last move is still syncing. Reconnect before starting a new level."); return; }
      if (cost > 0 || LEVELS[id].chapter === "farmland" || LEVELS[id].chapter === "town" || LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") {
        try { const response=await cloudApi.prepareAttempt(cloudAttemptId,id,[...selected],cloudRef.current.accountId,chosenSnapshot?.id); if (!sameCompanionSnapshot(response.companionSnapshot,chosenSnapshot)) throw new Error("The active raid member changed. Reload your save."); }
        catch (error) { setShopError(`Could not prepare this level: ${(error as Error).message}`); return; }
        if (token !== tokenCounter.current) return;
      }
    }
    pendingAttempt.current = { token, cloudAttemptId, sceneAttempt: attempt + 1, level: id, selected: [...selected], cost, puzzle: prepared.puzzle, placements: prepared.placements, companionSnapshot:chosenSnapshot, status: "prepared" };
    if (cloudRef.current && (cost > 0 || LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river")) cacheCloud();
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
    if (unresolved && (unresolved.cost > 0 || usesSelectableCompanion(unresolved.level))) { setShopLevel(unresolved.level); setShopSelected(unresolved.selected); setShopError(unresolved.cost > 0 ? "Retry this purchase to confirm its coin charge. It will not charge twice." : "Retry this level with the saved raid member."); }
    else { pendingAttempt.current=null; setShopSelected([]); setShopError("The purchase could not be saved. Choose no boosters to play for free, or try again after storage is available."); }
    void transitionTo(() => { setMode("map"); setPuzzle(null); setOverlay("shop"); setAttempt(value => value + 1); });
  }
  async function authorizeSceneReady(): Promise<boolean> {
    if (replayActive) {
      const session=replaySession.current;
      return Boolean(mode==="puzzle" && session && session.token===replayToken.current && session.sceneAttempt===attempt && session.level===activeLevel && session.generation===cloudGeneration.current && session.accountId===(cloudRef.current?.accountId??null) && replayAllowed(saveRef.current,session.level,{farmland:session.farmlandUnlocked,town:session.townUnlocked,castle:session.townUnlocked,river:session.townUnlocked}));
    }
    const current = pendingAttempt.current;
    if (mode !== "puzzle") return true;
    if (!current || current.sceneAttempt !== attempt || current.level !== activeLevel || current.status === "failed") return false;
    if (current.status === "committed") return true;
    if ((!cloudRef.current || playtest) && current.cost > saveRef.current.coins) { current.status = "failed"; setSceneIssue("Not enough coins for this loadout."); return false; }
    if (cloudRef.current && !playtest && (current.cost > 0 || LEVELS[current.level].chapter === "farmland" || LEVELS[current.level].chapter === "town" || LEVELS[current.level].chapter === "castle" || LEVELS[current.level].chapter === "river")) {
      const account = cloudRef.current;
      authorizing.current=true;
      try {
        const response = await cloudApi.activateAttempt(current.cloudAttemptId,account.profile.revision,account.accountId);
        if (cloudRef.current !== account) return false;
        account.profile=response.profile;
        const next={...saveRef.current,coins:response.profile.campaign.coins};
        saveRef.current=next; setSave(next); cacheCloud();
        if (pendingAttempt.current !== current || current.status !== "prepared" || response.status !== "active" || !sameCompanionSnapshot(response.companionSnapshot,current.companionSnapshot)) return false;
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
    if ((LEVELS[current.level].chapter === "town" || LEVELS[current.level].chapter === "castle" || LEVELS[current.level].chapter === "river") && !playtest && !cloudRef.current) { current.status = "failed"; setSceneIssue("Sign in and activate the Dune Pass to play this chapter."); return false; }
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
    if (event.type === "gateOpened" && transitioning.current) { if (!visitedRegion) gateOpenedPending.current = true; return; }
    if (transitioning.current) return;
    if ("position" in event) mapPositions.current[displayRegion] = event.position;
    if (event.type === "playReady") { if (archiveKey.current && !activeRecord.current) { const snapshot=(level.chapter==="castle" || level.chapter==="river") ? (pendingAttempt.current?.companionSnapshot ?? (saveRef.current.activeCompanion ? companionSnapshot(saveRef.current.activeCompanion) : null)) : null; activeRecord.current = startAttempt(level, puzzle ?? createPuzzle(level), new Date(), replayActive ? [] : pendingAttempt.current?.selected ?? [], replayActive ? 0 : pendingAttempt.current?.cost ?? 0, replayActive ? "replay" : playtest ? "sandbox" : "campaign",snapshot); storeRecord(); if (!settings && !tutorialLibrary && !tutorialSession && overlay === null && wipe === "hidden") recordResume(); } return; }
    if (event.type === "gateOpened") { if (!visitedRegion && saveRef.current.demoEnding === "gate") { if (transitioning.current) gateOpenedPending.current = true; else beginDemoFilm(); } return; }
    if (event.type === "resolvedTurn") {
      // Commit a terminal reward when the rule engine accepts the move. If the
      // renderer is interrupted during its animation, a reload keeps the win.
      if (!replayActive && event.turn.state.status === "won") commitWin(activeLevel,event.turn.state.moves);
      if (activeRecord.current) { recordPause(); activeRecord.current = appendTurn(activeRecord.current, event.turn, event.from, event.to); if (event.turn.state.status !== "playing") { activeRecord.current = finishAttempt(activeRecord.current, event.turn.state.status, "goals-or-moves"); } storeRecord(); }
      return;
    }
    if (event.type === "replayDestination") {
      const group=replayGroups.find(item=>item.destination===event.destination);
      if (group) {setReplayChoices(group.levels);setReplaySelection(group.levels[0]);}
      if (!group || pendingAttempt.current?.cost && !saveRef.current.completed.includes(pendingAttempt.current.level)) { setReplayError("Resolve the pending booster purchase before replaying."); setOverlay("replayBriefing"); return; }
      setReplayError(null);
      setOverlay("replayPicker"); sound.current?.play("ui"); return;
    }
    if (event.type === "skiff") { setOverlay(saveRef.current.completed.includes("riverBend") ? "companionChat" : "skiff"); if (saveRef.current.completed.includes("riverBend")) { const pending=nextLevel(saveRef.current.completed); const line=selectCompanionLine("river", pending && LEVELS[pending].chapter==="river"?pending:null,companionVisits.current.river++,lastCompanionLine.current.river); lastCompanionLine.current.river=line.id; setCompanionLine(line); } sound.current?.play("ui"); return; }
    if (event.type === "quartermaster") { setOverlay("quartermaster"); sound.current?.play("ui"); return; }
    if (event.type === "keeper" || event.type === "fieldkeeper" || event.type === "towncrier" || event.type === "gatewright" || event.type === "wayfinder") {
      const region: Region = event.type === "keeper" ? "oasis" : event.type === "wayfinder" ? "caravan" : event.type === "gatewright" ? "gatehouse" : event.type === "towncrier" ? "town" : "farmland";
      const introduced = region === "oasis" ? keeperMet : region === "caravan" ? saveRef.current.oasisTransition === "ready" : region === "gatehouse" ? saveRef.current.gatehouseReady : region === "town" ? saveRef.current.townReady : saveRef.current.farmlandReady;
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
      if (displayRegion === "river") {
        if (next === "riverBend" && !saveRef.current.riverReady) setOverlay("skiff");
        else if (next && LEVELS[next].chapter === "river") { if (!saveRef.current.activeCompanion) setOverlay("party"); else { setOverlay("briefing"); sound.current?.play("ui"); } }
        return;
      }
      if (displayRegion === "castle") {
        if (next === "castleReceivingDock" && !saveRef.current.castleReady) setOverlay("quartermaster");
        else if (next && LEVELS[next].chapter === "castle") { if (!saveRef.current.activeCompanion) setOverlay("party"); else { setOverlay("briefing"); sound.current?.play("ui"); } }
        return;
      }
      if (displayRegion === "town") {
        if (next === "marketArrival" && !saveRef.current.townReady) setOverlay("towncrier");
        else if (next && LEVELS[next].chapter === "town") { setOverlay("briefing"); sound.current?.play("ui"); }
        return;
      }
      if (displayRegion === "farmland") {
        if (next === "seedStore" && !saveRef.current.farmlandReady) setOverlay("fieldkeeper");
        else if (next && LEVELS[next].chapter === "farmland") { setOverlay("briefing"); sound.current?.play("ui"); }
        return;
      }
      if (displayRegion === "gatehouse") {
        if (next === "gatehouseApproach" && !saveRef.current.gatehouseReady) setOverlay("gatewright");
        else if (next && LEVELS[next].chapter === "gatehouse") { setOverlay("briefing"); sound.current?.play("ui"); }
        return;
      }
      if (displayRegion === "caravan") {
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
      if (!replayActive) commitWin(activeLevel,event.puzzle.moves);
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
    if (saveRef.current.castleEnding === "film") { persist(normalizeSave({ ...saveRef.current, castleEnding: "thanks" })); setOverlay("castleOpen"); return; }
    if (saveRef.current.castleEnding === "thanks") return;
    if (saveRef.current.townEnding === "film") { persist(normalizeSave({ ...saveRef.current, townEnding: "thanks" })); setOverlay("townOpen"); return; }
    if (saveRef.current.townEnding === "thanks") return;
    if (saveRef.current.farmlandEnding === "film") { persist(normalizeSave({ ...saveRef.current, farmlandEnding: "thanks" })); setOverlay("harvestOpen"); return; }
    if (saveRef.current.farmlandEnding === "thanks") return;
    if (saveRef.current.demoEnding === "film") { persist(normalizeSave({ ...saveRef.current, demoEnding: "thanks" })); setOverlay("demoThanks"); return; }
    if (saveRef.current.transition?.from === "caravan" && saveRef.current.transition.stage === "film") { persist(advanceChapterTransition(saveRef.current, "film", "handoff")); setOverlay("handoff"); return; }
    if (saveRef.current.oasisTransition !== "film") { setOverlay(null); return; }
    checkpoint("film", "keeper");
    setOverlay("handoff");
  }
  function acceptHandoff() {
    if (saveRef.current.transition?.from === "castle") { persist(advanceChapterTransition(saveRef.current, "handoff", "atlas")); setOverlay("atlas"); return; }
    if (saveRef.current.transition?.from === "town") { persist(advanceChapterTransition(saveRef.current, "handoff", "atlas")); setOverlay("atlas"); return; }
    if (saveRef.current.transition?.from === "farmland") { persist(advanceChapterTransition(saveRef.current, "handoff", "atlas")); setOverlay("atlas"); return; }
    if (saveRef.current.transition?.from === "gatehouse") { persist(advanceChapterTransition(saveRef.current, "handoff", "atlas")); setOverlay("atlas"); return; }
    if (saveRef.current.transition?.from === "caravan") { persist(advanceChapterTransition(saveRef.current, "handoff", "atlas")); setOverlay("atlas"); return; }
    checkpoint("keeper", "atlas");
    setOverlay("atlas");
  }
  function travelToCaravan() {
    if (saveRef.current.transition?.from === "castle") { persist(advanceChapterTransition(saveRef.current, "atlas", "arrival")); void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); }); return; }
    if (saveRef.current.transition?.from === "town") { persist(advanceChapterTransition(saveRef.current, "atlas", "arrival")); void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); }); return; }
    if (saveRef.current.transition?.from === "farmland") { persist(advanceChapterTransition(saveRef.current, "atlas", "arrival")); void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); }); return; }
    if (saveRef.current.transition?.from === "gatehouse") { persist(advanceChapterTransition(saveRef.current, "atlas", "arrival")); void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); }); return; }
    if (saveRef.current.transition?.from === "caravan") { persist(advanceChapterTransition(saveRef.current, "atlas", "arrival")); void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); }); return; }
    checkpoint("atlas", "arrival");
    void transitionTo(() => {
      setMode("map"); setOverlay(null); setAttempt(value => value + 1);
    });
  }
  function visitRegion(region: Region) {
    if (saveRef.current.oasisTransition !== "ready" || region === "gatehouse" && !saveRef.current.gatehouseReady || region === "farmland" && !saveRef.current.farmlandReady || region === "town" && !saveRef.current.townReady || region === "castle" && !saveRef.current.castleReady || region === "river" && !saveRef.current.riverReady) return;
    const passActive=Boolean(playtest || currentCampaignPass()?.state==="active");
    if ((region === "town" || region === "castle" || region === "river") && !passActive) return;
    if (region === "farmland" && !playtest && !(farmland?.accountId===cloudRef.current?.accountId && farmland?.farmland.unlocked)) return;
    if (region!==saveRef.current.region && chapterReplayReady(saveRef.current,region,{farmland:Boolean(playtest ? farmlandPreview : cloudRef.current && farmland?.accountId===cloudRef.current.accountId && farmland.farmland.unlocked),town:passActive,castle:passActive,river:passActive})) setVisitedRegion(region);
    else if (region===saveRef.current.region) setVisitedRegion(null);
    else persist({ ...saveRef.current, region });
    void transitionTo(() => { setMode("map"); setOverlay(null); setAttempt(value => value + 1); });
  }
  function continueJourney() {
    if (!visitedRegion || transitioning.current) return;
    void transitionTo(()=>{ setVisitedRegion(null); setOverlay(null); setAttempt(value=>value+1); });
  }
  function cancelReplayAuthorization() { replayToken.current++; launching.current=false; setReplayChecking(false); }
  function closeReplayDialog() { cancelReplayAuthorization(); setReplayError(null); setOverlay(null); setAttempt(value=>value+1); }
  async function verifyReplayAccess(region: Region, token: number, account: typeof cloudRef.current, generation: number) {
    let farmlandUnlocked=Boolean(playtest ? farmlandPreview : account && farmland?.accountId===account.accountId && farmland.farmland.unlocked);
    let townUnlocked=Boolean(playtest);
    if ((region==="town" || region==="castle" || region==="river") && !playtest) {
      if (!account) { setReplayError("Sign in to replay this chapter."); return null; }
      const request=++passRequest.current;
      const result=await cloudApi.entitlements(account.accountId,true);
      if (cloudRef.current!==account || cloudGeneration.current!==generation || token!==replayToken.current) return null;
      townUnlocked=publishCampaignPass(account,generation,request,result.campaignPass)?.state==="active";
    }
    if (region==="farmland" && !playtest) {
      if (!account) { setReplayError("Sign in to replay Farmland."); return null; }
      const result=await cloudApi.entitlements(account.accountId);
      if (cloudRef.current!==account || cloudGeneration.current!==generation || token!==replayToken.current) return null;
      setFarmland(result); farmlandUnlocked=result.farmland.unlocked;
    }
    return { farmland: farmlandUnlocked, town: townUnlocked, castle: townUnlocked, river: townUnlocked };
  }
  async function launchChapterReplay(id: LevelId, again = false) {
    if (launching.current || transitioning.current || replayActive && !again) return;
    const pending=pendingAttempt.current;
    if (pending?.cost && !saveRef.current.completed.includes(pending.level)) {setReplayError("Resolve the pending booster purchase before replaying.");return;}
    const account=cloudRef.current; const generation=cloudGeneration.current; const token=++replayToken.current;
    launching.current=true; setReplayError(null);
    try {
      const region=LEVELS[id].chapter??"oasis";
      const access=await verifyReplayAccess(region,token,account,generation);
      if (!access) return;
      if (cloudRef.current!==account || cloudGeneration.current!==generation || token!==replayToken.current || !replayAllowed(saveRef.current,id,access) || region!==displayRegion) {setReplayError("This chapter is not available for replay.");return;}
      const puzzle=createPuzzle((LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && saveRef.current.activeCompanion ? castleLevelForCompanion(LEVELS[id],companionSnapshot(saveRef.current.activeCompanion)) : LEVELS[id]);
      reward.current=0; setRevealing(false); abandonRecord("started-replay"); activeRecord.current=null;
      replaySession.current={token,generation,accountId:account?.accountId??null,level:id,sceneAttempt:attempt+1,farmlandUnlocked:access.farmland,townUnlocked:access.town};
      setReplayActive(true);
      void transitionTo(()=>{setActiveLevel(id);setPuzzle(puzzle);setMode("puzzle");setOverlay(null);setAttempt(value=>value+1);});
    } catch(error) {if (cloudRef.current===account && cloudGeneration.current===generation && token===replayToken.current) setReplayError(`Replay access could not be checked: ${(error as Error).message}`);}
    finally {if(token===replayToken.current) launching.current=false;}
  }
  async function launchFinaleReplay() {
    if (launching.current || transitioning.current || mode!=="map" || overlay!=="replayBriefing" || !replayChoices.includes(replaySelection) || !isChapterFinalLevel(replaySelection)) return;
    const region=LEVELS[replaySelection].chapter??"oasis";
    if (!CHAPTER_FINALES[region] || region!==displayRegion) return;
    const pending=pendingAttempt.current;
    if (pending?.cost && !saveRef.current.completed.includes(pending.level)) {setReplayError("Resolve the pending booster purchase before replaying.");return;}
    const account=cloudRef.current, generation=cloudGeneration.current, token=++replayToken.current;
    launching.current=true; setReplayChecking(true); setReplayError(null);
    try {
      const access=await verifyReplayAccess(region,token,account,generation);
      if (!access) return;
      if (cloudRef.current!==account || cloudGeneration.current!==generation || token!==replayToken.current || !chapterReplayReady(saveRef.current,region,access) || region!==displayRegion || overlay!=="replayBriefing" || !isChapterFinalLevel(replaySelection)) {setReplayError("This chapter is not available for replay.");return;}
      const session: FinaleReplay={token,generation,accountId:account?.accountId??null,region};
      finaleReplayFinishing.current=false;
      void transitionTo(()=>{
        if (cloudRef.current!==account || cloudGeneration.current!==generation || token!==replayToken.current) return;
        finaleReplayRef.current=session; setFinaleReplay(session);
        setMode("map"); setOverlay("film"); setAttempt(value=>value+1);
      },false);
    } catch(error) {if (cloudRef.current===account && cloudGeneration.current===generation && token===replayToken.current) setReplayError(`Replay access could not be checked: ${(error as Error).message}`);}
    finally {if(token===replayToken.current){launching.current=false;setReplayChecking(false);}}
  }
  function launchPlaytestFinaleReplay() {
    if (!playtest || transitioning.current || !isChapterFinalLevel(replaySelection)) return;
    const region=LEVELS[replaySelection].chapter??"oasis";
    if (!CHAPTER_FINALES[region]) return;
    const session: FinaleReplay={token:++replayToken.current,generation:cloudGeneration.current,accountId:cloudRef.current?.accountId??null,region,returnTo:"settings"};
    finaleReplayFinishing.current=false;
    void transitionTo(()=>{
      finaleReplayRef.current=session;setFinaleReplay(session);
      setMode("map");setOverlay("film");setAttempt(value=>value+1);
    },false);
  }
  function finishFinaleReplay(token: number) {
    const session=finaleReplayRef.current;
    if (!session || session.token!==token || finaleReplayFinishing.current || transitioning.current) return;
    if (session.generation!==cloudGeneration.current || session.accountId!==(cloudRef.current?.accountId??null)) {clearFinaleReplay();return;}
    finaleReplayFinishing.current=true;
    film.current?.pause();
    void transitionTo(()=>{
      if (finaleReplayRef.current?.token!==token) return;
      if (cloudGeneration.current!==session.generation || session.accountId!==(cloudRef.current?.accountId??null)) { clearFinaleReplay(); return; }
      clearFinaleReplay();
      setMode("map"); setOverlay(session.returnTo==="settings"?null:"replayPicker");
      if (session.returnTo==="settings") setSettings(true);
      setAttempt(value=>value+1);
    });
  }
  function openTown() { persist(advanceChapterTransition(saveRef.current, "arrival", "ready")); startLevel("marketArrival"); }
  function openRiver() { if (saveRef.current.transition?.to === "river" && saveRef.current.transition.stage === "arrival") persist(advanceChapterTransition(saveRef.current,"arrival","ready")); startLevel("riverBend"); }
  function openCastle() { persist(advanceChapterTransition(saveRef.current, "arrival", "ready")); setOverlay("party"); }
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
  function retry() { abandonRecord("retry"); activeRecord.current = null; setRevealing(false); if(replayActive) void launchChapterReplay(activeLevel,true); else startLevel(activeLevel); }
  function replayLevel(id: LevelId) {
    abandonRecord("replay"); activeRecord.current = null;
    if (playtest) {
        const chapter = LEVELS[id].chapter ?? "oasis";
        const completed = LEVEL_ORDER.slice(0, LEVEL_ORDER.indexOf(id)) as LevelId[];
        persist(normalizeSave({ ...saveRef.current, completed, region: chapter,
          oasisTransition: chapter !== "oasis" ? "ready" : "locked", gatehouseReady: ["gatehouse","farmland","town","castle","river"].includes(chapter), farmlandReady: ["farmland","town","castle","river"].includes(chapter), townReady: ["town","castle","river"].includes(chapter), castleReady: ["castle","river"].includes(chapter), riverReady: chapter === "river", activeCompanion: ["castle","river"].includes(chapter) ? saveRef.current.activeCompanion ?? "keeper" : null, transition: null, demoEnding: ["farmland","town","castle","river"].includes(chapter) ? "done" : "locked", farmlandEnding: ["town","castle","river"].includes(chapter) ? "done" : "locked", townEnding: ["castle","river"].includes(chapter) ? "done" : "locked", castleEnding: chapter === "river" ? "done" : "locked", riverEnding: "locked",
          companions: ["town","castle","river"].includes(chapter) ? ["keeper", "wayfinder", "gatewright", "fieldkeeper", "towncrier"] : chapter === "farmland" ? ["keeper", "wayfinder", "gatewright", "fieldkeeper"] : chapter === "gatehouse" ? ["keeper", "wayfinder", "gatewright"] : chapter === "caravan" ? ["keeper", "wayfinder"] : completed.length ? ["keeper"] : [] }));
        setKeeperMet(completed.includes("pumpHouse"));
    }
    setSettings(false); startLevel(id); setShopReturn(null);
  }
  function leaveBoard(reason: string) {
    if (transitioning.current) return;
    setSettings(false); setRevealing(false); skipReveal.current = null;
    sound.current?.stopTransientSounds();
    abandonRecord(reason); activeRecord.current = null;
    if (replayActive) {
      replaySession.current=null;setReplayActive(false);reward.current=0;
      void transitionTo(()=>{setMode("map");setPuzzle(null);setOverlay(null);setAttempt(value=>value+1);});
      return;
    }
    const chapterEnd = activeLevel === "openWaterway" && saveRef.current.oasisTransition === "film" || activeLevel === "lightTheRoute" && saveRef.current.transition?.from === "caravan" && saveRef.current.transition.stage === "film" || activeLevel === "openTheHarvestRoad" && saveRef.current.farmlandEnding === "film" || activeLevel === "openTheMarket" && saveRef.current.townEnding === "film" || activeLevel === "openTheUpstreamRoute" && saveRef.current.castleEnding === "film";
    const harvestOpen = activeLevel === "openTheHarvestRoad" && saveRef.current.farmlandEnding === "thanks";
    const townOpen = activeLevel === "openTheMarket" && saveRef.current.townEnding === "thanks";
    const castleOpen = activeLevel === "openTheUpstreamRoute" && saveRef.current.castleEnding === "thanks";
    const riverOpen = activeLevel === "openTheCollectionRoute" && saveRef.current.riverEnding === "thanks";
    void transitionTo(() => {
        pendingAttempt.current = null; cacheCloud(); setShopSelected([]); setShopError(null);
        setMode("map"); setPuzzle(null); setAttempt(value => value + 1); setOverlay(chapterEnd ? "film" : harvestOpen ? "harvestOpen" : townOpen ? "townOpen" : castleOpen ? "castleOpen" : riverOpen ? "riverOpen" : null);
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
      completed: LEVEL_ORDER.slice(0,40) as LevelId[], oasisTransition: "ready", transition: null,
      gatehouseReady: true, farmlandReady: true, region: "farmland", demoEnding: "done", farmlandEnding: "film",
    });
    void transitionTo(() => {
      pendingAttempt.current = null; setShopSelected([]); setShopError(null); setPuzzle(null);
      persist(preview); setMode("map"); setOverlay("film"); setAttempt(value => value + 1);
    }, false);
  }
  function previewTownStory() {
    if (!playtest || transitioning.current) return;
    abandonRecord("preview-transition"); activeRecord.current = null;
    setSettings(false); setRevealing(false); skipReveal.current = null;
    sound.current?.stopTransientSounds();
    const preview = normalizeSave({ ...saveRef.current,
      completed: LEVEL_ORDER.slice(0, 40) as LevelId[], oasisTransition: "ready", gatehouseReady: true,
      farmlandReady: true, demoEnding: "done", farmlandEnding: "done", townReady: false, townEnding: "locked",
      region: "farmland", transition: { from: "farmland", to: "town", stage: "handoff" },
    });
    void transitionTo(() => {
      pendingAttempt.current = null; setShopSelected([]); setShopError(null); setPuzzle(null);
      persist(preview); setMode("map"); setOverlay("handoff"); setAttempt(value => value + 1);
    });
  }
  function previewTownEnding() {
    if (!playtest || transitioning.current) return;
    abandonRecord("preview-transition"); activeRecord.current = null;
    setSettings(false); setRevealing(false); skipReveal.current = null;
    sound.current?.stopTransientSounds();
    const preview = normalizeSave({ ...saveRef.current,
      completed: LEVEL_ORDER.slice(0,50) as LevelId[], oasisTransition: "ready", gatehouseReady: true,
      farmlandReady: true, demoEnding: "done", farmlandEnding: "done", townReady: true, townEnding: "film",
      region: "town", transition: null,
    });
    void transitionTo(() => {
      pendingAttempt.current = null; setShopSelected([]); setShopError(null); setPuzzle(null);
      persist(preview); setMode("map"); setOverlay("film"); setAttempt(value => value + 1);
    }, false);
  }
  function previewCastleStory() {
    if (!playtest || transitioning.current) return;
    abandonRecord("preview-transition"); activeRecord.current=null;
    setSettings(false); setRevealing(false); skipReveal.current=null;
    const preview=normalizeSave({...saveRef.current,completed:LEVEL_ORDER.slice(0,50) as LevelId[],oasisTransition:"ready",gatehouseReady:true,farmlandReady:true,townReady:true,demoEnding:"done",farmlandEnding:"done",townEnding:"done",castleReady:false,activeCompanion:null,region:"town",transition:{from:"town",to:"castle",stage:"handoff"}});
    void transitionTo(()=>{pendingAttempt.current=null;setShopSelected([]);setShopError(null);setPuzzle(null);persist(preview);setMode("map");setOverlay("handoff");setAttempt(value=>value+1);});
  }
  function previewCastleEnding() {
    if (!playtest || transitioning.current) return;
    abandonRecord("preview-transition"); activeRecord.current=null;
    setSettings(false); setRevealing(false); skipReveal.current=null;
    const preview=normalizeSave({...saveRef.current,completed:LEVEL_ORDER.slice(0,60) as LevelId[],oasisTransition:"ready",gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,activeCompanion:saveRef.current.activeCompanion??"keeper",demoEnding:"done",farmlandEnding:"done",townEnding:"done",castleEnding:"film",region:"castle",transition:null});
    void transitionTo(()=>{pendingAttempt.current=null;setShopSelected([]);setShopError(null);setPuzzle(null);persist(preview);setMode("map");setOverlay("film");setAttempt(value=>value+1);},false);
  }
  function previewRiverStory() {
    if (!playtest || transitioning.current) return;
    abandonRecord("preview-transition"); activeRecord.current=null;
    setSettings(false); setRevealing(false); skipReveal.current=null;
    const preview=normalizeSave({...saveRef.current,completed:LEVEL_ORDER.slice(0,60) as LevelId[],oasisTransition:"ready",gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,riverReady:false,activeCompanion:saveRef.current.activeCompanion??"keeper",demoEnding:"done",farmlandEnding:"done",townEnding:"done",castleEnding:"done",riverEnding:"locked",region:"castle",transition:{from:"castle",to:"river",stage:"handoff"}});
    void transitionTo(()=>{pendingAttempt.current=null;setShopSelected([]);setShopError(null);setPuzzle(null);persist(preview);setMode("map");setOverlay("handoff");setAttempt(value=>value+1);});
  }
  function previewRiverEnding() {
    if (!playtest || transitioning.current) return;
    abandonRecord("preview-transition"); activeRecord.current=null;
    setSettings(false); setRevealing(false); skipReveal.current=null;
    const preview=normalizeSave({...saveRef.current,completed:[...LEVEL_ORDER] as LevelId[],oasisTransition:"ready",gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,riverReady:true,activeCompanion:saveRef.current.activeCompanion??"keeper",demoEnding:"done",farmlandEnding:"done",townEnding:"done",castleEnding:"done",riverEnding:"thanks",region:"river",transition:null});
    void transitionTo(()=>{pendingAttempt.current=null;setShopSelected([]);setShopError(null);setPuzzle(null);persist(preview);setMode("map");setOverlay("riverOpen");setAttempt(value=>value+1);});
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
      setMode("map"); mapPositions.current = { oasis: null, caravan: null, gatehouse: null, farmland: null, town: null, castle: null, river: null }; setKeeperMet(false);
      setPuzzle(null); setSettings(false); setOverlay("start"); setAttempt(value => value + 1);
    });
  }

  if (!ready) return <main className="loading">Loading the kingdom…</main>;
  const repaired = save.completed.includes("pumpHouse");
  const available = nextLevel(save.completed);
  const level = (LEVELS[activeLevel].chapter === "castle" || LEVELS[activeLevel].chapter === "river") && (pendingAttempt.current?.companionSnapshot || save.activeCompanion) ? castleLevelForCompanion(LEVELS[activeLevel], pendingAttempt.current?.companionSnapshot ?? companionSnapshot(save.activeCompanion!)) : LEVELS[activeLevel];
  const chapter = level.chapter ?? "oasis";
  const chapterNumber = [...new Set(LEVEL_ORDER.map(id => LEVELS[id].chapter ?? "oasis"))].indexOf(chapter) + 1;
  const chapterLevel = LEVEL_ORDER.filter(id => (LEVELS[id].chapter ?? "oasis") === chapter).indexOf(activeLevel) + 1;
  const mapLevel = available && (LEVELS[available].chapter ?? "oasis") === displayRegion ? available : null;
  const partyUnlocked = save.companions.includes("keeper");
  const isCaravan = displayRegion === "caravan";
  const isGatehouse = displayRegion === "gatehouse";
  const isFarmland = displayRegion === "farmland";
  const isTown = displayRegion === "town";
  const isCastle = displayRegion === "castle";
  const isRiver = displayRegion === "river";
  const saveStatus = cloudStatus === "account" ? "Saved to Portal" : cloudStatus === "syncing" ? "Saving…" : cloudStatus === "pending" ? "Waiting to sync" : cloudStatus === "expired" ? "Sign in again" : cloudStatus === "checking" ? "Checking save…" : "Saved on this device";
  const speakerId = isTown ? "towncrier" : isFarmland ? "fieldkeeper" : isGatehouse ? "gatewright" : isCaravan ? "wayfinder" : "keeper";
  const boardCompanion: CompanionId = (level.chapter === "castle" || level.chapter === "river") ? pendingAttempt.current?.companionSnapshot?.id ?? save.activeCompanion ?? "towncrier" : level.chapter === "town" ? "towncrier" : level.chapter === "farmland" ? "fieldkeeper" : level.chapter === "gatehouse" ? "gatewright" : level.chapter === "caravan" ? "wayfinder" : "keeper";
  const speaker = isRiver ? {name:"Skiff",portrait:assetUrl("/sprites/skiff-avatar.png")} : isCastle ? {name:"The Quartermaster",portrait:assetUrl("/sprites/quartermaster-avatar.png")} : COMPANIONS[speakerId];
  const companionIntroduced = isRiver ? save.completed.includes("riverBend") : isCastle ? save.castleReady : isTown ? save.townReady : isFarmland ? save.farmlandReady : isGatehouse ? save.gatehouseReady : isCaravan ? save.oasisTransition === "ready" : keeperMet;
  const goalsLeft = Object.entries(puzzle?.goals ?? {}).filter(([, count]) => count > 0).map(([kind, count]) => `${count} ${kind === "leaf" ? "reeds" : kind === "pennant" ? "pennants" : kind === "key" ? "keys" : kind === "crust" ? "salt blocks" : kind}`).join(" and ");
  const demoComplete=save.completed.includes("openTheCrossing");
  const kingdomPreview=pendingKingdomPreview(save);
  const farmlandUnlocked=playtest ? farmlandPreview : Boolean(farmland && farmland.accountId===cloudRef.current?.accountId && farmland.farmland.unlocked);
  const passUnlocked=Boolean(playtest || currentCampaignPass()?.state==="active");
  const replayGroups=mode==="map" ? replayDestinations(save,displayRegion,{farmland:farmlandUnlocked,town:passUnlocked,castle:passUnlocked,river:passUnlocked}) : [];
  const replayMapKey=mode==="map" ? replayGroups.map(group=>`${group.destination}:${group.levels.join(",")}`).join("|") : "";
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
  async function beginTown() {
    if (!saveRef.current.completed.includes("openTheHarvestRoad")) return;
    const account=cloudRef.current, generation=cloudGeneration.current;
    const sameSession=()=>cloudRef.current===account && cloudGeneration.current===generation;
    if (playtest) {
      if (saveRef.current.townReady) { visitRegion("town"); return; }
    } else {
      if (account?.pending.length) { await flushCloud(); if (!sameSession()) return; if (account.pending.length) { setPassError("Sync the harvest chapter before traveling."); return; } }
      if (!(await verifyTownPass())) { if (sameSession()) setOverlay("dunePass"); return; }
      if (!sameSession()) return;
      if (saveRef.current.townReady) { visitRegion("town"); return; }
    }
    if (saveRef.current.transition?.to === "town") { setOverlay(overlayForSave(saveRef.current)); return; }
    if (saveRef.current.farmlandEnding !== "done") return;
    persist(normalizeSave({ ...saveRef.current, transition: { from: "farmland", to: "town", stage: "handoff" } }));
    setOverlay("handoff");
  }
  async function beginCastle() {
    if (!saveRef.current.completed.includes("openTheMarket")) return;
    const account=cloudRef.current, generation=cloudGeneration.current;
    const sameSession=()=>cloudRef.current===account && cloudGeneration.current===generation;
    if (!playtest) {
      if (account?.pending.length) { await flushCloud(); if (!sameSession()) return; if (account.pending.length) { setPassError("Sync the town chapter before travelling."); return; } }
      if (!(await verifyTownPass())) { if (sameSession()) setOverlay("dunePass"); return; }
      if (!sameSession()) return;
    }
    if (saveRef.current.castleReady) { visitRegion("castle"); return; }
    if (saveRef.current.transition?.to === "castle") { setOverlay(overlayForSave(saveRef.current)); return; }
    if (saveRef.current.townEnding !== "done") return;
    persist(normalizeSave({ ...saveRef.current, transition: { from: "town", to: "castle", stage: "handoff" } }));
    setOverlay("handoff");
  }
  async function beginRiver() {
    if (!saveRef.current.completed.includes("openTheUpstreamRoute")) return;
    const account=cloudRef.current, generation=cloudGeneration.current;
    const sameSession=()=>cloudRef.current===account && cloudGeneration.current===generation;
    if (!playtest) {
      if (account?.pending.length) { await flushCloud(); if (!sameSession()) return; if (account.pending.length) { setPassError("Sync the castle chapter before boarding."); return; } }
      if (!(await verifyTownPass())) { if (sameSession()) setOverlay("dunePass"); return; }
      if (!sameSession()) return;
    }
    if (saveRef.current.riverReady) { visitRegion("river"); return; }
    if (saveRef.current.transition?.to === "river") { setOverlay(overlayForSave(saveRef.current)); return; }
    if (saveRef.current.castleEnding !== "done") return;
    persist(normalizeSave({ ...saveRef.current, transition: { from: "castle", to: "river", stage: "handoff" } }));
    setOverlay("handoff");
  }
  function selectActive(id: CompanionId) {
    const next=setActiveCompanion(saveRef.current,id);
    if (next===saveRef.current) return;
    persist(next);
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
  function passAccess() {
    if (!cloudRef.current || cloudStatus === "expired") return <><p>Sign in through RaidGuild Portal to claim the Dune Pass. Your guest progress stays on this device.</p><a className="farmland-action" href={cloudApi.PORTAL_LOGIN_URL}>Sign in with Portal →</a></>;
    if (passChecking && !campaignPass) return <p role="status">Checking Dune Pass access…</p>;
    if (campaignPass?.state === "active") return <><p>The Dune Pass opens Town on the Hill. Follow the harvest ledger into the evening market.</p><button className="farmland-action" onClick={() => void beginTown()} disabled={passChecking}>Travel to Town on the Hill →</button></>;
    if (campaignPass?.state === "unavailable" || passError || !campaignPass) return <><p role="status">Dune Pass access could not be checked. Your current campaign is safe.</p>{passError && <p>{passError}</p>}<button className="farmland-action" onClick={() => void refreshPass(true)} disabled={passChecking}>{passChecking ? "Checking…" : "Retry access check"}</button></>;
    return <><p>Claim the Dune Pass in the RaidGuild store. Pay what you want, including $0 with Portal login. Chapter 5 is ready.</p>{campaignPass.storeUrl ? <a className="farmland-action" href={campaignPass.storeUrl}>Open the Dune Pass store →</a> : <p>The store link is not available yet.</p>}<button className="quiet" onClick={() => void refreshPass(true)} disabled={passChecking}>{passChecking ? "Checking…" : "Check access"}</button></>;
  }
  return <main className="viewport">
    <div className="frame" aria-label="Dune Relay game" data-mode={mode} data-overlay={overlay ?? "none"} data-moves={mode === "puzzle" ? puzzle?.moves : undefined} data-reduced-motion={reducedMotion}>
      {overlay !== "film" && overlay !== "start" && <GameCanvas key={`${mode}-${displayRegion}-${attempt}-${save.activeCompanion??"mechanic"}-${replayMapKey}`} mode={mode} region={displayRegion} activeCompanion={save.activeCompanion} boardCompanion={boardCompanion} mapPosition={mapPositions.current[displayRegion]} repaired={repaired} caravanComplete={save.completed.includes("lightTheRoute")} gatehouseComplete={save.completed.includes("openTheCrossing")} gateOpening={!visitedRegion && save.demoEnding === "gate"} nextLevel={mapLevel} replayDestinations={replayGroups} replayMode={replayActive} keeperMet={keeperMet} companionIntroduced={companionIntroduced} level={level} puzzle={puzzle} startingBoosters={mode === "puzzle" && !replayActive && pendingAttempt.current?.sceneAttempt === attempt && pendingAttempt.current.level === activeLevel && pendingAttempt.current.status !== "failed" ? pendingAttempt.current.placements : []} audio={sound.current} reducedMotion={reducedMotion} transitioning={wipe !== "hidden"} interactionBlocked={settings || tutorialLibrary || tutorialSession !== null || overlay !== null || sceneIssue !== null } onReady={async () => { const authorized = await authorizeSceneReady(); if (sceneReady.current?.attempt === attempt) sceneReady.current.settle(authorized ? "ready" : "failed"); return authorized; }} onFailure={reason => {
        logDiagnostic("scene-failure", { reason, attempt });
        if (pendingAttempt.current?.sceneAttempt === attempt && pendingAttempt.current.status === "prepared") pendingAttempt.current.status = "failed";
        if (sceneReady.current?.attempt === attempt) sceneReady.current.settle("failed");
        setSceneIssue(reason === "context-lost" ? "The graphics context was interrupted." : "The scene could not load.");
      }} onEvent={onEvent} skipReveal={skipReveal} />}
      <div className="save-hud">
        {mode === "puzzle" && <span className="level-pill" aria-label={`Chapter ${chapterNumber}, level ${chapterLevel}`}>{`${chapterNumber}.${chapterLevel}`}</span>}
        <span className="coin-pill" aria-label={`${save.coins} coins`}><img src={assetUrl("/sprites/coin.png")} alt="" />{save.coins.toLocaleString("en-US")}</span>
        {!playtest && <div className="cloud-pill" role="status" title={`${portalName ?? "Guest"} · ${saveStatus}`} aria-label={`${portalName ?? "Guest"} · ${saveStatus}`}><span className="cloud-name">{portalName ?? "Guest"} · </span><span className="cloud-status">{saveStatus}</span></div>}
      </div>
      <div className="top-actions" inert={wipe !== "hidden"}>
        {mode === "map" && partyUnlocked && <>
          {visitedRegion && <button className="nav-button" onClick={continueJourney}>Continue journey</button>}
          <button className="nav-button" onClick={() => setOverlay("kingdom")}>Kingdom Map</button>
          <button className="nav-button" onClick={() => setOverlay("party")}>Raid Party</button>
        </>}
        <button className="icon-button" onClick={toggleSound} aria-label={muted ? "Unmute" : "Mute"}>{muted ? "♪̸" : "♪"}</button>
        <button className="icon-button" onClick={() => setSettings(true)} aria-label="Settings">⚙</button>
      </div>
      {revealing && mode === "puzzle" && <button className="skip-reveal" onClick={() => skipReveal.current?.()}>Skip reveal →</button>}
      {fullscreenAvailable && !isFullscreen && !installApp.isAppWindow && overlay === null && !settings && !tutorialLibrary && !tutorialSession && <button className="fullscreen-return" onClick={() => requestGameFullscreen()}>⛶ Full screen</button>}
      {fullscreenIssue && <div className="fullscreen-issue" role="status">{fullscreenIssue}</div>}
      {fullscreenEmbeddedBlocked && <a className="fullscreen-new-tab" href={typeof window === "undefined" ? undefined : window.location.href} target="_blank" rel="noopener noreferrer">Open game in a new tab ↗</a>}
      {overlay === "start" && <div className={`scrim intro${isRiver ? " intro-river" : isCastle ? " intro-castle" : isTown ? " intro-town" : isFarmland ? " intro-farmland" : isGatehouse ? " intro-gatehouse" : isCaravan ? " intro-caravan" : ""}`}><div className="intro-card">
        <div className="eyebrow">A RAIDGUILD ADVENTURE</div><h1>DUNE<br />RELAY</h1>
        <p>{isRiver ? "Water is moving upstream, but it is not reaching the waiting people. Board Skiff’s boat and follow the current." : isCastle ? "The town's delivery ledger leads across the water. Meet the Quartermaster at the castle dock and choose who will lead the raid upstream." : isTown ? save.completed.includes("openTheMarket") ? "The evening market is open. The story continues toward Castle Island." : "The harvest ledger points to missing deliveries in the evening market. Find the Town Crier." : isFarmland ? save.completed.includes("openTheHarvestRoad") ? "The harvest road is open. The next clue points to the town on the hill." : "Beyond the bridge, sealed seed stores are holding up the harvest convoy. Find the Fieldkeeper." : demoComplete ? "The bridge is open. Your party has cleared the demo journey. Explore the kingdom to see what lies ahead." : isGatehouse ? "The caravan has reached the river. The Gatewright needs our help opening the crossing." : save.completed.includes("lightTheRoute") ? "The beacon lights the desert road. The caravan chapter is complete." : isCaravan ? "The waterway is alive. The caravan road is open." : available === "caravanPennants" ? "The pump house has come to life. A new route waits beyond the oasis." : repaired ? "The intake is flowing. Follow the path to the next station." : "The oasis pump has gone quiet. Find the keeper, bring the machine to life, and follow the water."}</p>
        <button className="primary" disabled={cloudStatus === "checking" || (cloudStatus === "expired" && !cloudRef.current)} onClick={enter}>{save.oasisTransition !== "locked" && save.oasisTransition !== "ready" ? "Continue the journey" : isRiver ? "Board the river boat" : isCastle ? "Enter Castle Island" : isTown ? "Enter the town" : isFarmland ? "Enter the fields" : isGatehouse ? "Enter the gatehouse" : isCaravan ? "Enter the desert" : "Enter the oasis"} <span>↗</span></button>
        {!installApp.isAppWindow && !installApp.installCompleted && <button className="quiet install-title" onClick={installApp.install} disabled={installApp.promptBusy}>Install Dune Relay ↗</button>}
        {!playtest && (!portalName || cloudStatus === "expired") && <a className="quiet portal-login" href={cloudApi.PORTAL_LOGIN_URL}>Sign in with RaidGuild Portal →</a>}
        {!playtest && cloudStatus === "expired" && !cloudRef.current && <button className="quiet" onClick={continueAsGuest}>Play as guest on this device</button>}
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
        <div className="speaker-row"><img className="speaker-avatar" src={speaker.portrait} alt="" /><span className="speaker">{speaker.name.toUpperCase()} · {mapLevel ? LEVELS[mapLevel].title : isTown ? "TOWN ON THE HILL" : isFarmland ? "FARMLAND" : isGatehouse ? "RIVER GATEHOUSE" : isCaravan ? "OPEN DESERT" : "OASIS"}</span></div>
        <p>{mapLevel ? LEVELS[mapLevel].briefing : "The oasis is flowing."}</p>
        <div className="briefing-actions"><button className="quiet" onClick={closeBriefing}>Back to story</button><button className="primary" onClick={startBriefing}>Start level <span>→</span></button></div>
      </div></div>}
      {overlay === "replayPicker" && <div className="scrim"><div className="dialog-card replay-dialog" role="dialog" aria-modal="true" aria-label="Choose a level to replay"><span className="speaker">CHAPTER REPLAY · NO REWARDS</span><h2>Choose a level</h2><div className="replay-level-list">{replayChoices.map(id=><button key={id} className="setting" onClick={()=>{cancelReplayAuthorization();setReplaySelection(id);setReplayError(null);if(isChapterFinalLevel(id)&&CHAPTER_FINALES[LEVELS[id].chapter??"oasis"])setOverlay("replayBriefing");else void launchChapterReplay(id);}}>{chapterLevelLabel(id)} · {LEVELS[id].title}</button>)}</div>{replayError&&<p className="shop-error" role="alert">{replayError}</p>}<button className="quiet" onClick={closeReplayDialog}>Back to chapter</button></div></div>}
      {overlay === "replayBriefing" && <div className="scrim"><div className="dialog-card replay-dialog" role="dialog" aria-modal="true" aria-label="Replay chapter finale"><span className="speaker">{playtest?"PLAYTEST":"REPLAY · NO REWARDS"}</span><h2>{chapterLevelLabel(replaySelection)} · {LEVELS[replaySelection].title}</h2><p>Choose the level or its chapter cutscene.</p>{replayError&&<p className="shop-error" role="alert">{replayError}</p>}<div className="briefing-actions"><button className="quiet" onClick={()=>{cancelReplayAuthorization();setReplayError(null);if(playtest){setOverlay(null);setSettings(true);}else setOverlay("replayPicker");}}>Back</button><button className="primary" onClick={()=>{if(playtest)replayLevel(replaySelection);else void launchChapterReplay(replaySelection);}}>Play level <span>→</span></button>{CHAPTER_FINALES[LEVELS[replaySelection].chapter??"oasis"]&&isChapterFinalLevel(replaySelection)&&<button className="setting" onClick={()=>playtest?launchPlaytestFinaleReplay():void launchFinaleReplay()} disabled={replayChecking}>{replayChecking?"Checking access…":"Watch cutscene"} <span aria-hidden="true">▶</span></button>}</div></div></div>}
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
        <div className="shop-actions"><button className="quiet" onClick={cancelShop}>Back</button><div className="shop-launch-actions">{shopSelected.length > 0 && !(pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0) && <button className="quiet" onClick={() => { setShopSelected([]); void launchLevel([]); }}>Play without boosters</button>}<button className="primary" onClick={() => void launchLevel([...shopSelected])}>{pendingAttempt.current?.status === "failed" && pendingAttempt.current.cost > 0 ? "Retry purchase" : shopSelected.length ? `Start level · ${boosterCost(shopSelected).toLocaleString("en-US")} coins` : "Start level"} <span>→</span></button></div></div>
      </div></div>}
      {overlay === "film" && <div className="film-screen">
        {filmContent && <video key={finaleReplay ? `replay-${finaleReplay.token}` : `campaign-${filmKind}`} ref={film} src={filmReady ? assetUrl(filmContent.source) : undefined} poster={assetUrl(filmContent.poster)} playsInline preload="metadata" onEnded={finaleReplay ? () => finishFinaleReplay(finaleReplay.token) : finishFilm} onLoadedMetadata={event => logDiagnostic("film-metadata", { film: filmKind, width: event.currentTarget.videoWidth, height: event.currentTarget.videoHeight })} onError={() => { logDiagnostic("film-media-error", { film: filmKind }); setFilmBlocked(true); }} aria-label={filmContent.label} />}
        {filmContent && <div className="film-caption">{filmContent.caption}</div>}
        {filmBlocked && <button className="primary film-play" onClick={() => { void film.current?.play().then(() => setFilmBlocked(false)).catch(() => setFilmBlocked(true)); }}>Play scene <span>▶</span></button>}
        <button className="film-skip" onClick={finaleReplay ? () => finishFinaleReplay(finaleReplay.token) : finishFilm}>Skip scene →</button>
      </div>}
      {overlay === "handoff" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={save.transition?.from === "castle" ? assetUrl("/sprites/quartermaster-avatar.png") : save.transition?.from === "town" ? assetUrl("/sprites/towncrier-avatar.png") : save.transition?.from === "farmland" ? assetUrl("/sprites/fieldkeeper-avatar.png") : save.transition?.from === "gatehouse" ? assetUrl("/sprites/gatewright-avatar.png") : save.transition?.from === "caravan" ? assetUrl("/sprites/wayfinder-avatar.png") : assetUrl("/sprites/keeper-avatar.png")} alt="" /><span className="speaker">{save.transition?.from === "castle" ? "THE QUARTERMASTER" : save.transition?.from === "town" ? "THE TOWN CRIER" : save.transition?.from === "farmland" ? "THE FIELDKEEPER" : save.transition?.from === "gatehouse" ? "THE GATEWRIGHT" : save.transition?.from === "caravan" ? "THE WAYFINDER" : "THE KEEPER"}</span></div>
        {save.transition?.from === "castle" ? <p>The castle manifest points upstream, where water has vanished from the route. Skiff has readied a repair boat. Follow the current together and see where the missing flow goes.</p> : save.transition?.from === "town" ? <p>The market records point to Castle Island across the river. The Quartermaster keeps the dock manifest. Let’s take our ledger to him and trace the missing shipments upstream.</p> : save.transition?.from === "farmland" ? <p>The harvest is moving, but the town ledger reports crates delivered to two different addresses. Take this tally to the Crier at the evening market. He knows the routes and can help us follow the missing castle shipments.</p> : save.transition?.from === "gatehouse" ? <p>The bridge is open, but the seed ledger is wrong: stores are sealed while the harvest route waits. The Fieldkeeper keeps the terrace records. Follow me across and ask him what was diverted.</p> : save.transition?.from === "caravan" ? <p>The beacon connects the desert road, but the river crossing is sealed. Walkers cannot carry the caravan over it. The Gatewright tends the bridge winches. Let’s bring her the keys and reopen the way into farmland.</p> : <p>Listen to that water. The pump can run without us now. Beyond the dunes, the walker train needs a marked route. Take the map, and find the Wayfinder. A shared road is how we carry this oasis to the rest of the kingdom.</p>}
        <button className="primary" onClick={acceptHandoff}>Open the kingdom map <span>→</span></button>
      </div></div>}
      {(overlay === "atlas" || overlay === "kingdom") && <div className="atlas-screen">
        <div className="atlas-plane">
          <img src={assetUrl("/kingdom.webp")} alt="Illustrated kingdom with the oasis, camel caravan, river bridge, farmland, and distant regions" />
          <svg className="atlas-path" viewBox="0 0 1774 887" aria-hidden="true">
            <path className="atlas-path-shadow" d="M420 575 Q550 582 650 625 Q920 710 1195 768" />
            <path className="atlas-path-light" d="M420 575 Q550 582 650 625 Q920 710 1195 768" />
            {demoComplete && <><path className="atlas-path-shadow" d="M1195 768 Q1360 780 1453 699 Q1430 610 1260 570 Q1130 520 1030 470" /><path className="atlas-path-light" d="M1195 768 Q1360 780 1453 699 Q1430 610 1260 570 Q1130 520 1030 470" /></>}
            {kingdomPreview && <path className="atlas-preview-line" d={`M${kingdomPreview.label.x+100} ${kingdomPreview.label.y+60} Q${kingdomPreview.anchor.x-80} ${kingdomPreview.anchor.y-55} ${kingdomPreview.anchor.x} ${kingdomPreview.anchor.y}`} />}
          </svg>
          <span className="atlas-anchor oasis-anchor" /><span className="atlas-anchor caravan-anchor" /><span className="atlas-anchor bridge-anchor" />{demoComplete && <><span className="atlas-anchor farmland-anchor" /><span className="atlas-anchor town-anchor" /><span className="atlas-anchor castle-anchor" /></>}
          {kingdomPreview && <><span className="atlas-preview-anchor" style={{left:`${kingdomPreview.anchor.x/1774*100}%`,top:`${kingdomPreview.anchor.y/887*100}%`}} aria-hidden="true"/><div className="atlas-preview-label" style={{left:`${kingdomPreview.label.x/1774*100}%`,top:`${kingdomPreview.label.y/887*100}%`}} aria-label={`${kingdomPreview.title} · ${kingdomPreview.subtitle}`}><strong>{kingdomPreview.title}</strong><small>{kingdomPreview.subtitle}</small></div></>}
          <div className="atlas-route">
            <button className="atlas-stamp" disabled={save.oasisTransition !== "ready"} onClick={() => visitRegion("oasis")}>OASIS ✓<small>Waterway restored · visit</small></button>
            <button className="atlas-active" disabled={save.oasisTransition !== "ready"} onClick={() => visitRegion("caravan")}>OPEN DESERT {save.completed.includes("lightTheRoute") ? "✓" : ""}<small>{save.completed.includes("lightTheRoute") ? "Route beacon lit · visit" : "Walker train · route beacon"}</small></button>
            {save.completed.includes("lightTheRoute") && <button className="atlas-gatehouse" disabled={!save.gatehouseReady} onClick={() => visitRegion("gatehouse")}>RIVER GATEHOUSE {save.completed.includes("openTheCrossing") ? "✓" : ""}<small>{save.gatehouseReady ? "Bridge crossing · visit" : "River crossing ahead"}</small></button>}
            {save.completed.includes("openTheCrossing") && <button className="atlas-farmland" onClick={() => farmlandUnlocked ? beginFarmland() : setOverlay("farmland")}><span>FARMLAND {save.completed.includes("openTheHarvestRoad") ? "✓" : farmlandUnlocked ? "●" : <span className="atlas-lock" role="img" aria-label="Locked">🔒</span>}</span><small>{save.completed.includes("openTheHarvestRoad") ? "Harvest road · visit" : farmlandUnlocked ? "Unlocked · travel" : "Chapter 4 · locked"}</small></button>}
            {save.completed.includes("openTheHarvestRoad") && <button className="atlas-dune-pass" onClick={() => { if (campaignPass?.state === "active" || playtest) void beginTown(); else { setOverlay("dunePass"); void refreshPass(); } }}><span>TOWN ON THE HILL {save.completed.includes("openTheMarket") ? "✓" : campaignPass?.state === "active" || playtest ? "✦" : <span className="atlas-lock" role="img" aria-label="Dune Pass">🔒</span>}</span><small>{save.completed.includes("openTheMarket") ? "Visit" : campaignPass?.state === "active" || playtest ? "Travel" : "Dune Pass"}</small></button>}
            {save.completed.includes("openTheMarket") && <button className="atlas-castle" onClick={() => void beginCastle()}>CASTLE ISLAND {save.completed.includes("openTheUpstreamRoute") ? "✓" : "✦"}<small>{save.castleReady ? "Visit" : "Cross the water"}</small></button>}
            {save.completed.includes("openTheUpstreamRoute") && <button className="atlas-river" onClick={() => void beginRiver()}>RIVER JOURNEY {save.completed.includes("openTheCollectionRoute") ? "✓" : "✦"}<small>{save.riverReady ? "Visit the river boat" : "Board with Skiff"}</small></button>}
          </div>
        </div>
        <div className="atlas-heading">THE KINGDOM <span>{overlay === "atlas" ? "A NEW ROUTE OPENS" : "THE JOURNEY"}</span></div>
        <div className="atlas-future">{kingdomPreview ? "The next chapter is coming soon. Check back often—the journey continues upstream." : save.completed.includes("openTheUpstreamRoute") ? "The route runs upstream. Board Skiff’s boat to trace the missing water." : save.completed.includes("openTheMarket") ? "The market ledger points across the water to Castle Island." : save.completed.includes("openTheHarvestRoad") ? "The harvest road is open. The town on the hill is next." : save.completed.includes("openTheCrossing") ? "The bridge is open. The Fieldkeeper is waiting beyond the river." : save.completed.includes("lightTheRoute") ? "The caravan has reached the river bridge." : "Follow the lighted road through the desert."}</div>
        <button className="primary atlas-action" onClick={overlay === "atlas" ? travelToCaravan : () => setOverlay(null)}>{overlay === "atlas" ? save.transition?.to === "river" ? "Board the river boat" : save.transition?.to === "castle" ? "Cross to Castle Island" : save.transition?.to === "town" ? "Travel to Town on the Hill" : save.transition?.to === "farmland" ? "Cross into Farmland" : save.transition?.to === "gatehouse" ? "Travel to the river bridge" : "Travel to the caravan" : "Return to the path"} <span>→</span></button>
      </div>}
      {overlay === "farmland" && <div className="scrim"><div className="dialog-card farmland-card"><span className="speaker">THE ROAD BEYOND THE BRIDGE</span><h2>Farmland · Chapter 4</h2><p>The gate is open. Farmland is the Portal login bonus for players who finish this 30-level demo. The seed stores and water terraces are ready to explore.</p>{farmlandAccess()}<button className="quiet" onClick={() => setOverlay("kingdom")}>Back to the kingdom map</button></div></div>}
      {overlay === "dunePass" && <div className="scrim"><div className="dialog-card farmland-card" role="dialog" aria-modal="true" aria-label="Dune Pass"><span className="speaker">THE ROAD CONTINUES</span><h2>Dune Pass</h2>{passAccess()}<button className="quiet" onClick={() => setOverlay("kingdom")}>Back to the kingdom map</button></div></div>}
      {overlay === "party" && <div className="scrim"><div className="party-card">
        <div className="eyebrow">THE RAID PARTY</div><h2>Those who keep the road open</h2>
        <div className="party-list">
          {(["keeper", "wayfinder", "gatewright", "fieldkeeper", "towncrier"] as const).map(id => save.companions.includes(id) ? <div className="party-member" key={id}><img src={COMPANIONS[id].portrait} alt="" /><div><strong>{COMPANIONS[id].name}</strong><p>{COMPANIONS[id].chapter} · {COMPANIONS[id].power}.</p>{save.castleReady && <button className="quiet party-select" disabled={save.activeCompanion===id} onClick={()=>selectActive(id)}>{save.activeCompanion===id ? "ACTIVE" : "Make active"}</button>}</div></div> : <div className="party-member unknown" key={id}><span>?</span><div><strong>Future companion</strong><p>Waiting farther along the road.</p></div></div>)}
          {save.castleReady && <div className="party-member npc"><img src={assetUrl("/sprites/quartermaster-avatar.png")} alt=""/><div><strong>The Quartermaster · NPC</strong><p>Tracks the missing castle shipments and keeps the dock manifest.</p></div></div>}
          {(save.completed.includes("riverBend") || save.riverReady && save.region === "river") && <div className="party-member npc"><img src={assetUrl("/sprites/skiff-avatar.png")} alt=""/><div><strong>Skiff · NPC</strong><p>River pilot. Reads the currents and guides the raid upstream.</p></div></div>}
        </div>{save.castleReady && !save.activeCompanion && <p>Choose an active raid member to lead the party into Castle Island.</p>}<button className="primary" disabled={save.castleReady && !save.activeCompanion} onClick={() => setOverlay(null)}>Back to the path <span>→</span></button>
      </div></div>}
      {overlay === "wayfinder" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/wayfinder-avatar.png")} alt="" /><span className="speaker">THE WAYFINDER · WINDWARD TRAIL</span></div>
        <p>These coral pennants mark the route for every walker. Match them with the familiar oasis symbols. Every nine pennants gives me enough tailwind to send two Flywheels. Help me set the trail, and I’ll travel with your party.</p>
        <button className="primary" onClick={followPennants}>Follow the pennants <span>→</span></button>
      </div></div>}
      {overlay === "towncrier" && <div className="scrim"><div className="dialog-card">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/towncrier-avatar.png")} alt="" /><span className="speaker">THE TOWN CRIER · EVENING MARKET</span></div>
        <p>Welcome to the market. The harvest came in, but our delivery ledgers disagree. Clear symbols beneath each crate and let it fall to any bottom edge to deliver it. The boxes cannot be swapped or destroyed by powers. Every twelve pennants, my Rally Call sends two vertical Jets to help open a path.</p>
        <button className="primary" onClick={openTown}>Open the market <span>→</span></button>
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
        <h2>The convoy can move</h2><p>The seed stores are open and the terraces are flowing. The ledger points to missing deliveries near the town on the hill. The raid continues at the evening market.</p>
        <button className="primary" onClick={() => { if (saveRef.current.farmlandEnding === "thanks") persist(normalizeSave({ ...saveRef.current, farmlandEnding: "done" })); setOverlay("dunePass"); void refreshPass(); }}>See what comes next <span>→</span></button>
      </div></div>}
      {overlay === "townOpen" && <div className="scrim demo-ending"><div className="demo-confetti" data-paused={wipe !== "hidden"} aria-hidden="true">{Array.from({length:32},(_,index)=><span key={index} style={{"--x":`${(index*31+7)%100}%`,"--drift":`${(index*13%21)-10}cqw`,"--spin":`${360+index*29}deg`,"--delay":`${index%8*75}ms`,"--duration":`${2400+index%5*180}ms`,backgroundColor:["#ffd77d","#78dfca","#e8ad59","#df8b73"][index%4]} as CSSProperties}/>)}</div><div className="dialog-card demo-thanks">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/towncrier-avatar.png")} alt=""/><span className="speaker">THE TOWN CRIER · MARKET OPEN</span></div>
        <h2>THE MARKET IS OPEN</h2><p>The castle-bound delivery records still disagree. The Town Crier points across the water to Castle Island, where the quartermaster keeps another copy of the ledger.</p><p className="demo-story">The story continues…</p>
        <button className="primary" onClick={()=>{persist(normalizeSave({...saveRef.current,townEnding:"done"}));setOverlay(null);}}>Return to Town <span>→</span></button>
        <button className="quiet" onClick={()=>{persist(normalizeSave({...saveRef.current,townEnding:"done"}));setOverlay("kingdom");}}>Kingdom Map</button>
      </div></div>}
      {overlay === "skiff" && <div className="scrim"><div className="dialog-card"><div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/skiff-avatar.png")} alt=""/><span className="speaker">SKIFF · RIVER PILOT</span></div><p>Water’s still moving. Trouble is, it’s not reaching the people waiting for it. This boat will carry us bend by bend. Match tiles in the current as usual; after each valid move, each clear channel carries its tiles one space along its arrows. A salted channel stops until you clear it. Choose a raid member to lead while I steer.</p><button className="primary" onClick={openRiver}>Take the helm <span>→</span></button></div></div>}
      {overlay === "riverOpen" && <div className="scrim demo-ending"><div className="demo-confetti" data-paused={wipe !== "hidden"} aria-hidden="true">{Array.from({length:32},(_,index)=><span key={index} style={{"--x":`${(index*31+7)%100}%`,"--drift":`${(index*13%21)-10}cqw`,"--spin":`${360+index*29}deg`,"--delay":`${index%8*75}ms`,"--duration":`${2400+index%5*180}ms`,backgroundColor:["#ffd77d","#78dfca","#e8ad59","#df8b73"][index%4]} as CSSProperties}/>)}</div><div className="dialog-card demo-thanks"><div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/skiff-avatar.png")} alt=""/><span className="speaker">SKIFF · THE UPSTREAM ROUTE</span></div><h2>THE RIVER ROUTE IS OPEN</h2><p>Skiff brings the repair boat through the last bend. Beyond it, the water collection station waits among the upper oases. The raid continues soon.</p><button className="primary" onClick={()=>{persist(normalizeSave({...saveRef.current,riverEnding:"done"}));setOverlay("kingdom");}}>View the Kingdom Map <span>→</span></button><button className="quiet" onClick={()=>{persist(normalizeSave({...saveRef.current,riverEnding:"done"}));setOverlay(null);}}>Return to the boat</button></div></div>}
      {overlay === "quartermaster" && <div className="scrim"><div className="dialog-card"><div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/quartermaster-avatar.png")} alt=""/><span className="speaker">THE QUARTERMASTER · CASTLE DOCK</span></div><p>The town sent one manifest. My storehouse holds another. The water route runs upstream from this dock, but first we must clear the stores and reconcile the crates. Choose who leads your raid party; their familiar power will help us.</p><button className="primary" onClick={openCastle}>Choose your leader <span>→</span></button></div></div>}
      {overlay === "castleOpen" && <div className="scrim demo-ending"><div className="demo-confetti" data-paused={wipe !== "hidden"} aria-hidden="true">{Array.from({length:32},(_,index)=><span key={index} style={{"--x":`${(index*31+7)%100}%`,"--drift":`${(index*13%21)-10}cqw`,"--spin":`${360+index*29}deg`,"--delay":`${index%8*75}ms`,"--duration":`${2400+index%5*180}ms`,backgroundColor:["#ffd77d","#78dfca","#e8ad59","#df8b73"][index%4]} as CSSProperties}/>)}</div><div className="dialog-card demo-thanks"><div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/quartermaster-avatar.png")} alt=""/><span className="speaker">THE QUARTERMASTER · UPSTREAM ROUTE</span></div><h2>THE UPSTREAM ROUTE IS OPEN</h2><p>The castle manifest is reconciled. A boat waits at the dock; its route follows the missing water upstream. The raid will continue there.</p><button className="primary" onClick={()=>{persist(normalizeSave({...saveRef.current,castleEnding:"done",riverReady:false,transition:{from:"castle",to:"river",stage:"handoff"}}));setOverlay("handoff");}}>Board the river boat <span>→</span></button><button className="quiet" onClick={()=>{persist(normalizeSave({...saveRef.current,castleEnding:"done",riverReady:false}));setOverlay(null);}}>Return to Castle Island</button></div></div>}
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
        <div className="speaker-row"><img className="speaker-avatar" src={COMPANIONS[boardCompanion].portrait} alt="" /><span className="speaker">{COMPANIONS[boardCompanion].name.toUpperCase()}</span></div><h2>{level.title} stalls</h2>
        <p>The trail still needs {goalsLeft}.</p>
        {!replayActive && BOOSTERS.some(booster => save.coins >= booster.cost) && <p className="booster-reminder"><strong>Need a boost?</strong> You can use saved coins to add a power-up before your next attempt.</p>}
        <button className="primary" onClick={retry}>Try again <span>↻</span></button>
        <button className="quiet" onClick={finish}>Back to the {level.chapter === "river" ? "river boat" : level.chapter === "castle" ? "castle" : level.chapter === "town" ? "town" : level.chapter === "farmland" ? "farmland" : level.chapter === "gatehouse" ? "gatehouse" : level.chapter === "caravan" ? "caravan" : "oasis"}</button>
      </div></div>}
      {overlay === "finale" && replayActive && <div className="result-overlay"><div className="result-card"><span className="eyebrow">REPLAY · NO REWARDS</span><h2>Level complete!</h2><p>{level.title}</p><button className="primary" onClick={retry}>Replay again <span>↻</span></button><button className="quiet" onClick={finish}>Return to chapter</button></div></div>}
      {overlay === "finale" && !replayActive && <div className="result-overlay"><div className="result-card">
        <span className="eyebrow">{level.victoryEyebrow}</span><h2>{level.victoryTitle}</h2>
        <p>{level.victoryMessage} {puzzle?.moves} spare moves fired as {puzzle?.grantedPower === "flywheels" ? "Flywheels" : puzzle?.grantedPower === "prism" ? "Prisms" : "Pressure Jets"}.</p>
        <div className="coin-reveal"><img src={assetUrl("/sprites/coin.png")} alt="" />+{reward.current} coins</div>
        <button className="primary" onClick={finish}>{activeLevel === "openWaterway" ? "See the pump awaken" : activeLevel === "lightTheRoute" ? "See the walkers depart" : activeLevel === "openTheCrossing" ? "See the bridge open" : activeLevel === "openTheMarket" ? "See the market open" : activeLevel === "openTheHarvestRoad" ? "See the harvest road open" : activeLevel === "openTheUpstreamRoute" ? "See the upstream route" : activeLevel === "openTheCollectionRoute" ? "Celebrate with Skiff" : level.chapter === "river" ? "Return to the river boat" : level.chapter === "castle" ? "Return to Castle Island" : level.chapter === "town" ? "Return to the market" : level.chapter === "farmland" ? "Return to the fields" : level.chapter === "gatehouse" ? "Return to the gatehouse" : level.chapter === "caravan" ? "Return to the caravan" : "Follow the water"} <span>→</span></button>
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
        {!installApp.isAppWindow && !installApp.installCompleted && <button className="setting" onClick={installApp.install} disabled={installApp.promptBusy}>Install Dune Relay <span aria-hidden="true">↗</span></button>}
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
          {LEVEL_ORDER.map(id => <button className="setting" key={id} onClick={() => { if(isChapterFinalLevel(id)&&CHAPTER_FINALES[LEVELS[id].chapter??"oasis"]){setReplaySelection(id);setSettings(false);setOverlay("replayBriefing");}else replayLevel(id); }}>Replay {chapterLevelLabel(id)} · {LEVELS[id].title}</button>)}
          <button className="setting" onClick={() => previewTransition("oasis")}>Preview Oasis → desert transition</button>
          <button className="setting" onClick={() => previewTransition("caravan")}>Preview desert → gatehouse transition</button>
          <button className="setting" onClick={() => previewTransition("gatehouse")}>Preview Gatehouse → demo ending</button>
          <button className="setting" onClick={previewFarmlandStory}>Preview Gatehouse → Farmland story</button>
          <button className="setting" onClick={previewFarmlandEnding}>Preview Farmland → harvest ending</button>
          <button className="setting" onClick={previewTownStory}>Preview Farmland → Town story</button>
          <button className="setting" onClick={previewTownEnding}>Preview Town finale</button>
          <button className="setting" onClick={previewCastleStory}>Preview Town → Castle story</button>
          <button className="setting" onClick={previewCastleEnding}>Preview Castle → upstream ending</button>
          <button className="setting" onClick={previewRiverStory}>Preview Castle → River story</button>
          <button className="setting" onClick={previewRiverEnding}>Preview River chapter ending</button>
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
    </div>
    {overlay !== "start" && <div className="portrait-hint">Turn your phone sideways for a larger board.</div>}
    <InstallDialog open={installApp.helpOpen} ios={installApp.isIos} embedded={installApp.isEmbedded} onClose={() => installApp.setHelpOpen(false)} />
  </main>;
}
