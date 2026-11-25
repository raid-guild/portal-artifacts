"use client";

import { assetUrl } from "./assetUrl";
import { isPlaytestMode } from "./playtestMode";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { coinReward, createPuzzle, type Puzzle, type PuzzleAction, type Turn } from "./core";
import type { GameEvent } from "./GameCanvas";
import { GameAudio } from "./audio";
import { getUnlockedSoundtracks, normalizeAudioPreferences, SOUNDTRACKS, type TrackPreference } from "./soundtracks";
import { LEVELS, LEVEL_ORDER, type LevelId, nextLevel } from "./levels";
import { advanceChapterTransition, advanceTransition, completeLevel, clearLegacySaves, EMPTY_SAVE, normalizeSave, readSave, setActiveCompanion, type CompanionId, type Region, type Save, writeSave } from "./save";
import { castleLevelForCompanion, companionSnapshot, sameCompanionSnapshot, type CompanionSnapshot } from "./companionAbilities";
import { addAttempt, appendTurn, archiveCsv, archiveJson, campaignArchiveKey, emptyArchive, finishAttempt, PLAYTEST_KEY, readArchive, readPlaytestWallet, startAttempt, writeArchive, writePlaytestWallet, type AttemptRecord, type PlaytestArchive } from "./playtest";
import { COMPANIONS } from "./chapters";
import { selectCompanionLine, type CompanionLine } from "./companionDialogue";
import { waitForGameIdle } from "./gameLifecycle";
import { diagnosticsJson, logDiagnostic } from "./diagnostics";
import { prepareStartingBoosters, boosterCost, BOOSTERS, type BoosterKind, type BoosterPlacement } from "./boosters";
import * as cloudApi from "./cloud";
import {boosterFunding,EMPTY_INVENTORY,normalizeInventory,TOOLS,TOOL_PRICE,type Inventory,type ToolKind} from './inventory';
import { TUTORIALS, TUTORIAL_BY_LEVEL, tutorialAvailable, type Tutorial } from "./tutorials";
import { clearSeen, markSeen, readSeen, tutorialScopeKey, type TutorialScope } from "./tutorialProgress";
import { TutorialDialog } from "./TutorialDialog";
import { ToolLesson } from "./ToolLesson";
import { chapterLevelLabel, chapterReplayReady, isChapterFinalLevel, replayAllowed, replayDestinations, type ReplayDestination } from "./chapterReplay";
import { useInstallApp } from "./useInstallApp";
import { InstallDialog } from "./InstallDialog";
import { CHAPTER_FINALES } from "./chapterFinales";
import { pendingKingdomPreview } from "./kingdomPreview";

const GameCanvas = dynamic(() => import("./GameCanvas"), { ssr: false });
const usesSelectableCompanion = (id: LevelId) => LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river";
type Overlay = "start" | "keeper" | "briefing" | "shop" | "replayPicker" | "replayBriefing" | "finale" | "lost" | "film" | "handoff" | "atlas" | "kingdom" | "farmland" | "dunePass" | "party" | "quartermaster" | "castleOpen" | "skiff" | "riverOpen" | "wayfinder" | "gatewright" | "fieldkeeper" | "towncrier" | "townOpen" | "companionChat" | "harvestOpen" | "routeLit" | "crossingOpen" | "demoThanks" | "cloudChoice" | "toolGift" | "toolBuy" | "gifts" | "rewardGift" | null;
type PendingAttempt = { token: number; cloudAttemptId: string; sceneAttempt: number; level: LevelId; selected: BoosterKind[]; cost: number; puzzle: Puzzle; placements: BoosterPlacement[]; companionSnapshot: CompanionSnapshot | null; status: "prepared" | "committed" | "failed" };
type FullscreenAttempt = { token: number; started: number; timer: ReturnType<typeof setTimeout> };
type FinaleReplay = { token: number; generation: number; accountId: string | null; region: Region; returnTo?: "settings" };
type PassAccess = "allowed" | "login-required" | "pass-required" | "unavailable";

export default function GameShell() {
  const installApp = useInstallApp();
  const [playtest, setPlaytest] = useState(false);
  const [ready, setReady] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"checking" | "guest" | "account" | "syncing" | "pending" | "expired">("checking");
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const cloudFlush = useRef<Promise<void> | null>(null);
  const lastCloudError = useRef<string | null>(null);
  const [portalName, setPortalName] = useState<string | null>(null);
  const [farmland, setFarmland] = useState<cloudApi.FarmlandEntitlement | null>(null);
  const [farmlandState, setFarmlandState] = useState<"idle" | "loading" | "claiming" | "error">("idle");
  const [farmlandError, setFarmlandError] = useState<string | null>(null);
  const [farmlandPreview, setFarmlandPreview] = useState(false);
  const [campaignPass, setCampaignPass] = useState<cloudApi.CampaignPass | null>(null);
  const [passChecking, setPassChecking] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const passCheck = useRef<{accountId:string; generation:number; promise:Promise<PassAccess>} | null>(null);
  const lastPassCheck = useRef<{at:number; accountId:string; result:PassAccess} | null>(null);
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
  const [inventory,setInventory] = useState<Inventory>({...EMPTY_INVENTORY});
  const [toolMode,setToolMode] = useState<ToolKind|null>(null);
  const [toolBuying,setToolBuying] = useState<ToolKind|null>(null);
  const [toolLesson,setToolLesson] = useState<{kind:ToolKind;replay:boolean}|null>(null);
  const [toolError,setToolError] = useState<string|null>(null);
  const [toolBusy,setToolBusy] = useState(false);
  const [toolPending,setToolPending] = useState(false);
  const [boardInteractive,setBoardInteractive]=useState(false);
  const [giftNotice,setGiftNotice] = useState(false);
  const [giftError,setGiftError]=useState<string|null>(null);
  const giftOffered=useRef<string|null>(null);
  const toolJournal=useRef<cloudApi.ToolJournal|null>(null);
  const purchaseJournal=useRef<cloudApi.PendingToolPurchase|null>(null);
  const giftClaiming=useRef(false);
  const giftPreviewClaimed=useRef(false);
  const [rewardOffers,setRewardOffers]=useState<cloudApi.Rewards|null>(null);
  const [dailyVisit,setDailyVisit]=useState<cloudApi.DailyVisit|null>(null);
  const [rewardSelection,setRewardSelection]=useState<cloudApi.RewardOffer|null>(null);
  const [rewardStage,setRewardStage]=useState<'sealed'|'opening'|'revealed'>('sealed');
  const [rewardError,setRewardError]=useState<string|null>(null);
  const [rewardBusy,setRewardBusy]=useState(false);
  const [previewRewardCoins,setPreviewRewardCoins]=useState(0);
  const [previewRewardItems,setPreviewRewardItems]=useState<Partial<Inventory>>({});
  const rewardJournal=useRef<cloudApi.RewardJournal|null>(null);
  const rewardRequest=useRef<number|null>(null);
  const rewardEpoch=useRef(0);
  const rewardPreview=useRef(false);
  const rewardReturnOverlay=useRef<Overlay>(null);
  const rewardReturnToInbox=useRef(false);
  const rewardRevealToken=useRef(0);
  const visitRequest=useRef<{accountId:string;promise:Promise<cloudApi.DailyVisit|null>}|null>(null);
  const visitConfirmed=useRef<{accountId:string;day:string;nextResetAt:string;visit:cloudApi.DailyVisit}|null>(null);
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
  const [resetConfirm,setResetConfirm]=useState(false);
  const [resetBusy,setResetBusy]=useState(false);
  const [resetError,setResetError]=useState<string|null>(null);
  const [resetDeferred,setResetDeferred]=useState(false);
  const resetPending=useRef<cloudApi.ResetJournal|null>(null);
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
  const filmKind: Region = finaleReplay?.region ?? (save.riverEnding === "film" ? "river" : save.castleEnding === "film" ? "castle" : save.townEnding === "film" ? "town" : save.farmlandEnding === "film" ? "farmland" : save.demoEnding === "film" ? "gatehouse" : save.transition?.from === "caravan" ? "caravan" : "oasis");
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
      if((result.profile.campaignGeneration??0)!==(current.profile.campaignGeneration??0)){await adoptRemoteReset(current,result.profile);return;}
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
    const force=refresh && Date.now()-lastPassRefresh.current>=5_000;
    if (force) lastPassRefresh.current=Date.now();
    setPassChecking(true); setPassError(null);
    try {
      const result=await cloudApi.entitlements(current.accountId,force);
      if (cloudRef.current!==current || passGeneration.current!==generation) return;
      publishCampaignPass(current,accountGeneration,request,result.campaignPass);
    } catch (error) {
      if (cloudRef.current!==current || cloudGeneration.current!==accountGeneration || passGeneration.current!==generation || passRequest.current!==request) return;
      setPassError((error as Error).message);
    } finally { if (passGeneration.current===generation) setPassChecking(false); }
  }
  async function verifyTownPass(requireServerRead = false): Promise<PassAccess> {
    if (playtest) return "allowed";
    const account=cloudRef.current, generation=cloudGeneration.current;
    if (!account || cloudStatus === "expired") return "login-required";
    if (passCheck.current?.accountId===account.accountId && passCheck.current.generation===generation) return passCheck.current.promise;
    // Entitlement refresh is rate limited upstream. Reuse the most recent
    // authoritative answer for a few seconds; an unavailable answer remains unavailable.
    if (!requireServerRead && lastPassCheck.current?.accountId===account.accountId && Date.now()-lastPassCheck.current.at<5_000) return lastPassCheck.current.result;
    const request=++passRequest.current;
    const promise=(async ():Promise<PassAccess>=>{
      let access:PassAccess="unavailable";
      try {
        const force=Date.now()-lastPassRefresh.current>=5_000;
        if(force)lastPassRefresh.current=Date.now();
        const result=await cloudApi.entitlements(account.accountId,force);
        if (cloudRef.current!==account || cloudGeneration.current!==generation) return "unavailable";
        const published=publishCampaignPass(account,generation,request,result.campaignPass);
        access=published?.state === "active" ? "allowed" : published?.state === "locked" ? "pass-required" : "unavailable";
        if (published) setPassError(published.state==="unavailable" ? "Dune Pass access is temporarily unavailable." : null);
      } catch(error) {
        if (cloudRef.current===account && cloudGeneration.current===generation && passRequest.current===request) setPassError((error as Error).message);
      }
      if (cloudRef.current===account && cloudGeneration.current===generation) lastPassCheck.current={at:Date.now(),accountId:account.accountId,result:access};
      return access;
    })();
    passCheck.current={accountId:account.accountId,generation,promise};
    try{return await promise;}finally{if(passCheck.current?.promise===promise)passCheck.current=null;}
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
        cloudRef.current.pending.push({ kind: "checkpoint", requestId: cloudApi.newOperationId(), campaign: next, campaignGeneration:cloudRef.current.profile.campaignGeneration??0 });
        cacheCloud(); void flushCloud();
      }
    } else writeSave(next);
  }
  function loadoutCost(selected: readonly BoosterKind[]) { const pending=pendingAttempt.current;return pending?.status==='failed' && JSON.stringify([...pending.selected].sort())===JSON.stringify([...selected].sort()) ? pending.cost : boosterFunding(selected,inventory).coinCost; }
  function cacheCloud(): boolean {
    const current = cloudRef.current;
    const purchase=pendingAttempt.current && (pendingAttempt.current.selected.length > 0 || usesSelectableCompanion(pendingAttempt.current.level)) && saveRef.current.completed.indexOf(pendingAttempt.current.level) === -1
      ? {attemptId:pendingAttempt.current.cloudAttemptId,levelId:pendingAttempt.current.level,boosters:pendingAttempt.current.selected,cost:pendingAttempt.current.cost,companionSnapshot:pendingAttempt.current.companionSnapshot} : undefined;
    if (!current) return false;
    const stored=cloudApi.writeAccountCache(current.accountId, { profile: current.profile, localSave: saveRef.current, pending: current.pending, purchase, toolJournal:toolJournal.current??undefined, purchaseTool:purchaseJournal.current??undefined, rewardJournal:rewardJournal.current??undefined });
    if (!stored) setCloudMessage("This browser could not store the pending save. Keep this tab open until it syncs.");
    return stored;
  }
  useEffect(()=>{
    const account=cloudRef.current;
    if(playtest || !account || giftOffered.current===account.accountId || account.profile.rewardClaims?.fieldToolkitV1 || !account.profile.campaign.farmlandReady || !save.farmlandReady || mode!=="map" || overlay!==null || wipe!=="hidden") return;
    giftOffered.current=account.accountId;setGiftNotice(true);
  },[playtest,save.farmlandReady,mode,overlay,wipe,cloudStatus]);
  useEffect(()=>{ if(giftNotice && mode==='map' && overlay===null && wipe==='hidden'){setOverlay('toolGift');setGiftNotice(false);} },[giftNotice,mode,overlay,wipe]);
  useEffect(()=>{
    const account=cloudRef.current;
    if(!account||playtest||cloudStatus!=='account'||mode!=='map'||account.pending.length||cloudConflict.current||!['start',null,'gifts'].includes(overlay))return;
    void refreshRewards(account);
  },[playtest,cloudStatus,mode,save.completed.length,overlay]);
  useEffect(()=>{
    if(!rewardOffers?.nextResetAt)return;
    const delay=Math.max(1000,Math.min(86_400_000,Date.parse(rewardOffers.nextResetAt)-Date.now()+200));
    const timer=setTimeout(()=>{const account=cloudRef.current;if(account&&cloudStatus==='account'&&document.visibilityState==='visible'&&navigator.onLine)void registerDailyVisit(account).then(()=>refreshRewards(account));},delay);
    return()=>clearTimeout(timer);
  },[rewardOffers?.nextResetAt,cloudStatus]);
  useEffect(()=>{
    const active=()=>{
      const account=cloudRef.current;
      if(!account||cloudStatus==='expired'||document.visibilityState!=='visible'||!navigator.onLine)return;
      void cloudApi.campaign(account.accountId).then(latest=>{
        if(cloudRef.current!==account||!latest.profile)return;
        if((latest.profile.campaignGeneration??0)!==(account.profile.campaignGeneration??0)){
          void adoptRemoteReset(account,latest.profile);return;
        }
        void registerDailyVisit(account).then(()=>refreshRewards(account));
      }).catch(()=>{void registerDailyVisit(account).then(()=>refreshRewards(account));});
    };
    document.addEventListener('visibilitychange',active);
    window.addEventListener('online',active);
    return()=>{document.removeEventListener('visibilitychange',active);window.removeEventListener('online',active);};
  },[cloudStatus,overlay,mode]);
  useEffect(()=>{
    if(overlay!=='gifts'&&overlay!=='rewardGift')return;
    const dialog=document.querySelector<HTMLElement>(overlay==='gifts'?'.reward-inbox':'.reward-gift');
    if(!dialog)return;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const buttons=()=>[...dialog.querySelectorAll<HTMLButtonElement>('button:not([disabled])')].filter(button=>button.offsetParent!==null);
    buttons()[0]?.focus();
    const keydown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();if(overlay==='gifts')closeGifts();else leaveReward();return;}
      if(event.key!=='Tab')return;
      const choices=buttons();if(!choices.length){event.preventDefault();return;}
      const first=choices[0],last=choices[choices.length-1];
      if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first.focus();}
    };
    document.addEventListener('keydown',keydown,true);
    return()=>{document.removeEventListener('keydown',keydown,true);if(previous?.isConnected)previous.focus();};
  },[overlay,rewardSelection?.key,rewardBusy]);
  async function claimToolkit(){
    if(playtest){
      if(giftPreviewClaimed.current)return;
      giftPreviewClaimed.current=true;setGiftError(null);
      setInventory(stock=>({...stock,tileBomb:stock.tileBomb+1,freeSwap:stock.freeSwap+1}));setOverlay(null);
      return;
    }
    const account=cloudRef.current;if(!account || giftClaiming.current)return;
    giftClaiming.current=true;setGiftError(null);const generation=cloudGeneration.current;
    try{const response=await cloudApi.claimFieldToolkit(cloudApi.newOperationId(),account.accountId,account.profile.campaignGeneration??0);
      if(cloudRef.current!==account || generation!==cloudGeneration.current)return;
      account.profile=response.profile;setInventory(normalizeInventory(response.profile.inventory));cacheCloud();setOverlay(null);
    }catch(error){setGiftError((error as Error).message);logDiagnostic('field-toolkit-claim-failed',{message:String(error).slice(0,120)});}
    finally{giftClaiming.current=false;}
  }
  const rewardAvailable=[...(rewardOffers?.rewards.filter(item=>item.status==='available'||item.status==='claimed-unpresented')??[])];
  const previewDaily:cloudApi.RewardOffer[]=[
    {key:'preview:daily',title:'Daily Visit · Day 1',cycleDay:1,payload:{coins:100,item:null,quantity:0},status:'available'},
    {key:'preview:daily:2',title:'Daily Visit · Day 2',cycleDay:2,payload:{coins:200,item:null,quantity:0},status:'available'},
    {key:'preview:daily:3',title:'Daily Visit · Day 3',cycleDay:3,payload:{coins:0,item:null,quantity:0,items:[{item:'jet',quantity:1},{item:'flywheel',quantity:1}]},status:'available'},
    {key:'preview:daily:3-duplicate',title:'Day 3 · Duplicate draw',cycleDay:3,payload:{coins:0,item:null,quantity:0,items:[{item:'prism',quantity:2}]},status:'available'},
    {key:'preview:daily:4',title:'Daily Visit · Day 4',cycleDay:4,payload:{coins:500,item:null,quantity:0},status:'available'},
    {key:'preview:daily:5',title:'Daily Visit · Day 5',cycleDay:5,payload:{coins:1000,item:null,quantity:0},status:'available'},
  ];
  const previewRewards:cloudApi.RewardOffer[]=[...previewDaily,...(['jet','flywheel','prism','tileBomb','freeSwap','flywheel','prism'] as const).map((item,index)=>({key:`preview:chapter:${index}`,title:['Oasis','Open Desert','River Gatehouse','Farmland','Town on the Hill','Castle Island','River Journey'][index],payload:{coins:200,item,quantity:1},status:'available' as const}))];
  for(const award of rewardOffers?.unpresented??[]){
    if(!rewardAvailable.some(item=>item.key===award.key))rewardAvailable.push({key:award.key,title:award.key.startsWith('daily:')?'Daily Visit':'Chapter Gift',payload:award.payload,status:'claimed-unpresented',award});
  }
  const unresolvedReward=rewardJournal.current && !rewardAvailable.some(item=>item.key===rewardJournal.current?.rewardKey) ? {key:rewardJournal.current.rewardKey,title:rewardJournal.current.rewardKey.startsWith('daily:')?'Daily Visit':'Chapter Gift',payload:{coins:0,item:null,quantity:0},status:'available' as const} : null;
  if(unresolvedReward)rewardAvailable.unshift(unresolvedReward);
  function rewardStable(account:NonNullable<typeof cloudRef.current>){
    return cloudRef.current===account && cloudStatus==='account' && !account.pending.length && !account.syncing && !cloudConflict.current && toolJournal.current?.phase!=='pending' && toolJournal.current?.phase!=='confirmed' && !purchaseJournal.current && mode==='map' && !replayActive && wipe==='hidden' && !tutorialSession && !tutorialLibrary && !finaleReplay && !transitioning.current;
  }
  function guestImportAvailable(result:Awaited<ReturnType<typeof cloudApi.campaign>>,account:NonNullable<typeof cloudRef.current>,cached:cloudApi.CloudCache|null){
    const profile=result.profile??account.profile;
    const mayImport=result.canImportGuest??(!result.hasCampaign||profile.revision===0);
    return mayImport && readSave().completed.length>0 && !account.pending.length && !cached?.toolJournal && !cached?.purchaseTool && rewardJournal.current?.phase!=='pending';
  }
  async function registerDailyVisit(account:NonNullable<typeof cloudRef.current>,generation=cloudGeneration.current):Promise<cloudApi.DailyVisit|null>{
    if(document.visibilityState!=='visible'||!navigator.onLine)return null;
    const confirmed=visitConfirmed.current;
    if(confirmed?.accountId===account.accountId&&Date.now()<Date.parse(confirmed.nextResetAt))return confirmed.visit;
    if(visitRequest.current?.accountId===account.accountId)return visitRequest.current.promise;
    const promise=(async()=>{
      try{
        const response=await cloudApi.visitRewards(account.accountId);
        if(cloudRef.current!==account||cloudGeneration.current!==generation||!response)return null;
        visitConfirmed.current={accountId:account.accountId,day:response.serverDay,nextResetAt:response.nextResetAt,visit:response.dailyVisit};
        setDailyVisit(response.dailyVisit);return response.dailyVisit;
      }catch(error){
        if(cloudRef.current===account&&cloudGeneration.current===generation)logDiagnostic('reward-visit-failed',{message:String(error).slice(0,120)});
        return null;
      }
    })();
    visitRequest.current={accountId:account.accountId,promise};
    try{return await promise;}finally{if(visitRequest.current?.promise===promise)visitRequest.current=null;}
  }
  async function refreshRewards(account:NonNullable<typeof cloudRef.current>|null){
    if(!account || playtest || mode!=='map' || overlay==='cloudChoice' || account.pending.length || cloudConflict.current || rewardRequest.current!==null)return;
    const generation=cloudGeneration.current,request=++rewardEpoch.current; rewardRequest.current=request;
    try{
      await registerDailyVisit(account,generation);
      const listing=await cloudApi.rewards(account.accountId);
      if(cloudRef.current!==account||cloudGeneration.current!==generation||rewardEpoch.current!==request)return;
      const latest=await cloudApi.campaign(account.accountId);
      if(cloudRef.current!==account||cloudGeneration.current!==generation||rewardEpoch.current!==request)return;
      if(latest.profile&&(latest.profile.campaignGeneration??0)!==(account.profile.campaignGeneration??0)){await adoptRemoteReset(account,latest.profile);return;}
      if(latest.accountId===account.accountId && latest.profile && latest.profile.revision>account.profile.revision && !account.pending.length){
        account.profile=latest.profile;const loaded=normalizeSave(latest.profile.campaign);saveRef.current=loaded;setSave(loaded);setInventory(normalizeInventory(latest.profile.inventory));cacheCloud();
      }
      setRewardOffers(listing);
      if(listing.dailyVisit)setDailyVisit(listing.dailyVisit);
      const journal=rewardJournal.current;
      if(journal?.accountId===account.accountId){
        const confirmed=listing.unpresented.find(award=>award.key===journal.rewardKey)??listing.rewards.find(item=>item.key===journal.rewardKey)?.award;
        if(confirmed?.presentedAt){rewardJournal.current=null;cacheCloud();}
        else if(confirmed){rewardJournal.current={...journal,phase:'confirmed'};cacheCloud();}
      }
    }catch(error){
      if(cloudRef.current!==account||cloudGeneration.current!==generation||rewardEpoch.current!==request)return;
      if(cloudApi.isResetConflict(error)){await adoptRemoteReset(account);return;}
      // Older servers may not have the rewards migration yet. Keep normal play available.
      if(!rewardJournal.current){setRewardOffers(null);return;}
      setRewardError(`Gift status could not be checked: ${(error as Error).message}`);
    }finally{if(rewardRequest.current===request)rewardRequest.current=null;}
  }
  function openReward(item:cloudApi.RewardOffer,preview=false){
    const account=cloudRef.current;
    if(!preview && rewardJournal.current?.phase==='pending' && rewardJournal.current.rewardKey!==item.key)return;
    if(!preview && (!account || !rewardStable(account) && !rewardJournal.current))return;
    rewardReturnToInbox.current=overlay==='gifts';
    rewardRevealToken.current++;
    if(overlay!=='gifts')rewardReturnOverlay.current=overlay==='start'?'start':null;
    rewardPreview.current=preview;
    setRewardSelection(item);setRewardStage(item.status==='claimed-presented'?'revealed':'sealed');setRewardError(null);setSettings(false);setOverlay('rewardGift');
  }
  function openGifts(){
    const account=cloudRef.current;
    if(!account || mode!=='map' || !rewardStable(account))return;
    rewardReturnOverlay.current=overlay==='start'?'start':null;
    setSettings(false);setOverlay('gifts');void refreshRewards(account);
  }
  function closeGifts(){rewardRevealToken.current++;rewardPreview.current=false;setOverlay(rewardReturnOverlay.current);}
  function revealReward(){
    const token=++rewardRevealToken.current;
    setRewardStage('opening');
    if(reducedMotion){setRewardStage('revealed');return;}
    const timer=setTimeout(()=>{timers.current.delete(timer);if(rewardRevealToken.current===token)setRewardStage('revealed');},650);timers.current.add(timer);
  }
  async function applyRewardProfile(account:NonNullable<typeof cloudRef.current>,receiptProfile:cloudApi.CloudProfile,generation:number){
    const latest=await cloudApi.campaign(account.accountId);
    if(cloudRef.current!==account||cloudGeneration.current!==generation)return null;
    if(latest.profile&&(latest.profile.campaignGeneration??0)!==(account.profile.campaignGeneration??0)){await adoptRemoteReset(account,latest.profile);return null;}
    if(latest.accountId!==account.accountId||!latest.profile||latest.profile.revision<receiptProfile.revision)throw new Error('Portal gift could not be verified. Retry with the same request.');
    if(latest.profile.revision<account.profile.revision)return null;
    account.profile=latest.profile;setInventory(normalizeInventory(latest.profile.inventory));
    if(!account.pending.length){const loaded=normalizeSave(latest.profile.campaign);saveRef.current=loaded;setSave(loaded);}
    cacheCloud();return latest;
  }
  async function claimSelectedReward(){
    const item=rewardSelection,account=cloudRef.current;
    if(!item||rewardBusy)return;
    if(rewardPreview.current){
      setPreviewRewardCoins(value=>value+item.payload.coins);
      setPreviewRewardItems(value=>{const next={...value};for(const grant of cloudApi.rewardPayloadItems(item.payload))next[grant.item]=(next[grant.item]??0)+grant.quantity;return next;});
      revealReward();return;
    }
    if(!account||!rewardStable(account) && rewardJournal.current?.rewardKey!==item.key)return;
    let journal=rewardJournal.current;
    if(journal && journal.rewardKey!==item.key)return;
    if(!journal){
      journal={accountId:account.accountId,requestId:cloudApi.newOperationId(),rewardKey:item.key,phase:'pending'};
      rewardJournal.current=journal;
      if(!cacheCloud()){rewardJournal.current=null;setRewardError('This device could not save the gift request. Free space and try again.');return;}
    }
    const generation=cloudGeneration.current;rewardEpoch.current++;rewardRequest.current=null;setRewardBusy(true);setRewardError(null);
    try{
      const result=await cloudApi.claimReward(journal.requestId,journal.rewardKey,account.accountId);
      if(cloudRef.current!==account||cloudGeneration.current!==generation)return;
      const latest=await applyRewardProfile(account,result.profile,generation);
      if(!latest)return;
      rewardJournal.current={...journal,phase:'confirmed'};
      setRewardSelection({...item,award:result.award,status:'claimed-unpresented'});
      cacheCloud();
      if(guestImportAvailable(latest,account,cloudApi.readAccountCache(account.accountId))){
        setRewardSelection(null);setOverlay('cloudChoice');setCloudStatus('account');return;
      }
      revealReward();void refreshRewards(account);
    }catch(error){
      if(cloudRef.current!==account||cloudGeneration.current!==generation)return;
      if(cloudApi.isResetConflict(error)){await adoptRemoteReset(account);return;}
      const status=Number((error as {status?:number}).status);
      if([400,403,409].includes(status)){
        // A committed request replays as 200; these are definitive rejections.
        try{
          const latest=await cloudApi.campaign(account.accountId);
          if(cloudRef.current!==account||cloudGeneration.current!==generation)return;
          if(latest.accountId!==account.accountId||!latest.profile)throw new Error('Portal progress could not be checked.');
          if((latest.profile.campaignGeneration??0)!==(account.profile.campaignGeneration??0)){await adoptRemoteReset(account,latest.profile);return;}
          account.profile=latest.profile;setInventory(normalizeInventory(latest.profile.inventory));
          const loaded=normalizeSave(latest.profile.campaign);saveRef.current=loaded;setSave(loaded);
          rewardJournal.current=null;cacheCloud();
          if(guestImportAvailable(latest,account,cloudApi.readAccountCache(account.accountId))){setRewardSelection(null);setOverlay('cloudChoice');setCloudStatus('account');return;}
          void refreshRewards(account);
        }catch{setRewardError('Gift was declined, but Portal progress could not be checked. Retry the same request when connected.');return;}
      }
      setRewardError(`${(error as Error).message}${[400,403,409].includes(status)?' You can close this gift.':' Retry this same gift request when connected.'}`);
    }finally{setRewardBusy(false);}
  }
  async function finishReward(){
    const item=rewardSelection,account=cloudRef.current;
    if(!item||rewardBusy)return;
    if(rewardPreview.current){setRewardSelection(null);setOverlay('gifts');return;}
    if(!account||!item.award)return;
    const generation=cloudGeneration.current;setRewardBusy(true);setRewardError(null);
    try{
      await cloudApi.presentReward(item.key,account.accountId);
      if(cloudRef.current!==account||cloudGeneration.current!==generation)return;
      const latest=await cloudApi.campaign(account.accountId);
      if(cloudRef.current!==account||cloudGeneration.current!==generation)return;
      if(latest.accountId!==account.accountId||!latest.profile)throw new Error('Portal progress could not be checked.');
      if((latest.profile.campaignGeneration??0)!==(account.profile.campaignGeneration??0)){await adoptRemoteReset(account,latest.profile);return;}
      account.profile=latest.profile;setInventory(normalizeInventory(latest.profile.inventory));
      const loaded=normalizeSave(latest.profile.campaign);saveRef.current=loaded;setSave(loaded);
      rewardRevealToken.current++;rewardJournal.current=null;cacheCloud();setRewardSelection(null);
      if(guestImportAvailable(latest,account,cloudApi.readAccountCache(account.accountId))){setOverlay('cloudChoice');setCloudStatus('account');return;}
      setOverlay(rewardReturnToInbox.current?'gifts':rewardReturnOverlay.current);void refreshRewards(account);
    }catch(error){if(cloudRef.current===account&&cloudGeneration.current===generation){if(cloudApi.isResetConflict(error))await adoptRemoteReset(account);else setRewardError(`Gift reveal could not be saved: ${(error as Error).message}`);}}
    finally{setRewardBusy(false);}
  }
  function leaveReward(){
    if(rewardBusy||rewardJournal.current?.phase==='pending')return;
    rewardRevealToken.current++;
    setRewardSelection(null);setRewardError(null);setOverlay(rewardPreview.current||rewardReturnToInbox.current?'gifts':rewardReturnOverlay.current);
  }
  async function initializeCloud(testing: boolean) {
    if (testing) { setCloudStatus("guest");setInventory({tileBomb:2,freeSwap:2,jet:1,flywheel:1,prism:1}); return; }
    rewardEpoch.current++;rewardRequest.current=null;setRewardOffers(null);visitConfirmed.current=null;visitRequest.current=null;setDailyVisit(null);
    replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
    const generation = ++cloudGeneration.current;
    const remembered = cloudApi.rememberedAccount();
    const provisional = remembered && !cloudApi.readResetJournal(remembered) ? cloudApi.readAccountCache(remembered) : null;
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
      const storedCache=cloudApi.readAccountCache(session.accountId);
      const pendingReset=cloudApi.readResetJournal(session.accountId);
      const cached=storedCache && (storedCache.profile.campaignGeneration??0)===(result.profile?.campaignGeneration??0) && !pendingReset ? storedCache : null;
      if(storedCache && !cached && !pendingReset)cloudApi.writeAccountCache(session.accountId,{profile:result.profile??storedCache.profile,localSave:result.profile?.campaign??EMPTY_SAVE,pending:[]});
      const profile = result.profile ?? { revision: 0, imported: false, campaign: { ...EMPTY_SAVE, completed: [], companions: [] }, inventory:{...EMPTY_INVENTORY}, rewardClaims:{} };
      cloudRef.current = { accountId: session.accountId, profile, pending: cached?.pending ?? [], syncing: false };
      if(pendingReset){
        resetPending.current=pendingReset;setPortalName(session.displayName);
        const loaded=normalizeSave(profile.campaign);saveRef.current=loaded;setSave(loaded);setInventory(normalizeInventory(profile.inventory));setMode('map');setPuzzle(null);setOverlay('start');setCloudStatus('account');setResetBusy(false);
        setResetError('Start over still needs confirmation. Your progress is protected until you resolve it.');
        setResetDeferred(pendingReset.intent==='deferred');setResetConfirm(pendingReset.intent!=='deferred');setSettings(pendingReset.intent!=='deferred');
        if(pendingReset.intent==='cancel')void cancelPendingReset(pendingReset);
        return;
      }
      if(storedCache && !cached){setCloudMessage('This campaign was restarted on another device. The latest Portal save is loaded.');}

      rewardJournal.current=cached?.rewardJournal?.accountId===session.accountId?cached.rewardJournal:null;
      setInventory(normalizeInventory(profile.inventory));
      setFarmland(null); clearCampaignPass(); void refreshFarmland(cloudRef.current);
      if (cached?.purchase && LEVELS[cached.purchase.levelId] && Array.isArray(cached.purchase.boosters)) {
        try {
          const source=LEVELS[cached.purchase.levelId];
          const prepared=prepareStartingBoosters(createPuzzle(usesSelectableCompanion(source.id) && cached.purchase.companionSnapshot ? castleLevelForCompanion(source,cached.purchase.companionSnapshot) : source),cached.purchase.boosters);
          pendingAttempt.current={token:0,cloudAttemptId:cached.purchase.attemptId,sceneAttempt:-1,level:cached.purchase.levelId,selected:cached.purchase.boosters,cost:cached.purchase.cost??boosterFunding(cached.purchase.boosters,normalizeInventory(profile.inventory)).coinCost,puzzle:prepared.puzzle,placements:prepared.placements,companionSnapshot:cached.purchase.companionSnapshot??null,status:"failed"};
          setCloudMessage(cached.purchase.boosters.length ? "An earlier booster purchase needs confirmation. Retry the same loadout when you enter that level." : "This chapter level is ready to restart with your chosen raid member.");
        } catch { /* A stale loadout remains in the account cache backup. */ }
      }
      setPortalName(session.displayName);
      await registerDailyVisit(cloudRef.current,generation);
      if(generation!==cloudGeneration.current)return;
      let currentCampaign=result;
      if(rewardJournal.current?.phase==='pending'){
        const pendingReward=rewardJournal.current,account=cloudRef.current;
        try{
          const listing=await cloudApi.rewards(account.accountId);
          if(generation!==cloudGeneration.current||cloudRef.current!==account)return;
          let award=listing.unpresented.find(value=>value.key===pendingReward.rewardKey)??listing.rewards.find(value=>value.key===pendingReward.rewardKey)?.award;
          let receiptProfile:cloudApi.CloudProfile|null=null;
          if(!award){const receipt=await cloudApi.claimReward(pendingReward.requestId,pendingReward.rewardKey,account.accountId);award=receipt.award;receiptProfile=receipt.profile;}
          const latest=await cloudApi.campaign(account.accountId);
          if(generation!==cloudGeneration.current||cloudRef.current!==account)return;
          if(latest.accountId!==account.accountId||!latest.profile||latest.profile.revision<(receiptProfile?.revision??account.profile.revision))throw new Error('Portal gift could not be verified. Retry the pending gift.');
          if((latest.profile.campaignGeneration??0)!==(account.profile.campaignGeneration??0)){await adoptRemoteReset(account,latest.profile);return;}
          account.profile=latest.profile;setInventory(normalizeInventory(latest.profile.inventory));currentCampaign=latest;
          rewardJournal.current=award.presentedAt?null:{...pendingReward,phase:'confirmed'};cacheCloud();
        }catch(error){
          if(generation!==cloudGeneration.current||cloudRef.current!==account)return;
          if(cloudApi.isResetConflict(error)){await adoptRemoteReset(account);return;}
          if(cloudApi.isDefiniteToolRejection(error)){
            try{
              const latest=await cloudApi.campaign(account.accountId);
              if(generation!==cloudGeneration.current||cloudRef.current!==account)return;
              if(latest.accountId!==account.accountId||!latest.profile)throw new Error('Portal progress could not be checked.');
              if((latest.profile.campaignGeneration??0)!==(account.profile.campaignGeneration??0)){await adoptRemoteReset(account,latest.profile);return;}
              account.profile=latest.profile;setInventory(normalizeInventory(latest.profile.inventory));currentCampaign=latest;
              rewardJournal.current=null;cacheCloud();
            }catch{ /* Keep the request until the account can be checked. */ }
          }
          if(rewardJournal.current?.phase==='pending'){
            const loaded=normalizeSave(account.profile.campaign);saveRef.current=loaded;setSave(loaded);setKeeperMet(loaded.completed.includes('pumpHouse'));
            rewardReturnOverlay.current='start';rewardReturnToInbox.current=false;
            setRewardSelection({key:pendingReward.rewardKey,title:pendingReward.rewardKey.startsWith('daily:')?'Daily Visit':'Chapter Gift',payload:{coins:0,item:null,quantity:0},status:'available'});
            setRewardStage('sealed');setRewardError(`Gift confirmation needs a connection: ${(error as Error).message}`);
            setOverlay('rewardGift');setCloudStatus('account');return;
          }
        }
      }
      if (guestImportAvailable(currentCampaign,cloudRef.current,cached)) { setOverlay("cloudChoice"); setCloudStatus("account"); return; }
      const loaded = cached?.pending.length ? normalizeSave(cached.localSave) : normalizeSave(cloudRef.current.profile.campaign);
      saveRef.current = loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse"));
      if(cached?.purchaseTool?.accountId===session.accountId){
        purchaseJournal.current=cached.purchaseTool;
        try{
          const order=cached.purchaseTool;
          const bought=await cloudApi.purchaseTool(order.requestId,order.kind,order.expectedRevision,order.attemptId,order.accountId,order.campaignGeneration??0);
          if(generation!==cloudGeneration.current) return;
          const latest=await cloudApi.campaign(session.accountId);
          if(generation!==cloudGeneration.current)return;
          if(latest.accountId!==session.accountId||!latest.profile||latest.profile.revision<bought.profile.revision)throw new Error('Portal progress could not be verified after purchase');
          purchaseJournal.current=null;cacheCloud();
          await refreshToolProfile(cloudRef.current,pendingAttempt.current?.level,undefined,latest.profile);
        }catch(error){
          if(generation!==cloudGeneration.current)return;
          if(cloudApi.isResetConflict(error)){await adoptRemoteReset(cloudRef.current);return;}
          if(cloudApi.isDefiniteToolRejection(error)){purchaseJournal.current=null;cacheCloud();await refreshToolProfile(cloudRef.current,pendingAttempt.current?.level,Number((error as {status?:number}).status));setCloudMessage(`The old tool purchase was declined: ${(error as Error).message}`);}
          else setCloudMessage(`A tool purchase needs confirmation. Reconnect and reload: ${(error as Error).message}`);
        }
      }
      const journal=cached?.toolJournal;
      if(journal?.accountId===session.accountId && cloudApi.recoverableToolJournalVersion(journal.contentVersion) && !loaded.completed.includes(journal.levelId)){
        toolJournal.current=journal;
        const restore=(snapshot:Puzzle)=>{
          pendingAttempt.current={token:0,cloudAttemptId:journal.attemptId,sceneAttempt:attempt+1,level:journal.levelId,selected:cached?.purchase?.boosters??[],cost:0,puzzle:snapshot,placements:[],companionSnapshot:cached?.purchase?.companionSnapshot??null,status:'committed'};
          setActiveLevel(journal.levelId);setPuzzle(snapshot);setMode('puzzle');setAttempt(value=>value+1);setOverlay(null);
        };
        let storedConfirmation=true;
        if(journal.phase==='pending'){
          setToolPending(true);
          try{
            const used=await cloudApi.consumeTool(journal);
            if(generation!==cloudGeneration.current) return;
            const latest=await cloudApi.campaign(session.accountId);
            if(generation!==cloudGeneration.current)return;
            if(latest.accountId!==session.accountId||!latest.profile||latest.profile.revision<used.profile.revision)throw new Error('Portal progress could not be verified after tool use');
            const newer=latest.profile.revision>used.profile.revision;
            const canRestore=await refreshToolProfile(cloudRef.current,journal.levelId,newer?403:undefined,latest.profile);
            if(!canRestore){
              storedConfirmation=false;toolJournal.current=null;cacheCloud();
              setCloudMessage('Portal progress changed on another device. Continue from the story.');
            }else{
              toolJournal.current={...journal,phase:'confirmed'};
              if(!cacheCloud()){storedConfirmation=false;restore(journal.before);setToolError('The tool was used, but this device could not save the board. Retry the pending action.');}
            }
          }catch(error){
            if(generation!==cloudGeneration.current)return;
            if(cloudApi.isResetConflict(error)){await adoptRemoteReset(cloudRef.current);return;}
            if(cloudApi.isDefiniteToolRejection(error)){
              toolJournal.current=null;cacheCloud();
              const canResume=await refreshToolProfile(cloudRef.current,journal.levelId,Number((error as {status?:number}).status));
              if(generation!==cloudGeneration.current)return;
              if(canResume)restore(journal.before);
              setToolError(`The old tool action was declined: ${(error as Error).message}`);
            }else{restore(journal.before);setCloudMessage(`A tool action needs confirmation: ${(error as Error).message}`);}
          }
        }
        if(storedConfirmation && (toolJournal.current?.phase==='confirmed' || toolJournal.current?.phase==='applied')){
          const stable=toolJournal.current;
          restore(stable.after);setToolPending(false);
          if(stable.after.status==='won'){commitWin(stable.levelId,stable.after.moves);toolJournal.current=null;cacheCloud();setOverlay('finale');}
          else if(stable.after.status==='lost'){toolJournal.current=null;cacheCloud();setOverlay('lost');}
          else setOverlay(null);
        }
      } else if(journal?.accountId===session.accountId && loaded.completed.includes(journal.levelId)){toolJournal.current=null;cacheCloud();}
      setCloudStatus(cached?.pending.length ? "pending" : "account");
      if (cached?.pending.length) void flushCloud();
      void refreshRewards(cloudRef.current);
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
  async function flushCloud(explicit = false) {
    const current = cloudRef.current;
    if (cloudFlush.current) return cloudFlush.current;
    if (!current || (cloudConflict.current && !explicit) || playtest || resetPending.current || !current.pending.length) return;
    const work = (async () => {
    current.syncing = true; setCloudStatus("syncing");
    try {
      while (current.pending.length && cloudRef.current === current) {
        const op = current.pending[0];
        const response = op.kind === "finish" ? await cloudApi.finishAttempt(op,current.accountId) : await cloudApi.advanceCheckpoint(op, current.profile.revision,current.accountId);
        current.profile = response.profile;
        setInventory(normalizeInventory(response.profile.inventory));
        current.pending.shift();
        cacheCloud();
      }
      if (cloudRef.current === current) {
        saveRef.current = normalizeSave(current.profile.campaign); setSave(saveRef.current);
        cacheCloud(); cloudConflict.current=false; lastCloudError.current=null; setCloudStatus("account"); setCloudMessage(null);
        void refreshFarmland(current);
        void refreshRewards(current);
      }
    } catch (error) {
      if (cloudRef.current === current) {
        const status=(error as {status?:number}).status;
        if(cloudApi.isResetConflict(error)){
          await adoptRemoteReset(current);return;
        }
        if (status === 400 || status === 409) cloudConflict.current=true;
        const op=current.pending[0];
        const code=String((error as {code?:string}).code ?? "").slice(0,60);
        const detail=`${op?.kind ?? "save"}${op?.kind==="checkpoint" && op.campaign.transition ? ` ${op.campaign.transition.from} → ${op.campaign.transition.to} (${op.campaign.transition.stage})` : ""}`;
        logDiagnostic("cloud-sync-failed",{kind:op?.kind??"none",from:op?.kind==="checkpoint"?op.campaign.transition?.from??"none":"none",stage:op?.kind==="checkpoint"?op.campaign.transition?.stage??"none":"none",status:status??0,code});
        lastCloudError.current=`${detail}: ${(error as Error).message}${status ? ` (HTTP ${status}${code?` · ${code}`:""})` : ""}`;
        setCloudStatus(status === 401 ? "expired" : "pending");
        setCloudMessage(`Saved on this device. Sync failed: ${lastCloudError.current} Retry in Settings.`);
      }
    } finally { current.syncing = false; }
    })();
    cloudFlush.current=work;
    try { await work; } finally { if(cloudFlush.current===work) cloudFlush.current=null; }
  }
  async function importGuestProgress() {
    const current = cloudRef.current; if (!current) return;
    setCloudStatus("syncing");
    try {
      const response = await cloudApi.importGuest(readSave(), cloudApi.guestImportId(current.accountId),current.accountId,current.profile.campaignGeneration??0);
      if (cloudRef.current !== current) return;
      cloudApi.clearGuestImportId(current.accountId);
      replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
      current.profile=response.profile; const loaded=normalizeSave(response.profile.campaign); saveRef.current=loaded; setSave(loaded); setKeeperMet(loaded.completed.includes("pumpHouse")); setCloudStatus("account"); setOverlay("start"); cacheCloud(); setCloudMessage(null);
      void refreshFarmland(current);
      void refreshRewards(current);
    } catch (error) { if(cloudApi.isResetConflict(error)){await adoptRemoteReset(current);return;}setCloudStatus("account"); setCloudMessage((error as Error).message); }
  }
  function startFreshPortalCampaign() {
    const current=cloudRef.current; if (!current) return;
    replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
    const fresh={...EMPTY_SAVE,completed:[],companions:[],coins:current.profile.campaign.coins};
    saveRef.current=fresh; setSave(fresh); setKeeperMet(false);
    current.pending.push({kind:"checkpoint",requestId:cloudApi.newOperationId(),campaign:fresh,campaignGeneration:current.profile.campaignGeneration??0});
    cacheCloud(); void flushCloud(); setOverlay("start");
    void refreshRewards(current);
  }
  async function signOut() {
    if(toolJournal.current?.phase==='pending' || purchaseJournal.current || rewardJournal.current?.phase==='pending'){setCloudMessage('Confirm the pending account transaction before signing out.');return;}
    if (cloudRef.current?.pending.length) { setCloudMessage("Wait for your campaign to sync before signing out."); return; }
    try { await cloudApi.logout(cloudRef.current?.accountId ?? cloudApi.rememberedAccount() ?? ""); } catch { setCloudMessage("Could not sign out. Try again when connected."); return; }
    replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
    switchStatsArchive(campaignArchiveKey());
    rewardEpoch.current++;rewardRequest.current=null;visitConfirmed.current=null;visitRequest.current=null;setDailyVisit(null);
    cloudGeneration.current++; cloudRef.current=null; cloudConflict.current=false; clearFarmland(); cloudApi.rememberAccount(null); setPortalName(null); setCloudStatus("guest"); setCloudMessage(null);setInventory({...EMPTY_INVENTORY});toolJournal.current=null;purchaseJournal.current=null;rewardJournal.current=null;setRewardOffers(null);setToolMode(null);setToolPending(false);
    const guest=readSave(); saveRef.current=guest; setSave(guest); setMode("map"); setPuzzle(null); setOverlay("start"); setSettings(false); setAttempt(value=>value+1);
  }
  function continueAsGuest() {
    replayToken.current++; replaySession.current=null; clearFinaleReplay(); setReplayActive(false); setVisitedRegion(null);
    switchStatsArchive(campaignArchiveKey());
    rewardEpoch.current++;rewardRequest.current=null;visitConfirmed.current=null;visitRequest.current=null;setDailyVisit(null);
    cloudGeneration.current++; cloudRef.current=null; cloudConflict.current=false; clearFarmland(); cloudApi.rememberAccount(null); setPortalName(null); setCloudStatus("guest"); setCloudMessage(null);setInventory({...EMPTY_INVENTORY});toolJournal.current=null;purchaseJournal.current=null;rewardJournal.current=null;setRewardOffers(null);setToolMode(null);setToolPending(false);
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
      current.pending.push({kind:"finish",attemptId,levelId,remainingMoves:movesRemaining,contentVersion:cloudApi.contentVersion,campaignGeneration:current.profile.campaignGeneration??0});
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
      if(transitionGeneration.current!==generation)return;
      setWipe("covered");
      let readyScene: Promise<"ready" | "failed" | "timeout"> = Promise.resolve("ready");
      if (createsScene) readyScene = new Promise(resolve => {
        let remaining = pendingAttempt.current?.selected.length && cloudRef.current ? 30_000 : 10_000;
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
      if(transitionGeneration.current!==generation)return;
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
    return value.riverEnding === "film" ? "film"
      : value.riverEnding === "thanks" ? "riverOpen"
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
    if(rewardJournal.current?.phase==='pending'){const item=rewardAvailable.find(value=>value.key===rewardJournal.current?.rewardKey);if(item)openReward(item);return;}
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
    if(resetPending.current){setCloudMessage('Resolve the pending Start over request before starting a level.');setResetConfirm(true);setResetDeferred(false);return;}
    if(rewardJournal.current?.phase==='pending'){const item=rewardAvailable.find(value=>value.key===rewardJournal.current?.rewardKey);if(item)openReward(item);return;}
    if(toolJournal.current?.phase==='pending' || purchaseJournal.current){setCloudMessage('A tool transaction needs confirmation. Reconnect and reload before starting another level.');return;}
    if (visitedRegion) { setVisitedRegion(null); return; }
    setTutorialSession(null); setTutorialLibrary(false);
    tokenCounter.current++;
    if (pendingAttempt.current?.level !== id || pendingAttempt.current.selected.length === 0 && !["castle","river"].includes(LEVELS[id].chapter ?? "oasis")) pendingAttempt.current = null;
    setShopLevel(id); setShopSelected(pendingAttempt.current?.status === "failed" && pendingAttempt.current.level === id ? pendingAttempt.current.selected : []); setShopError(null);
    // The story introduction has already been acknowledged. Back from the
    // booster screen returns to the walkable scene instead of replaying it.
    setShopReturn(null);
    setOverlay("shop");
  }
  function currentTutorialScope(): TutorialScope {
    return playtest ? { kind: "sandbox" } : cloudRef.current ? { kind: "account", accountId: cloudRef.current.accountId,campaignGeneration:cloudRef.current.profile.campaignGeneration??0 } : { kind: "guest" };
  }
  function toolLessonKey(kind:ToolKind):string { return `dune-relay:tool-lesson:v1:${tutorialScopeKey(currentTutorialScope())}:${kind}`; }
  function activateOwnedTool(kind:ToolKind):void {
    let seen=false;try{seen=window.localStorage.getItem(toolLessonKey(kind))==='seen';}catch{}
    if(!seen){setToolLesson({kind,replay:false});return;}
    setToolMode(kind);
  }
  function chooseTool(kind:ToolKind):void {
    if(toolJournal.current?.phase==='pending'||toolJournal.current?.phase==='confirmed'||purchaseJournal.current)return;
    setToolError(null);
    if(toolMode===kind){setToolMode(null);return;}
    if(inventory[kind]<1){setToolBuying(kind);setOverlay('toolBuy');return;}
    activateOwnedTool(kind);
  }
  function finishToolLesson(useTool:boolean):void {
    const lesson=toolLesson;if(!lesson)return;
    if(!lesson.replay)try{window.localStorage.setItem(toolLessonKey(lesson.kind),'seen');}catch{}
    setToolLesson(null);
    if(!lesson.replay && useTool)setToolMode(lesson.kind);
    if(lesson.replay)setTutorialLibrary(true);
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
    const cost=loadoutCost(selected);
    const unresolved=pendingAttempt.current?.status === "failed" && pendingAttempt.current.selected.length > 0 ? pendingAttempt.current : null;
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
    if (cloudRef.current?.pending.length) { await flushCloud(true); if (cloudRef.current?.pending.length) { setShopError(lastCloudError.current ?? "Your progress could not sync. Open Settings and retry Sync now."); return; } }
    if ((LEVELS[id].chapter === "town" || LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && !playtest) { const access = await verifyTownPass(); if (access!=="allowed") { setShopError(access==="login-required" ? "Sign in with Portal to play this chapter." : access==="pass-required" ? "Claim the Dune Pass to play this chapter." : "Dune Pass access could not be checked. Retry when connected."); return; } }
    if (LEVELS[id].chapter === "farmland" && !playtest && !(farmland?.farmland.unlocked && farmland.accountId === cloudRef.current?.accountId)) { setShopError("Sign in and unlock Farmland first."); return; }
    if ((LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && (!(LEVELS[id].chapter === "river" ? saveRef.current.riverReady : saveRef.current.castleReady) || !saveRef.current.activeCompanion)) { setShopError("Choose an active raid member before entering this chapter."); setOverlay("party"); return; }
    let cost = loadoutCost(selected);
    if (cost > saveRef.current.coins && !pendingAttempt.current?.cost) { setShopError("Not enough coins for this loadout."); return; }
    const restored=pendingAttempt.current?.status === "failed" && pendingAttempt.current.level === id && (LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && JSON.stringify([...pendingAttempt.current.selected].sort()) === JSON.stringify([...selected].sort()) ? pendingAttempt.current : null;
    const chosenSnapshot = restored?.companionSnapshot ?? ((LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && saveRef.current.activeCompanion ? companionSnapshot(saveRef.current.activeCompanion) : null);
    let prepared: ReturnType<typeof prepareStartingBoosters>;
    try { prepared = prepareStartingBoosters(createPuzzle(chosenSnapshot ? castleLevelForCompanion(LEVELS[id],chosenSnapshot) : LEVELS[id]), selected); }
    catch (error) { setShopError(String(error)); return; }
    const token = ++tokenCounter.current;
    const unresolved = pendingAttempt.current?.status === "failed" && pendingAttempt.current.selected.length > 0 ? pendingAttempt.current : null;
    if (unresolved && (unresolved.level !== id || JSON.stringify([...unresolved.selected].sort()) !== JSON.stringify([...selected].sort()))) {
      setShopError("Retry the same purchase first so its coin charge can be confirmed."); return;
    }
    const cloudAttemptId = unresolved?.cloudAttemptId ?? restored?.cloudAttemptId ?? cloudApi.newOperationId();
    if (cloudRef.current && !playtest) {
      if (cloudRef.current.pending.length) { setShopError(lastCloudError.current ?? "Your last move is still syncing. Open Settings and retry Sync now."); return; }
      if (selected.length > 0 || LEVELS[id].chapter === "farmland" || LEVELS[id].chapter === "town" || LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") {
        try { const response=await cloudApi.prepareAttempt(cloudAttemptId,id,[...selected],cloudRef.current.accountId,chosenSnapshot?.id,cloudRef.current.profile.campaignGeneration??0); if (!sameCompanionSnapshot(response.companionSnapshot,chosenSnapshot)) throw new Error("The active raid member changed. Reload your save."); cost=response.boosterFunding?.coinCost??boosterCost(selected); }
        catch (error) { setShopError(`Could not prepare this level: ${(error as Error).message}`); return; }
        if (token !== tokenCounter.current) return;
      }
    }
    pendingAttempt.current = { token, cloudAttemptId, sceneAttempt: attempt + 1, level: id, selected: [...selected], cost, puzzle: prepared.puzzle, placements: prepared.placements, companionSnapshot:chosenSnapshot, status: "prepared" };
    setBoardInteractive(false);setToolMode(null);
    if (cloudRef.current && (selected.length > 0 || LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river")) cacheCloud();
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
    if (!pendingAttempt.current?.selected.length) pendingAttempt.current = null; setShopError(null);
    if (shopReturn === null && mode === "map") void transitionTo(() => { setOverlay(null); setAttempt(value => value + 1); });
    else setOverlay(shopReturn);
  }
  function toggleBooster(kind: BoosterKind) {
    setShopSelected(current => {
      if (pendingAttempt.current?.status === "failed" && pendingAttempt.current.selected.length > 0) return current;
      if (current.includes(kind)) return current.filter(selected => selected !== kind);
      const proposed=[...current,kind];
      if (loadoutCost(proposed) > saveRef.current.coins) return current;
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
    if (unresolved && (unresolved.selected.length > 0 || usesSelectableCompanion(unresolved.level))) { setShopLevel(unresolved.level); setShopSelected(unresolved.selected); setShopError(unresolved.selected.length > 0 ? "Retry this purchase to confirm its coin charge. It will not charge twice." : "Retry this level with the saved raid member."); }
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
    if (cloudRef.current && !playtest && (current.selected.length > 0 || LEVELS[current.level].chapter === "farmland" || LEVELS[current.level].chapter === "town" || LEVELS[current.level].chapter === "castle" || LEVELS[current.level].chapter === "river")) {
      const account = cloudRef.current;
      authorizing.current=true;
      try {
        const response = await cloudApi.activateAttempt(current.cloudAttemptId,account.profile.revision,account.accountId,account.profile.campaignGeneration??0);
        if (cloudRef.current !== account) return false;
        account.profile=response.profile;
        setInventory(normalizeInventory(response.profile.inventory));
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
    if(playtest && current.selected.length){const funded=boosterFunding(current.selected,inventory);setInventory(stock=>{const next={...stock};for(const kind of funded.owned) next[kind]--;return next;});}
    current.status = "committed";
    logDiagnostic("starting-boosters-committed", { token: current.token, level: current.level, selected: current.selected.join(","), cost: current.cost });
    return true;
  }
  async function authorizeTool(action:PuzzleAction,turn:Turn,before:Puzzle):Promise<boolean> {
    const account=cloudRef.current,current=pendingAttempt.current;
    if(replayActive || !boardInteractive || !current || current.status!=="committed" || current.level!==activeLevel || before.status!=="playing" || before.moves<1 || toolBusy || toolPending || action.kind==='swap') return false;
    const kind=action.kind;
    if(!turn.valid) return false;
    if(playtest){if(inventory[kind]<1)return false;setInventory(stock=>({...stock,[kind]:stock[kind]-1}));setToolMode(null);return true;}
    if(!account) return false;
    const existing=toolJournal.current;
    if(existing?.phase==='confirmed') {
      if(JSON.stringify(existing.action)!==JSON.stringify(action)){setToolError('Finish the previous tool first.');return false;}
      if(!cacheCloud()){setToolError('This device still cannot save the tool result.');return false;}
      setToolMode(null);return true;
    }
    if(account.profile.inventory?.[kind]<1 && existing?.phase!=='pending') {setToolError('No tool is available.');return false;}
    if(existing?.phase==='pending' && JSON.stringify(existing.action)!==JSON.stringify(action)) {setToolError('Finish confirming the previous tool first.');return false;}
    const payload=JSON.stringify({before,action,after:turn.state});
    const bytes=new TextEncoder().encode(payload);
    const digest=await crypto.subtle.digest('SHA-256',bytes);
    const stateFingerprint=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
    const journal:cloudApi.ToolJournal=existing?.phase==='pending' ? existing : {accountId:account.accountId,attemptId:current.cloudAttemptId,levelId:activeLevel,requestId:cloudApi.newOperationId(),expectedRevision:account.profile.revision,campaignGeneration:account.profile.campaignGeneration??0,toolSequence:(existing?.toolSequence??0)+1,kind,action,stateFingerprint,movesRemaining:before.moves,contentVersion:cloudApi.contentVersion,before,after:turn.state,phase:'pending'};
    toolJournal.current=journal;
    if(!cacheCloud()) {toolJournal.current=existing;setToolError('Could not save the tool action on this device.');return false;}
    setToolPending(true);
    setToolBusy(true);setToolError(null);
    const generation=cloudGeneration.current;
    try {
      const response=await cloudApi.consumeTool(journal);
      if(cloudRef.current!==account || generation!==cloudGeneration.current || pendingAttempt.current!==current) return false;
      account.profile=response.profile;
      setInventory(normalizeInventory(response.profile.inventory));
      toolJournal.current={...journal,phase:'confirmed'};
      if(!cacheCloud()) {setToolError('Tool was used, but this device could not save the board. Keep this tab open.');return false;}
      setToolMode(null);
      return true;
    }catch(error){
      if(cloudRef.current!==account || generation!==cloudGeneration.current)return false;
      if(cloudApi.isResetConflict(error)){await adoptRemoteReset(account);return false;}
      if(cloudApi.isDefiniteToolRejection(error)){
        toolJournal.current=null;setToolMode(null);cacheCloud();await refreshToolProfile(account,journal.levelId,Number((error as {status?:number}).status));
        setToolError(`The tool was not used: ${(error as Error).message} Choose it again after refreshing.`);
      }else setToolError(`Tool confirmation is pending: ${(error as Error).message} Retry the pending action.`);
      return false;
    }
    finally{if(cloudRef.current===account && generation===cloudGeneration.current)setToolBusy(false);}
  }
  async function refreshToolProfile(account:NonNullable<typeof cloudRef.current>,rejectedLevel?:LevelId,rejectionStatus?:number,knownProfile?:cloudApi.CloudProfile):Promise<boolean>{
    const generation=cloudGeneration.current;
    try{
      const latest=knownProfile ? {accountId:account.accountId,profile:knownProfile} : await cloudApi.campaign(account.accountId);
      if(latest.accountId!==account.accountId||!latest.profile)throw new Error('Portal profile unavailable');
      if(cloudRef.current!==account||generation!==cloudGeneration.current)return false;
      if((latest.profile.campaignGeneration??0)!==(account.profile.campaignGeneration??0)){
        await adoptRemoteReset(account,latest.profile);return false;
      }
      const remote=normalizeSave(latest.profile.campaign);
      account.profile=latest.profile;setInventory(normalizeInventory(latest.profile.inventory));
      // Keep unsynced checkpoint operations for backup, but never present their
      // possibly stale campaign as the authoritative progress after a conflict.
      if(account.pending.length){cloudConflict.current=true;setCloudStatus('pending');setCloudMessage('This save needs attention. Download a backup in Settings before loading the Portal campaign.');}
      else setCloudStatus('account');
      saveRef.current=remote;setSave(remote);setKeeperMet(remote.completed.includes('pumpHouse'));
      const chapter=rejectedLevel ? LEVELS[rejectedLevel].chapter : null;
      const chapterReady=chapter==='farmland'?remote.farmlandReady:chapter==='town'?remote.townReady:chapter==='castle'?remote.castleReady:chapter==='river'?remote.riverReady:true;
      const canResume=Boolean(rejectedLevel && rejectionStatus!==403 && !account.pending.length && chapterReady && nextLevel(remote.completed)===rejectedLevel);
      if(!canResume){pendingAttempt.current=null;setToolMode(null);setBoardInteractive(false);setPuzzle(null);setMode('map');setOverlay(null);setSettings(false);setAttempt(value=>value+1);}
      cacheCloud();return canResume;
    }catch{
      if(cloudRef.current===account && generation===cloudGeneration.current){
        pendingAttempt.current=null;setToolMode(null);setBoardInteractive(false);setPuzzle(null);setMode('map');setOverlay(null);setSettings(false);setAttempt(value=>value+1);
        setCloudMessage('The latest Portal progress could not be checked. Reconnect and reload before entering another level.');
      }
      return false;
    }finally{if(cloudRef.current===account && generation===cloudGeneration.current)setToolPending(false);}
  }
  async function retryPendingTool():Promise<void>{
    const journal=toolJournal.current,account=cloudRef.current;
    if(!journal||journal.phase==='applied'||!account||account.accountId!==journal.accountId||toolBusy)return;
    setToolBusy(true);setToolError(null);
    const generation=cloudGeneration.current;
    try{
      const response=journal.phase==='pending' ? await cloudApi.consumeTool(journal) : {profile:account.profile};
      if(cloudRef.current!==account||generation!==cloudGeneration.current)return;
      const latest=await cloudApi.campaign(account.accountId);
      if(cloudRef.current!==account||generation!==cloudGeneration.current)return;
      if(!latest.profile||latest.accountId!==account.accountId)throw new Error('Portal progress could not be verified');
      if(latest.profile.revision>response.profile.revision || latest.profile.revision>account.profile.revision && nextLevel(normalizeSave(latest.profile.campaign).completed)!==journal.levelId){
        toolJournal.current=null;cacheCloud();await refreshToolProfile(account,journal.levelId,403,latest.profile);
        setToolError('Portal progress changed on another device. Continue from the story.');return;
      }
      account.profile=response.profile;setInventory(normalizeInventory(response.profile.inventory));
      toolJournal.current={...journal,phase:'applied'};
      if(!cacheCloud()){toolJournal.current={...journal,phase:'confirmed'};setToolError('The tool was used, but this device could not save the board. Keep this tab open.');return;}
      if(pendingAttempt.current?.cloudAttemptId===journal.attemptId){pendingAttempt.current.sceneAttempt=attempt+1;pendingAttempt.current.puzzle=journal.after;}
      setToolPending(false);setToolMode(null);setPuzzle(journal.after);setAttempt(value=>value+1);
      if(journal.after.status==='won'){commitWin(journal.levelId,journal.after.moves);toolJournal.current=null;cacheCloud();setOverlay('finale');}
      else if(journal.after.status==='lost'){toolJournal.current=null;cacheCloud();setOverlay('lost');}
    }catch(error){
      if(cloudRef.current!==account||generation!==cloudGeneration.current)return;
      if(cloudApi.isResetConflict(error)){await adoptRemoteReset(account);return;}
      if(journal.phase==='pending' && cloudApi.isDefiniteToolRejection(error)){toolJournal.current=null;setToolMode(null);cacheCloud();await refreshToolProfile(account,journal.levelId,Number((error as {status?:number}).status));setToolError(`The tool was not used: ${(error as Error).message}`);}
      else setToolError(`Tool confirmation is pending: ${(error as Error).message}`);
    }finally{if(cloudRef.current===account && generation===cloudGeneration.current)setToolBusy(false);}
  }
  async function buyTool(kind:ToolKind):Promise<void> {
    const account=cloudRef.current,current=pendingAttempt.current;
    if(!current || current.status!=='committed' || replayActive || mode!=='puzzle' || !boardInteractive || !puzzle || puzzle.status!=='playing' || puzzle.moves<1 || toolBusy) return;
    if(saveRef.current.coins<TOOL_PRICE){setToolError('Not enough coins.');return;}
    if(playtest){const next={...saveRef.current,coins:saveRef.current.coins-TOOL_PRICE};if(!writePlaytestWallet({version:1,coins:next.coins})){setToolError('Could not save the test wallet.');return;}saveRef.current=next;setSave(next);setInventory(stock=>({...stock,[kind]:stock[kind]+1}));setToolBuying(null);setOverlay(null);activateOwnedTool(kind);return;}
    if(!account) return;
    const pending=purchaseJournal.current;
    if(pending && (pending.kind!==kind || pending.attemptId!==current.cloudAttemptId)) {setToolError('Confirm the pending purchase first.');return;}
    const order=pending??{requestId:cloudApi.newOperationId(),kind,accountId:account.accountId,attemptId:current.cloudAttemptId,expectedRevision:account.profile.revision,campaignGeneration:account.profile.campaignGeneration??0};
    purchaseJournal.current=order;
    if(!cacheCloud()){setToolError('Could not save the purchase request on this device.');return;}
    setToolBusy(true);setToolError(null);
    const generation=cloudGeneration.current;
    try{
      const response=await cloudApi.purchaseTool(order.requestId,order.kind,order.expectedRevision,order.attemptId,order.accountId,order.campaignGeneration??0);
      if(cloudRef.current!==account || generation!==cloudGeneration.current) return;
      if(pending){
        const latest=await cloudApi.campaign(account.accountId);
        if(cloudRef.current!==account||generation!==cloudGeneration.current)return;
        if(!latest.profile||latest.accountId!==account.accountId)throw new Error('Portal progress could not be verified');
        purchaseJournal.current=null;cacheCloud();
        if(!(await refreshToolProfile(account,current.level,undefined,latest.profile))){setToolError('Portal progress changed on another device. Continue from the story.');return;}
      }else if(response.profile.revision>=account.profile.revision){
        account.profile=response.profile;setInventory(normalizeInventory(response.profile.inventory));
        const next={...saveRef.current,coins:response.profile.campaign.coins};saveRef.current=next;setSave(next);
      }
      purchaseJournal.current=null;cacheCloud();setToolBuying(null);setOverlay(null);activateOwnedTool(kind);
    }catch(error){
      if(cloudRef.current!==account || generation!==cloudGeneration.current)return;
      if(cloudApi.isResetConflict(error)){await adoptRemoteReset(account);return;}
      if(cloudApi.isDefiniteToolRejection(error)){purchaseJournal.current=null;cacheCloud();await refreshToolProfile(account,current.level,Number((error as {status?:number}).status));setToolError(`Purchase declined: ${(error as Error).message} Choose again after refreshing.`);}
      else setToolError(`Purchase status is uncertain: ${(error as Error).message} Retry to confirm; it will not charge twice.`);
    }
    finally{if(cloudRef.current===account && generation===cloudGeneration.current)setToolBusy(false);}
  }
  function onEvent(event: GameEvent) {
    if (event.type === "gateOpened" && transitioning.current) { if (!visitedRegion) gateOpenedPending.current = true; return; }
    if (transitioning.current) return;
    if ("position" in event) mapPositions.current[displayRegion] = event.position;
    if (event.type === "playReady") {setBoardInteractive(true); if (archiveKey.current && !activeRecord.current) { const snapshot=(level.chapter==="castle" || level.chapter==="river") ? (pendingAttempt.current?.companionSnapshot ?? (saveRef.current.activeCompanion ? companionSnapshot(saveRef.current.activeCompanion) : null)) : null; activeRecord.current = startAttempt(level, puzzle ?? createPuzzle(level), new Date(), replayActive ? [] : pendingAttempt.current?.selected ?? [], replayActive ? 0 : pendingAttempt.current?.cost ?? 0, replayActive ? "replay" : playtest ? "sandbox" : "campaign",snapshot); storeRecord(); if (!settings && !tutorialLibrary && !tutorialSession && overlay === null && wipe === "hidden") recordResume(); } return; }
    if (event.type === "gateOpened") { if (!visitedRegion && saveRef.current.demoEnding === "gate") { if (transitioning.current) gateOpenedPending.current = true; else beginDemoFilm(); } return; }
    if (event.type === "resolvedTurn") {
      setBoardInteractive(false);
      const journal=toolJournal.current;
      if(journal?.phase==='confirmed' && event.action && JSON.stringify(event.action)===JSON.stringify(journal.action) && journal.accountId===cloudRef.current?.accountId && journal.attemptId===pendingAttempt.current?.cloudAttemptId){
        toolJournal.current=event.turn.state.status==='playing' ? {...journal,after:event.turn.state,phase:'applied'} : null;
        cacheCloud();setToolPending(false);
      }
      // Commit a terminal reward when the rule engine accepts the move. If the
      // renderer is interrupted during its animation, a reload keeps the win.
      if (!replayActive && event.turn.state.status === "won") commitWin(activeLevel,event.turn.state.moves);
      if (activeRecord.current) { recordPause(); activeRecord.current = appendTurn(activeRecord.current, event.turn, event.from, event.to,new Date(),event.action?.kind==='tileBomb'||event.action?.kind==='freeSwap'?event.action.kind:undefined); if (event.turn.state.status !== "playing") { activeRecord.current = finishAttempt(activeRecord.current, event.turn.state.status, "goals-or-moves"); } storeRecord(); }
      return;
    }
    if (event.type === "replayDestination") {
      const group=replayGroups.find(item=>item.destination===event.destination);
      if (group) {setReplayChoices(group.levels);setReplaySelection(group.levels[0]);}
      if (!group || pendingAttempt.current?.selected.length && !saveRef.current.completed.includes(pendingAttempt.current.level)) { setReplayError("Resolve the pending booster purchase before replaying."); setOverlay("replayBriefing"); return; }
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
    if (event.type === "turn") { setPuzzle(event.puzzle);setBoardInteractive(event.puzzle.status==='playing'); if (activeRecord.current?.outcome === "playing" && !settings && !sceneIssue) recordResume(); return; }
    if (event.type === "lose") {toolJournal.current=null;cacheCloud();setToolMode(null); setOverlay("lost"); sound.current?.play("lose"); return; }
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
    if (saveRef.current.riverEnding === "film") { persist(normalizeSave({ ...saveRef.current, riverEnding: "thanks" })); setOverlay("riverOpen"); return; }
    if (saveRef.current.riverEnding === "thanks") return;
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
  function travelToChapter(from: "gatehouse" | "farmland" | "town" | "castle", to: "farmland" | "town" | "castle" | "river") {
    // Keep each durable checkpoint in order while a single map tap travels.
    if (saveRef.current.transition?.from===from && saveRef.current.transition.stage==="arrival") {
      void transitionTo(()=>{setMode("map");setOverlay(null);setAttempt(value=>value+1);});
      return;
    }
    if (saveRef.current.transition?.from!==from) persist(normalizeSave({...saveRef.current,transition:{from,to,stage:"handoff"}}));
    if (saveRef.current.transition?.stage==="handoff") persist(advanceChapterTransition(saveRef.current,"handoff","atlas"));
    if (saveRef.current.transition?.stage==="atlas") travelToCaravan();
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
      // Replay has no attempt-preparation request to enforce access server-side,
      // so read the server each time. A forced commerce refresh is throttled
      // for five seconds, but the ordinary entitlement response is still checked.
      const status=await verifyTownPass(true);
      if (cloudRef.current!==account || cloudGeneration.current!==generation || token!==replayToken.current) return null;
      if(status!=="allowed") { setReplayError(status==="login-required" ? "Sign in to replay this chapter." : status==="pass-required" ? "Claim the Dune Pass to replay this chapter." : "Dune Pass access could not be checked. Retry shortly."); return null; }
      townUnlocked=true;
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
    if(resetPending.current){setReplayError('Resolve the pending Start over request before replaying.');setResetConfirm(true);setResetDeferred(false);return;}
    if (launching.current || transitioning.current || replayActive && !again) return;
    const pending=pendingAttempt.current;
    if (pending?.selected.length && !saveRef.current.completed.includes(pending.level)) {setReplayError("Resolve the pending booster purchase before replaying.");return;}
    const account=cloudRef.current; const generation=cloudGeneration.current; const token=++replayToken.current;
    launching.current=true; setReplayError(null);
    try {
      const region=LEVELS[id].chapter??"oasis";
      const access=await verifyReplayAccess(region,token,account,generation);
      if (!access) return;
      if (cloudRef.current!==account || cloudGeneration.current!==generation || token!==replayToken.current || resetPending.current || !replayAllowed(saveRef.current,id,access) || region!==displayRegion) {setReplayError("This chapter is not available for replay.");return;}
      const puzzle=createPuzzle((LEVELS[id].chapter === "castle" || LEVELS[id].chapter === "river") && saveRef.current.activeCompanion ? castleLevelForCompanion(LEVELS[id],companionSnapshot(saveRef.current.activeCompanion)) : LEVELS[id]);
      reward.current=0; setRevealing(false); abandonRecord("started-replay"); activeRecord.current=null;
      replaySession.current={token,generation,accountId:account?.accountId??null,level:id,sceneAttempt:attempt+1,farmlandUnlocked:access.farmland,townUnlocked:access.town};
      setReplayActive(true);
      void transitionTo(()=>{if(resetPending.current)return;setActiveLevel(id);setPuzzle(puzzle);setMode("puzzle");setOverlay(null);setAttempt(value=>value+1);});
    } catch(error) {if (cloudRef.current===account && cloudGeneration.current===generation && token===replayToken.current) setReplayError(`Replay access could not be checked: ${(error as Error).message}`);}
    finally {if(token===replayToken.current) launching.current=false;}
  }
  async function launchFinaleReplay() {
    if(resetPending.current){setReplayError('Resolve the pending Start over request before replaying.');setResetConfirm(true);setResetDeferred(false);return;}
    if (launching.current || transitioning.current || mode!=="map" || overlay!=="replayBriefing" || !replayChoices.includes(replaySelection) || !isChapterFinalLevel(replaySelection)) return;
    const region=LEVELS[replaySelection].chapter??"oasis";
    if (!CHAPTER_FINALES[region] || region!==displayRegion) return;
    const pending=pendingAttempt.current;
    if (pending?.selected.length && !saveRef.current.completed.includes(pending.level)) {setReplayError("Resolve the pending booster purchase before replaying.");return;}
    const account=cloudRef.current, generation=cloudGeneration.current, token=++replayToken.current;
    launching.current=true; setReplayChecking(true); setReplayError(null);
    try {
      const access=await verifyReplayAccess(region,token,account,generation);
      if (!access) return;
      if (cloudRef.current!==account || cloudGeneration.current!==generation || token!==replayToken.current || resetPending.current || !chapterReplayReady(saveRef.current,region,access) || region!==displayRegion || overlay!=="replayBriefing" || !isChapterFinalLevel(replaySelection)) {setReplayError("This chapter is not available for replay.");return;}
      const session: FinaleReplay={token,generation,accountId:account?.accountId??null,region};
      finaleReplayFinishing.current=false;
      void transitionTo(()=>{
        if (cloudRef.current!==account || cloudGeneration.current!==generation || token!==replayToken.current || resetPending.current) return;
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
    if(toolJournal.current?.phase==='pending' || purchaseJournal.current){setCloudMessage('Confirm the pending tool transaction before leaving the board.');return;}
    toolJournal.current=null;cacheCloud();setToolMode(null);
    setSettings(false); setRevealing(false); skipReveal.current = null;
    sound.current?.stopTransientSounds();
    abandonRecord(reason); activeRecord.current = null;
    if (replayActive) {
      replaySession.current=null;setReplayActive(false);reward.current=0;
      void transitionTo(()=>{setMode("map");setPuzzle(null);setOverlay(null);setAttempt(value=>value+1);});
      return;
    }
    const chapterEnd = activeLevel === "openWaterway" && saveRef.current.oasisTransition === "film" || activeLevel === "lightTheRoute" && saveRef.current.transition?.from === "caravan" && saveRef.current.transition.stage === "film" || activeLevel === "openTheHarvestRoad" && saveRef.current.farmlandEnding === "film" || activeLevel === "openTheMarket" && saveRef.current.townEnding === "film" || activeLevel === "openTheUpstreamRoute" && saveRef.current.castleEnding === "film" || activeLevel === "openTheCollectionRoute" && saveRef.current.riverEnding === "film";
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
    const preview=normalizeSave({...saveRef.current,completed:[...LEVEL_ORDER] as LevelId[],oasisTransition:"ready",gatehouseReady:true,farmlandReady:true,townReady:true,castleReady:true,riverReady:true,activeCompanion:saveRef.current.activeCompanion??"keeper",demoEnding:"done",farmlandEnding:"done",townEnding:"done",castleEnding:"done",riverEnding:"film",region:"river",transition:null});
    void transitionTo(()=>{pendingAttempt.current=null;setShopSelected([]);setShopError(null);setPuzzle(null);persist(preview);setMode("map");setOverlay("film");setAttempt(value=>value+1);}, false);
  }
  async function adoptRemoteReset(account:NonNullable<typeof cloudRef.current>|null,knownProfile?:cloudApi.CloudProfile):Promise<void>{
    if(!account||cloudRef.current!==account)return;
    // Replace the account identity before fetching. Every older request checks this
    // object or cloudGeneration before publishing a wallet, gift, or board update.
    const replacement={accountId:account.accountId,profile:account.profile,pending:[],syncing:false};
    cloudGeneration.current++;rewardEpoch.current++;rewardRequest.current=null;rewardRevealToken.current++;
    replayToken.current++;replaySession.current=null;clearFinaleReplay();setReplayActive(false);
    cloudRef.current=replacement;cloudConflict.current=false;clearFarmland();
    visitConfirmed.current=null;visitRequest.current=null;setDailyVisit(null);setRewardOffers(null);
    abandonRecord('reset-on-another-device');activeRecord.current=null;
    pendingAttempt.current=null;toolJournal.current=null;purchaseJournal.current=null;rewardJournal.current=null;
    resetPending.current=null;cloudApi.clearResetJournal(account.accountId);setResetBusy(false);setResetError(null);setResetDeferred(false);
    giftClaiming.current=false;giftOffered.current=null;setGiftNotice(false);setRewardBusy(false);
    setToolMode(null);setToolBuying(null);setToolBusy(false);setToolPending(false);setToolError(null);
    setTutorialSession(null);setTutorialLibrary(false);setBoardInteractive(false);setPuzzle(null);
    setShopSelected([]);setShopError(null);setSettings(false);setResetConfirm(false);
    transitionGeneration.current++;sceneReady.current?.settle('failed');transitioning.current=false;
    setWipe('hidden');setVisitedRegion(null);setRevealing(false);skipReveal.current=null;setMode('map');setOverlay('start');setCloudStatus('checking');setAttempt(value=>value+1);
    try{
      const latest=knownProfile?{accountId:account.accountId,profile:knownProfile}:await cloudApi.campaign(account.accountId);
      if(cloudRef.current!==replacement)return;
      if(latest.accountId!==account.accountId||!latest.profile)throw new Error('Portal campaign unavailable');
      replacement.profile=latest.profile;
      const fresh=normalizeSave(latest.profile.campaign);saveRef.current=fresh;setSave(fresh);
      setInventory(normalizeInventory(latest.profile.inventory));setKeeperMet(fresh.completed.includes('pumpHouse'));
      cloudApi.clearGuestImportId(account.accountId);
      const cached=cloudApi.writeAccountCache(account.accountId,{profile:latest.profile,localSave:fresh,pending:[]});
      setCloudStatus('account');setCloudMessage(cached?'This campaign was restarted on another device.':'This campaign was restarted on another device. This browser could not save the fresh copy; keep this tab open.');
      void refreshFarmland(replacement);void refreshRewards(replacement);
    }catch{
      if(cloudRef.current!==replacement)return;
      setCloudStatus('checking');setCloudMessage('This campaign was restarted on another device. Reconnect and reload to load the fresh story.');
    }
  }
  function finishPortalReset(profile:cloudApi.CloudProfile,accountId:string){
    abandonRecord('reset');activeRecord.current=null;
    cloudGeneration.current++;rewardEpoch.current++;replayToken.current++;passGeneration.current++;farmlandGeneration.current++;
    cloudRef.current={accountId,profile,pending:[],syncing:false};
    toolJournal.current=null;purchaseJournal.current=null;rewardJournal.current=null;pendingAttempt.current=null;replaySession.current=null;clearFinaleReplay();
    const fresh=normalizeSave(profile.campaign);
    if(!cloudApi.writeAccountCache(accountId,{profile,localSave:fresh,pending:[]})){setResetError('Portal reset completed, but this device could not save the fresh campaign. Free storage and retry confirmation.');setResetBusy(false);return;}
    resetPending.current=null;cloudApi.clearResetJournal(accountId);cloudApi.clearGuestImportId(accountId);setResetDeferred(false);
    saveRef.current=fresh;setSave(fresh);setInventory(normalizeInventory(profile.inventory));setPuzzle(null);setShopSelected([]);setToolMode(null);setToolLesson(null);setTutorialSession(null);setReplayActive(false);setVisitedRegion(null);mapPositions.current={oasis:null,caravan:null,gatehouse:null,farmland:null,town:null,castle:null,river:null};setKeeperMet(false);setMode('map');setOverlay('start');setAttempt(value=>value+1);setResetConfirm(false);setResetBusy(false);setSettings(false);setCloudStatus('account');
    window.location.reload();
  }
  function exportBeforeReset(){
    if(cloudRef.current){downloadCloudBackup();return;}
    const blob=new Blob([JSON.stringify({save:readSave(),exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`dune-relay-guest-backup-${new Date().toISOString().slice(0,10)}.json`;link.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function cancelPendingReset(journal:cloudApi.ResetJournal){
    if(resetBusy)return;
    const account=cloudRef.current,generation=cloudGeneration.current;
    const cancellation={...journal,intent:'cancel' as const};
    if(!cloudApi.writeResetJournal(cancellation)){setResetError('Could not save your cancellation request on this device.');return;}
    resetPending.current=cancellation;setResetBusy(true);setResetError(null);
    try{
      const result=await cloudApi.cancelReset(cancellation);
      if(cloudRef.current!==account||cloudGeneration.current!==generation||resetPending.current?.requestId!==journal.requestId)return;
      if(result.status==='applied'){finishPortalReset(result.profile,journal.accountId);return;}
      cloudApi.clearResetJournal(journal.accountId);resetPending.current=null;setResetBusy(false);setResetError(null);setResetConfirm(false);setResetDeferred(false);setSettings(false);
      window.location.reload();
    }catch(error){if(cloudRef.current!==account||cloudGeneration.current!==generation)return;setResetBusy(false);setResetError(`Cancellation could not be confirmed: ${(error as Error).message}. Close for now or retry cancellation.`);}
  }
  function closePendingReset(){
    const journal=resetPending.current;
    if(!journal||resetBusy)return;
    const deferred={...journal,intent:'deferred' as const};
    if(!cloudApi.writeResetJournal(deferred)){setResetError('Could not save the pending request on this device.');return;}
    resetPending.current=deferred;setResetDeferred(true);setResetConfirm(false);setSettings(false);
  }
  async function startOver(){
    if(resetBusy)return;
    const account=cloudRef.current;
    if(!account){
      if(cloudStatus==='checking'||cloudStatus==='expired'||portalName){setResetError('Reconnect to Portal before erasing this campaign.');return;}
      const fresh={...EMPTY_SAVE,completed:[],companions:[]};
      if(!writeSave(fresh)){setResetError('This device could not save the reset. Try again.');return;}
      abandonRecord('reset');clearSeen({kind:'guest'});clearLegacySaves();
      for(const kind of ['tileBomb','freeSwap'])try{localStorage.removeItem(`dune-relay:tool-lesson:v1:${tutorialScopeKey({kind:'guest'})}:${kind}`);}catch{}
      window.location.reload();return;
    }
    if(cloudStatus!=='account'||account.syncing||purchaseJournal.current||toolJournal.current?.phase==='pending'||rewardJournal.current?.phase==='pending'||giftClaiming.current){setResetError('Finish syncing or confirming the pending purchase or gift, then try again.');return;}
    const generation=cloudGeneration.current;
    if(!resetPending.current){
      setResetBusy(true);
      try{if(!await cloudApi.resetReady()){setResetError('Start over is temporarily unavailable. Your progress has not changed.');setResetBusy(false);return;}}
      catch{setResetError('Start over is temporarily unavailable. Your progress has not changed.');setResetBusy(false);return;}
    }
    if(cloudRef.current!==account||cloudGeneration.current!==generation){setResetBusy(false);return;}
    const journal={...(resetPending.current??{accountId:account.accountId,requestId:cloudApi.newOperationId(),expectedRevision:account.profile.revision,campaignGeneration:account.profile.campaignGeneration??0}),intent:'reset' as const};
    if(!cloudApi.writeResetJournal(journal)){setResetError('This device could not save the reset request. Try again.');setResetBusy(false);return;}
    resetPending.current=journal;setResetDeferred(false);setResetBusy(true);setResetError(null);
    setMode('map');setPuzzle(null);setOverlay('start');
    try{const result=await cloudApi.resetCampaign(journal);if(cloudRef.current!==account||cloudGeneration.current!==generation||resetPending.current?.requestId!==journal.requestId)return;finishPortalReset(result.profile,journal.accountId);}
    catch(error){
      if(cloudRef.current!==account||cloudGeneration.current!==generation||resetPending.current?.requestId!==journal.requestId)return;
      if((error as {code?:string}).code==='RESET_CANCELLED'){
        cloudApi.clearResetJournal(journal.accountId);resetPending.current=null;setResetError('This reset was cancelled. Your progress is unchanged.');setResetBusy(false);return;
      }
      if(Number((error as {status?:number}).status)===409){
        cloudApi.clearResetJournal(journal.accountId);resetPending.current=null;
        try{const latest=await cloudApi.campaign(journal.accountId);if(cloudRef.current===account&&latest.profile){if((latest.profile.campaignGeneration??0)!==(account.profile.campaignGeneration??0))await adoptRemoteReset(account,latest.profile);else{account.profile=latest.profile;account.pending=[];const fresh=normalizeSave(latest.profile.campaign);saveRef.current=fresh;setSave(fresh);setInventory(normalizeInventory(latest.profile.inventory));setMode('map');setPuzzle(null);setOverlay('start');cacheCloud();}}}catch{}
        setResetError('Portal progress changed before the reset. Review the current save, then choose Erase progress and start over again.');
      }else setResetError(`Reset could not be confirmed: ${(error as Error).message}. Retry, cancel, or close for now.`);
      setResetBusy(false);
    }
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
    if (saveRef.current.transition?.to === "farmland") { travelToChapter("gatehouse","farmland"); return; }
    // The server requires the demo acknowledgment as its own durable checkpoint
    // before it accepts the first Farmland transition checkpoint.
    if (saveRef.current.demoEnding === "thanks") acknowledgeDemo();
    if (saveRef.current.demoEnding !== "done") return;
    travelToChapter("gatehouse","farmland");
  }
  async function beginTown() {
    if (!saveRef.current.completed.includes("openTheHarvestRoad")) return;
    const account=cloudRef.current, generation=cloudGeneration.current;
    const sameSession=()=>cloudRef.current===account && cloudGeneration.current===generation;
    if (playtest) {
      if (saveRef.current.townReady) { visitRegion("town"); return; }
    } else {
      if (account?.pending.length) { await flushCloud(true); if (!sameSession()) return; if (account.pending.length) { setPassError(lastCloudError.current ?? "Sync the harvest chapter before traveling."); setOverlay("dunePass"); return; } }
      if ((await verifyTownPass())!=="allowed") { if (sameSession()) setOverlay("dunePass"); return; }
      if (!sameSession()) return;
      if (saveRef.current.townReady) { visitRegion("town"); return; }
    }
    if (saveRef.current.transition?.to === "town") { travelToChapter("farmland","town"); return; }
    if (saveRef.current.farmlandEnding !== "done") return;
    travelToChapter("farmland","town");
  }
  async function beginCastle() {
    if (!saveRef.current.completed.includes("openTheMarket")) return;
    const account=cloudRef.current, generation=cloudGeneration.current;
    const sameSession=()=>cloudRef.current===account && cloudGeneration.current===generation;
    if (!playtest) {
      if (account?.pending.length) { await flushCloud(true); if (!sameSession()) return; if (account.pending.length) { setPassError(lastCloudError.current ?? "Sync the town chapter before travelling."); setOverlay("dunePass"); return; } }
      if ((await verifyTownPass())!=="allowed") { if (sameSession()) setOverlay("dunePass"); return; }
      if (!sameSession()) return;
    }
    if (saveRef.current.castleReady) { visitRegion("castle"); return; }
    if (saveRef.current.transition?.to === "castle") { travelToChapter("town","castle"); return; }
    if (saveRef.current.townEnding !== "done") return;
    travelToChapter("town","castle");
  }
  async function beginRiver() {
    if (!saveRef.current.completed.includes("openTheUpstreamRoute")) return;
    const account=cloudRef.current, generation=cloudGeneration.current;
    const sameSession=()=>cloudRef.current===account && cloudGeneration.current===generation;
    if (!playtest) {
      if (account?.pending.length) { await flushCloud(true); if (!sameSession()) return; if (account.pending.length) { setPassError(lastCloudError.current ?? "Sync the castle chapter before boarding."); setOverlay("dunePass"); return; } }
      if ((await verifyTownPass())!=="allowed") { if (sameSession()) setOverlay("dunePass"); return; }
      if (!sameSession()) return;
    }
    if (saveRef.current.riverReady) { visitRegion("river"); return; }
    if (saveRef.current.transition?.to === "river") { travelToChapter("castle","river"); return; }
    if (saveRef.current.castleEnding !== "done") return;
    travelToChapter("castle","river");
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
    if (farmlandBlocked) return <><p className="farmland-status">{lastCloudError.current ?? "Sync progress to unlock Farmland."}</p><button className="farmland-action" onClick={() => void flushCloud(true)} disabled={cloudStatus==="syncing"}>Retry sync →</button></>;
    if (farmlandState==="loading") return <p className="farmland-status" role="status">Checking Farmland access…</p>;
    if (farmlandState==="claiming") return <p className="farmland-status" role="status">Unlocking Farmland…</p>;
    if (farmlandState==="error" || !farmland) return <><p className="farmland-status" role="alert">{farmlandError??"Farmland access could not be checked."}</p><button className="farmland-action" onClick={() => void (farmlandClaimId.current && farmlandEligible ? unlockFarmland() : refreshFarmland())}>Retry Farmland access →</button></>;
    if (!farmlandEligible) return <p className="farmland-status">Complete all 30 demo levels on this Portal account to unlock Farmland.</p>;
    return <button className="farmland-action" onClick={() => void unlockFarmland()}>Unlock Farmland →</button>;
  }
  function passAccess() {
    if (cloudRef.current?.pending.length) return <><p role="alert">{lastCloudError.current ?? "Your progress needs to sync before this chapter opens."}</p><button className="farmland-action" onClick={()=>void flushCloud(true)} disabled={cloudStatus==="syncing"}>Retry sync →</button></>;
    if (!cloudRef.current || cloudStatus === "expired") return <><p>Sign in through RaidGuild Portal to claim the Dune Pass. Your guest progress stays on this device.</p><a className="farmland-action" href={cloudApi.PORTAL_LOGIN_URL}>Sign in with Portal →</a></>;
    if (passChecking && !campaignPass) return <p role="status">Checking Dune Pass access…</p>;
    if (passError) return <><p role="alert">Dune Pass access could not be checked: {passError}</p><button className="farmland-action" onClick={() => void refreshPass(true)} disabled={passChecking}>{passChecking ? "Checking…" : "Retry access check"}</button></>;
    if (campaignPass?.state === "active") return <><p>Your Dune Pass is active. Continue to the next chapter.</p><button className="farmland-action" onClick={() => void (saveRef.current.completed.includes("openTheUpstreamRoute") ? beginRiver() : saveRef.current.completed.includes("openTheMarket") ? beginCastle() : beginTown())} disabled={passChecking}>Continue journey →</button></>;
    if (campaignPass?.state === "unavailable" || passError || !campaignPass) return <><p role="status">Dune Pass access could not be checked. Your current campaign is safe.</p>{passError && <p>{passError}</p>}<button className="farmland-action" onClick={() => void refreshPass(true)} disabled={passChecking}>{passChecking ? "Checking…" : "Retry access check"}</button></>;
    return <><p>Claim the Dune Pass in the RaidGuild store. Pay what you want, including $0 with Portal login. Chapter 5 is ready.</p>{campaignPass.storeUrl ? <a className="farmland-action" href={campaignPass.storeUrl}>Open the Dune Pass store →</a> : <p>The store link is not available yet.</p>}<button className="quiet" onClick={() => void refreshPass(true)} disabled={passChecking}>{passChecking ? "Checking…" : "Check access"}</button></>;
  }
  return <main className="viewport">
    <div className="frame" aria-label="Dune Relay game" data-mode={mode} data-overlay={overlay ?? "none"} data-moves={mode === "puzzle" ? puzzle?.moves : undefined} data-reduced-motion={reducedMotion}>
      {overlay !== "film" && overlay !== "start" && <GameCanvas key={`${mode}-${displayRegion}-${attempt}-${save.activeCompanion??"mechanic"}-${replayMapKey}`} mode={mode} region={displayRegion} activeCompanion={save.activeCompanion} boardCompanion={boardCompanion} mapPosition={mapPositions.current[displayRegion]} repaired={repaired} caravanComplete={save.completed.includes("lightTheRoute")} gatehouseComplete={save.completed.includes("openTheCrossing")} gateOpening={!visitedRegion && save.demoEnding === "gate"} nextLevel={mapLevel} replayDestinations={replayGroups} replayMode={replayActive} keeperMet={keeperMet} companionIntroduced={companionIntroduced} level={level} puzzle={puzzle} startingBoosters={mode === "puzzle" && !replayActive && pendingAttempt.current?.sceneAttempt === attempt && pendingAttempt.current.level === activeLevel && pendingAttempt.current.status !== "failed" ? pendingAttempt.current.placements : []} audio={sound.current} reducedMotion={reducedMotion} transitioning={wipe !== "hidden"} interactionBlocked={settings || tutorialLibrary || tutorialSession !== null || toolLesson!==null || overlay !== null || sceneIssue !== null || toolBusy || toolPending } toolMode={toolMode} authorizeTool={authorizeTool} onReady={async () => { const authorized = await authorizeSceneReady(); if (sceneReady.current?.attempt === attempt) sceneReady.current.settle(authorized ? "ready" : "failed"); return authorized; }} onFailure={reason => {
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
        {mode==='map' && !playtest && rewardAvailable.length>0 && cloudStatus==='account' && <button className="nav-button reward-nav" onClick={openGifts}>Gifts {rewardAvailable.length}</button>}
        <button className="icon-button" onClick={toggleSound} aria-label={muted ? "Unmute" : "Mute"}>{muted ? "♪̸" : "♪"}</button>
        <button className="icon-button" onClick={() => setSettings(true)} aria-label="Settings">⚙</button>
      </div>
      {revealing && mode === "puzzle" && <button className="skip-reveal" onClick={() => skipReveal.current?.()}>Skip reveal →</button>}
      {mode==='puzzle' && !replayActive && (playtest || LEVEL_ORDER.indexOf(activeLevel)>=30) && puzzle?.status==='playing' && puzzle.moves>0 && !revealing && <div className="jit-tools" aria-label="In-game tools">
        {TOOLS.map(item=><button key={item.kind} className={`jit-tool${toolMode===item.kind?' active':''}`} disabled={!boardInteractive || toolBusy || toolPending || overlay!==null || settings || tutorialSession!==null || toolLesson!==null || wipe!=='hidden'} onClick={()=>chooseTool(item.kind)} aria-pressed={toolMode===item.kind} aria-label={`${item.title}, ${inventory[item.kind]} owned`}><img src={assetUrl(item.image as `/${string}`)} alt=""/><span>{item.title}</span><b>{inventory[item.kind] || '+'}</b></button>)}
        {toolMode && <div className="jit-instruction">{TOOLS.find(item=>item.kind===toolMode)?.instruction}<button disabled={toolPending} onClick={()=>{if(toolJournal.current?.phase==='pending'||toolJournal.current?.phase==='confirmed')return;setToolMode(null);setToolError(null);}}>Cancel</button></div>}
        {toolPending && <button className="jit-retry" disabled={toolBusy} onClick={()=>void retryPendingTool()}>Retry pending tool action</button>}
        {toolError && <div className="jit-error" role="alert">{toolError}</div>}
      </div>}
      {fullscreenAvailable && !isFullscreen && !installApp.isAppWindow && overlay === null && !settings && !tutorialLibrary && !tutorialSession && <button className="fullscreen-return" onClick={() => requestGameFullscreen()}>⛶ Full screen</button>}
      {fullscreenIssue && <div className="fullscreen-issue" role="status">{fullscreenIssue}</div>}
      {fullscreenEmbeddedBlocked && <a className="fullscreen-new-tab" href={typeof window === "undefined" ? undefined : window.location.href} target="_blank" rel="noopener noreferrer">Open game in a new tab ↗</a>}
      {overlay === "start" && <div className={`scrim intro${isRiver ? " intro-river" : isCastle ? " intro-castle" : isTown ? " intro-town" : isFarmland ? " intro-farmland" : isGatehouse ? " intro-gatehouse" : isCaravan ? " intro-caravan" : ""}`}><div className="intro-card">
        <div className="eyebrow">A RAIDGUILD ADVENTURE</div><h1>DUNE<br />RELAY</h1>
        <p>{isRiver ? "Water is moving upstream, but it is not reaching the waiting people. Board Skiff’s boat and follow the current." : isCastle ? "The town's delivery ledger leads across the water. Meet the Quartermaster at the castle dock and choose who will lead the raid upstream." : isTown ? save.completed.includes("openTheMarket") ? "The evening market is open. The story continues toward Castle Island." : "The harvest ledger points to missing deliveries in the evening market. Find the Town Crier." : isFarmland ? save.completed.includes("openTheHarvestRoad") ? "The harvest road is open. The next clue points to the town on the hill." : "Beyond the bridge, sealed seed stores are holding up the harvest convoy. Find the Fieldkeeper." : demoComplete ? "The bridge is open. Your party has cleared the demo journey. Explore the kingdom to see what lies ahead." : isGatehouse ? "The caravan has reached the river. The Gatewright needs our help opening the crossing." : save.completed.includes("lightTheRoute") ? "The beacon lights the desert road. The caravan chapter is complete." : isCaravan ? "The waterway is alive. The caravan road is open." : available === "caravanPennants" ? "The pump house has come to life. A new route waits beyond the oasis." : repaired ? "The intake is flowing. Follow the path to the next station." : "The oasis pump has gone quiet. Find the keeper, bring the machine to life, and follow the water."}</p>
        <button className="primary" disabled={cloudStatus === "checking" || (cloudStatus === "expired" && !cloudRef.current)} onClick={enter}>{save.oasisTransition !== "locked" && save.oasisTransition !== "ready" ? "Continue the journey" : isRiver ? "Board the river boat" : isCastle ? "Enter Castle Island" : isTown ? "Enter the town" : isFarmland ? "Enter the fields" : isGatehouse ? "Enter the gatehouse" : isCaravan ? "Enter the desert" : "Enter the oasis"} <span>↗</span></button>
        {!playtest && rewardAvailable.length>0 && cloudStatus==='account' && <button className="quiet reward-title" onClick={openGifts}>Gifts waiting ({rewardAvailable.length}) →</button>}
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
        <p>Choose starting boosters. Owned copies are used first; any others cost coins when the level starts.</p>
        <div className="shop-balance">{save.coins.toLocaleString("en-US")} coins available{playtest && <small>Test wallet · campaign coins stay untouched</small>}</div>
        <div className="booster-options">{BOOSTERS.map(item => { const selected=shopSelected.includes(item.kind); const shortfall=loadoutCost([...shopSelected,item.kind])-save.coins; const unresolved=pendingAttempt.current?.status === "failed" && pendingAttempt.current.selected.length > 0; const unavailable=unresolved || !selected && shortfall > 0; return <button key={item.kind} className={`booster-option${selected ? " selected" : ""}`} aria-pressed={selected} disabled={unavailable} onClick={() => toggleBooster(item.kind)}>
          <img src={assetUrl(item.image as `/${string}`)} alt="" />
          <strong>{item.title}</strong><small>{item.description}</small><b>{inventory[item.kind]>0?`Owned: ${inventory[item.kind]}`:`${item.cost} coins`}</b>{unavailable && shortfall > 0 && <small className="booster-shortfall">Need {shortfall.toLocaleString("en-US")} more</small>}
        </button>; })}</div>
        <div className="shop-total">Total: {loadoutCost(shopSelected).toLocaleString("en-US")} coins</div>
        {pendingAttempt.current?.status === "failed" && pendingAttempt.current.selected.length > 0 && <p className="shop-error" role="status">This purchase still needs confirmation. Retry it to avoid a second charge.</p>}
        {shopError && <p className="shop-error" role="alert">{shopError}</p>}
        <div className="shop-actions"><button className="quiet" onClick={cancelShop}>Back</button><div className="shop-launch-actions">{shopSelected.length > 0 && !(pendingAttempt.current?.status === "failed" && pendingAttempt.current.selected.length > 0) && <button className="quiet" onClick={() => { setShopSelected([]); void launchLevel([]); }}>Play without boosters</button>}<button className="primary" onClick={() => void launchLevel([...shopSelected])}>{pendingAttempt.current?.status === "failed" && pendingAttempt.current.selected.length > 0 ? "Retry purchase" : shopSelected.length ? `Start level · ${loadoutCost(shopSelected).toLocaleString("en-US")} coins` : "Start level"} <span>→</span></button></div></div>
      </div></div>}
      {overlay==='toolGift' && <div className="scrim"><div className="dialog-card tool-gift" role="dialog" aria-modal="true" aria-label="Fieldkeeper's toolkit"><header className="tool-gift-header"><span className="speaker">{playtest?'PLAYTEST PREVIEW · ':''}A GIFT FROM THE FIELDKEEPER</span><h2>Field Toolkit</h2></header><div className="tool-gift-body"><img className="tool-gift-hero" src={assetUrl('/sprites/field-toolkit.png')} alt=""/><div className="tool-gift-copy"><p>Try a Tile Bomb and a Free Swap during a level. Each is free to use and does not spend a move.</p><div className="tool-gift-items">{TOOLS.map(item=><span key={item.kind}><img src={assetUrl(item.image as `/${string}`)} alt=""/>{item.title} × 1</span>)}</div>{giftError&&<p role="alert">{giftError}</p>}</div></div><footer className="tool-gift-actions"><button className="primary" disabled={giftClaiming.current || playtest&&giftPreviewClaimed.current} onClick={()=>void claimToolkit()}>Take the toolkit →</button><button className="quiet" onClick={()=>setOverlay(null)}>Maybe later</button></footer></div></div>}
      {overlay==='gifts' && <div className="scrim"><div className="dialog-card reward-inbox" role="dialog" aria-modal="true" aria-label="Gifts">
        <header><span className="speaker">{rewardPreview.current?'PLAYTEST PREVIEW · ':''}RAID PARTY GIFTS</span><h2>Gifts</h2></header>
        <div className="reward-inbox-body">
          <div className="reward-streak" aria-label="Five day visit cycle">{[1,2,3,4,5].map(day=><span key={day} className={(rewardPreview.current?day===3:day===(dailyVisit?.cycleDay??rewardOffers?.dailyVisit?.cycleDay??1))?'current':''}><b>{day}</b><small>{['100','200','2 items','500','1,000'][day-1]}</small></span>)}</div>
          <p className="reward-streak-copy">{rewardPreview.current?'Preview the five-day cycle':`Day ${dailyVisit?.cycleDay??rewardOffers?.dailyVisit?.cycleDay??1} of 5 · opening the game counts as a visit`}</p>
          <p>{rewardPreview.current?'Preview gifts without changing your campaign.':'Open a daily gift when you visit, and a chapter gift after each chapter.'}</p>
          <div className="reward-inbox-list">{(rewardPreview.current?previewRewards:rewardAvailable).map(item=><button className="reward-inbox-item" data-reward-key={item.key} key={item.key} onClick={()=>openReward(item,rewardPreview.current)}><img src={assetUrl('/sprites/field-toolkit.png')} alt=""/><span><strong>{item.title}</strong><small>{item.status==='claimed-unpresented'?'Ready to reveal':item.cycleDay?`Day ${item.cycleDay} of 5`:'Chapter complete'}</small></span><b>Open →</b></button>)}{!rewardPreview.current && rewardAvailable.length===0 && <p>Nothing to open right now. The next daily gift arrives at 00:00 UTC.</p>}</div>
          {rewardPreview.current && <p className="reward-preview-count">Preview total: {previewRewardCoins} coins · {Object.entries(previewRewardItems).filter(([,n])=>n).map(([kind,n])=>`${kind} × ${n}`).join(', ')||'no items yet'}</p>}
        </div><footer><button className="quiet" onClick={closeGifts}>Close</button></footer>
      </div></div>}
      {overlay==='rewardGift' && rewardSelection && (()=>{
        const payload=rewardSelection.award?.payload??rewardSelection.payload;
        const grants=cloudApi.rewardPayloadItems(payload);
        const isDaily=rewardSelection.key.startsWith('daily:')||rewardSelection.key.startsWith('preview:daily');
        const selectedDailyCycle=rewardSelection.cycleDay??(rewardSelection.key===`daily:${dailyVisit?.day}`?dailyVisit?.cycleDay:undefined);
        return <div className="scrim"><div className="dialog-card reward-gift" role="dialog" aria-modal="true" aria-label={`${rewardSelection.title} gift`} data-reward-key={rewardSelection.key} data-phase={rewardBusy&&rewardStage==='sealed'?'pending':rewardStage}>
          <header><span className="speaker">{rewardPreview.current?'PLAYTEST PREVIEW · ':''}{isDaily?(selectedDailyCycle?`DAILY VISIT · DAY ${selectedDailyCycle} OF 5`:'SAVED DAILY GIFT'):'CHAPTER COMPLETE'}</span><h2>{rewardSelection.title}</h2></header>
          <div className="reward-gift-body"><div className={`reward-parcel ${rewardStage}`}><img src={assetUrl('/sprites/field-toolkit.png')} alt=""/></div><div className="reward-gift-copy">
            {rewardStage==='revealed'?<><p>Your gift is ready!</p>{payload.coins>0 && <strong className="reward-coins"><img src={assetUrl('/sprites/coin.png')} alt=""/>+{payload.coins} coins</strong>}{grants.length>0 && <div className="reward-item">{grants.map(grant=>[...TOOLS,...BOOSTERS].filter(item=>item.kind===grant.item).map(item=><span key={item.kind}><img src={assetUrl(item.image as `/${string}`)} alt=""/>+{grant.quantity} {item.title}</span>))}</div>}</>:<><p>{rewardJournal.current?.phase==='pending'&&!rewardPreview.current?'Checking this gift with Portal…':isDaily&&selectedDailyCycle===3?'Two random power-ups await inside.':'A little something for your journey.'}</p>{grants.length>0 && !(isDaily&&selectedDailyCycle===3) && <div className="reward-item reward-peek" aria-label="Gift items">{grants.map(grant=>[...TOOLS,...BOOSTERS].filter(item=>item.kind===grant.item).map(item=><span key={item.kind}><img src={assetUrl(item.image as `/${string}`)} alt=""/>{grant.quantity>1?`× ${grant.quantity}`:''}</span>))}</div>}</>}
            {rewardError&&<p className="reward-error" role="alert">{rewardError}</p>}
          </div></div>
          <footer className="reward-gift-actions">{rewardStage==='sealed' && <button className="primary" disabled={rewardBusy} onClick={()=>void claimSelectedReward()}>{rewardJournal.current?.phase==='pending'?'Retry gift request':'Open gift'} →</button>}{rewardStage==='revealed' && <button className="primary" disabled={rewardBusy} onClick={()=>void finishReward()}>Continue →</button>}<button className="quiet" disabled={rewardBusy||rewardJournal.current?.phase==='pending'&&!rewardPreview.current} onClick={leaveReward}>Maybe later</button></footer>
        </div></div>;
      })()}
      {overlay==='toolBuy' && toolBuying && <div className="scrim"><div className="dialog-card tool-buy" role="dialog" aria-modal="true" aria-label={`Buy ${TOOLS.find(item=>item.kind===toolBuying)?.title}`}><span className="speaker">IN-GAME TOOL</span><h2>{TOOLS.find(item=>item.kind===toolBuying)?.title}</h2><img src={assetUrl(TOOLS.find(item=>item.kind===toolBuying)!.image as `/${string}`)} alt=""/><p>{TOOLS.find(item=>item.kind===toolBuying)?.instruction}</p><p>{TOOL_PRICE} coins · {save.coins.toLocaleString('en-US')} available</p>{toolError&&<p role="alert">{toolError}</p>}<div className="briefing-actions"><button className="quiet" disabled={toolBusy || Boolean(purchaseJournal.current)} onClick={()=>{setToolBuying(null);setToolError(null);setOverlay(null);}}>Cancel</button><button className="primary" disabled={toolBusy || save.coins<TOOL_PRICE} onClick={()=>void buyTool(toolBuying)}>{purchaseJournal.current?'Retry purchase':`Buy · ${TOOL_PRICE} coins`}</button></div></div></div>}
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
            {save.completed.includes("openTheUpstreamRoute") && <><path className="atlas-path-shadow" d="M1030 470 Q915 470 835 420 Q750 370 750 290" /><path className="atlas-path-light" data-route="castle-river" d="M1030 470 Q915 470 835 420 Q750 370 750 290" /></>}
            {kingdomPreview && <path className="atlas-preview-line" d={`M${kingdomPreview.label.x+100} ${kingdomPreview.label.y+60} Q${kingdomPreview.anchor.x-80} ${kingdomPreview.anchor.y-55} ${kingdomPreview.anchor.x} ${kingdomPreview.anchor.y}`} />}
          </svg>
          <span className="atlas-anchor oasis-anchor" /><span className="atlas-anchor caravan-anchor" /><span className="atlas-anchor bridge-anchor" />{demoComplete && <><span className="atlas-anchor farmland-anchor" /><span className="atlas-anchor town-anchor" /><span className="atlas-anchor castle-anchor" /></>}
          {save.completed.includes("openTheUpstreamRoute") && <span className="atlas-anchor river-anchor" aria-hidden="true" />}
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
        {overlay === "atlas" && <button className="primary atlas-action" onClick={travelToCaravan}>{save.transition?.to === "river" ? "Board the river boat" : save.transition?.to === "castle" ? "Cross to Castle Island" : save.transition?.to === "town" ? "Travel to Town on the Hill" : save.transition?.to === "farmland" ? "Cross into Farmland" : save.transition?.to === "gatehouse" ? "Travel to the river bridge" : "Travel to the caravan"} <span>→</span></button>}
        <button className="quiet atlas-close" onClick={()=>setOverlay(null)}>{overlay==="atlas"?"Stay here":"Return to the path"}</button>
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
        <h2>The convoy can move</h2><p>The seed stores are open and the terraces are flowing. The ledger points to missing deliveries at Town on the Hill. Tap Town on the kingdom map to continue{passUnlocked ? "." : " after claiming the Dune Pass in the RaidGuild store. A $0 claim is available with Portal login."}</p>
        <button className="primary" onClick={() => { if (saveRef.current.farmlandEnding === "thanks") persist(normalizeSave({ ...saveRef.current, farmlandEnding: "done" })); if(passUnlocked){persist(normalizeSave({...saveRef.current,transition:{from:"farmland",to:"town",stage:"handoff"}}));persist(advanceChapterTransition(saveRef.current,"handoff","atlas"));setOverlay("atlas");}else{setOverlay("kingdom");void refreshPass();} }}>View Town on the map <span>→</span></button>
      </div></div>}
      {overlay === "townOpen" && <div className="scrim demo-ending"><div className="demo-confetti" data-paused={wipe !== "hidden"} aria-hidden="true">{Array.from({length:32},(_,index)=><span key={index} style={{"--x":`${(index*31+7)%100}%`,"--drift":`${(index*13%21)-10}cqw`,"--spin":`${360+index*29}deg`,"--delay":`${index%8*75}ms`,"--duration":`${2400+index%5*180}ms`,backgroundColor:["#ffd77d","#78dfca","#e8ad59","#df8b73"][index%4]} as CSSProperties}/>)}</div><div className="dialog-card demo-thanks">
        <div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/towncrier-avatar.png")} alt=""/><span className="speaker">THE TOWN CRIER · MARKET OPEN</span></div>
        <h2>THE MARKET IS OPEN</h2><p>The castle-bound delivery records still disagree. The Quartermaster keeps another ledger across the water at Castle Island. Tap Castle Island on the map to continue.</p>
        <button className="primary" onClick={()=>{persist(normalizeSave({...saveRef.current,townEnding:"done",transition:{from:"town",to:"castle",stage:"handoff"}}));persist(advanceChapterTransition(saveRef.current,"handoff","atlas"));setOverlay("atlas");}}>View Castle Island on the map <span>→</span></button>
        <button className="quiet" onClick={()=>{persist(normalizeSave({...saveRef.current,townEnding:"done"}));setOverlay(null);}}>Stay in Town</button>
      </div></div>}
      {overlay === "skiff" && <div className="scrim"><div className="dialog-card"><div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/skiff-avatar.png")} alt=""/><span className="speaker">SKIFF · RIVER PILOT</span></div><p>Water’s still moving. Trouble is, it’s not reaching the people waiting for it. This boat will carry us bend by bend. Match tiles in the current as usual; after each valid move, each clear channel carries its tiles one space along its arrows. A salted channel stops until you clear it. Choose a raid member to lead while I steer.</p><button className="primary" onClick={openRiver}>Take the helm <span>→</span></button></div></div>}
      {overlay === "riverOpen" && <div className="scrim demo-ending"><div className="demo-confetti" data-paused={wipe !== "hidden"} aria-hidden="true">{Array.from({length:32},(_,index)=><span key={index} style={{"--x":`${(index*31+7)%100}%`,"--drift":`${(index*13%21)-10}cqw`,"--spin":`${360+index*29}deg`,"--delay":`${index%8*75}ms`,"--duration":`${2400+index%5*180}ms`,backgroundColor:["#ffd77d","#78dfca","#e8ad59","#df8b73"][index%4]} as CSSProperties}/>)}</div><div className="dialog-card demo-thanks"><div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/skiff-avatar.png")} alt=""/><span className="speaker">SKIFF · THE UPSTREAM ROUTE</span></div><h2>THE RIVER ROUTE IS OPEN</h2><p>Skiff brings the repair boat through the last bend. Beyond it, the water collection station waits among the upper oases. The raid continues soon.</p><button className="primary" onClick={()=>{persist(normalizeSave({...saveRef.current,riverEnding:"done"}));setOverlay("kingdom");}}>View the Kingdom Map <span>→</span></button><button className="quiet" onClick={()=>{persist(normalizeSave({...saveRef.current,riverEnding:"done"}));setOverlay(null);}}>Return to the boat</button></div></div>}
      {overlay === "quartermaster" && <div className="scrim"><div className="dialog-card"><div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/quartermaster-avatar.png")} alt=""/><span className="speaker">THE QUARTERMASTER · CASTLE DOCK</span></div><p>The town sent one manifest. My storehouse holds another. The water route runs upstream from this dock, but first we must clear the stores and reconcile the crates. Choose who leads your raid party; their familiar power will help us.</p><button className="primary" onClick={openCastle}>Choose your leader <span>→</span></button></div></div>}
      {overlay === "castleOpen" && <div className="scrim demo-ending"><div className="demo-confetti" data-paused={wipe !== "hidden"} aria-hidden="true">{Array.from({length:32},(_,index)=><span key={index} style={{"--x":`${(index*31+7)%100}%`,"--drift":`${(index*13%21)-10}cqw`,"--spin":`${360+index*29}deg`,"--delay":`${index%8*75}ms`,"--duration":`${2400+index%5*180}ms`,backgroundColor:["#ffd77d","#78dfca","#e8ad59","#df8b73"][index%4]} as CSSProperties}/>)}</div><div className="dialog-card demo-thanks"><div className="speaker-row"><img className="speaker-avatar" src={assetUrl("/sprites/quartermaster-avatar.png")} alt=""/><span className="speaker">THE QUARTERMASTER · UPSTREAM ROUTE</span></div><h2>THE UPSTREAM ROUTE IS OPEN</h2><p>The castle manifest is reconciled. Skiff’s boat waits upstream. Tap River Journey on the kingdom map to board.</p><button className="primary" onClick={()=>{persist(normalizeSave({...saveRef.current,castleEnding:"done",riverReady:false,transition:{from:"castle",to:"river",stage:"handoff"}}));persist(advanceChapterTransition(saveRef.current,"handoff","atlas"));setOverlay("atlas");}}>View the river route <span>→</span></button><button className="quiet" onClick={()=>{persist(normalizeSave({...saveRef.current,castleEnding:"done",riverReady:false}));setOverlay(null);}}>Stay on Castle Island</button></div></div>}
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
        <p>You completed all 30 demo levels. Farmland opens next with a free RaidGuild Portal login. On the kingdom map, tap Farmland to sign in or unlock it, then continue the story.</p>
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
        <button className="primary" onClick={finish}>{activeLevel === "openWaterway" ? "See the pump awaken" : activeLevel === "lightTheRoute" ? "See the walkers depart" : activeLevel === "openTheCrossing" ? "See the bridge open" : activeLevel === "openTheMarket" ? "See the market open" : activeLevel === "openTheHarvestRoad" ? "See the harvest road open" : activeLevel === "openTheUpstreamRoute" ? "See the upstream route" : activeLevel === "openTheCollectionRoute" ? "See the boat head upstream" : level.chapter === "river" ? "Return to the river boat" : level.chapter === "castle" ? "Return to Castle Island" : level.chapter === "town" ? "Return to the market" : level.chapter === "farmland" ? "Return to the fields" : level.chapter === "gatehouse" ? "Return to the gatehouse" : level.chapter === "caravan" ? "Return to the caravan" : "Follow the water"} <span>→</span></button>
      </div></div>}
      {tutorialSession && <TutorialDialog key={`${tutorialSession.mode}-${tutorialSession.tutorial.id}`} tutorial={tutorialSession.tutorial} mode={tutorialSession.mode} reducedMotion={reducedMotion} onSkip={()=>dismissTutorial(true)} onContinue={()=>dismissTutorial(true)} onBack={()=>dismissTutorial(false)} />}
      {toolLesson && <ToolLesson kind={toolLesson.kind} replay={toolLesson.replay} reducedMotion={reducedMotion} onDone={()=>finishToolLesson(true)} onBack={()=>finishToolLesson(false)} />}
      {tutorialLibrary && !tutorialSession && !toolLesson && <div className="scrim tutorial-scrim"><div className="dialog-card tutorial-library" role="dialog" aria-modal="true" aria-label="How to play"><span className="speaker">HOW TO PLAY</span><h2>Lessons</h2><div className="tutorial-library-list">{TUTORIALS.filter(t=>tutorialAvailable(t,save.completed,mapLevel,farmlandUnlocked,playtest,readSeen(currentTutorialScope()))).map(t=><button key={t.id} data-tutorial-item={t.id} onClick={()=>openTutorialReplay(t)}>{t.title}<small>{t.summary}</small></button>)}{(save.farmlandReady||playtest)&&TOOLS.map(item=><button key={item.kind} onClick={()=>{setTutorialLibrary(false);setToolLesson({kind:item.kind,replay:true});}}>{item.title}<small>{item.instruction}</small></button>)}</div><button className="quiet" onClick={()=>{setTutorialLibrary(false);setSettings(true);}}>Back to Settings</button></div></div>}
      {settings && <div className="scrim"><div className="dialog-card settings-card">
        <span className="speaker">SETTINGS</span>
        {(save.farmlandReady || playtest || Object.values(inventory).some(count=>count>0)) && <div className="settings-inventory"><strong>Inventory</strong><div>{[...TOOLS,...BOOSTERS].map(item=><span key={item.kind}><img src={assetUrl(item.image as `/${string}`)} alt=""/>{item.title} × {inventory[item.kind]}</span>)}</div></div>}
        {!playtest && cloudRef.current?.profile.campaign.farmlandReady && !cloudRef.current.profile.rewardClaims?.fieldToolkitV1 && <button className="setting" onClick={()=>{setSettings(false);setGiftError(null);setOverlay('toolGift');}}>Claim Fieldkeeper's toolkit <span>→</span></button>}
        {!playtest && cloudRef.current && cloudStatus==='account' && mode==='map' && <button className="setting" onClick={openGifts}>Gifts <strong>{rewardAvailable.length} waiting</strong></button>}
        {!playtest && <><small className="setting-note">{portalName ? `${portalName} · ${cloudStatus === "account" ? "Saved to Portal" : cloudStatus === "syncing" ? "Saving" : "Saved locally, waiting to sync"}` : "Guest progress is saved on this device."}</small>{cloudMessage && <small className="setting-note" role="status">{cloudMessage}</small>}
          {cloudStatus === "expired" && <a className="setting" href={cloudApi.PORTAL_LOGIN_URL}>Sign in to Portal again</a>}
          {cloudConflict.current && cloudRef.current && <><button className="setting" onClick={downloadCloudBackup}>Download unsynced backup</button><button className="setting" onClick={() => void usePortalSave()}>Use Portal save</button></>}
          {portalName && cloudRef.current ? <><button className="setting" onClick={() => void flushCloud(true)}>{cloudConflict.current ? "Retry sync" : "Sync now"}</button>{lastCloudError.current && <small className="setting-note" role="alert">{lastCloudError.current}</small>}<button className="setting" onClick={() => void signOut()}>Sign out of Portal</button></> : !portalName ? <a className="setting" href={cloudApi.PORTAL_LOGIN_URL}>Sign in with RaidGuild Portal</a> : null}</>}
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
          <button className="setting" onClick={()=>{giftPreviewClaimed.current=false;setGiftError(null);setSettings(false);setOverlay('toolGift');}}>Preview Fieldkeeper gift</button>
          <button className="setting" onClick={()=>{rewardReturnOverlay.current=overlay==='start'?'start':null;rewardPreview.current=true;setSettings(false);setOverlay('gifts');}}>Preview daily and chapter gifts</button>
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
        </> : <button className="reset" disabled={cloudStatus==='checking'||cloudStatus==='expired'} onClick={()=>{setResetError(null);setResetConfirm(true);}}>Start over</button>}
      </div></div>}
      {resetDeferred && <div className="reset-deferred-note" role="status">Start over needs confirmation. Progress is paused. <button onClick={()=>{setResetDeferred(false);setResetConfirm(true);}}>Resolve</button></div>}
      {resetConfirm && <div className="scrim reset-scrim"><div className="dialog-card reset-confirm" role="dialog" aria-modal="true" aria-label="Start over permanently?" onKeyDown={event=>{if(event.key==='Escape'&&!resetBusy){if(resetPending.current)closePendingReset();else{setResetConfirm(false);setResetError(null);}}if(event.key==='Tab'){const buttons=[...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])')];if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}}>
        <span className="speaker">PERMANENT RESET</span><h2>Start over permanently?</h2>
        <p>This permanently erases your story progress, completed levels, coins, and inventory {cloudRef.current?'on all your Portal devices':'on this device'}. You’ll start again at the Oasis. This cannot be undone.</p>
        <p>Your Portal login and unlocked access stay. Previously claimed gifts cannot be claimed again. Unsynced progress will also be erased.</p>
        {resetError&&<p className="reset-error" role="alert">{resetError}</p>}
        <div className="reset-actions"><button className="quiet" autoFocus disabled={resetBusy} onClick={()=>{if(resetPending.current)void cancelPendingReset(resetPending.current);else{setResetConfirm(false);setResetError(null);}}}>{resetPending.current?.intent==='cancel'?'Retry cancellation':'Cancel'}</button><button className="quiet" disabled={resetBusy} onClick={exportBeforeReset}>Export progress first</button>{resetPending.current && <button className="quiet" disabled={resetBusy} onClick={closePendingReset}>Close for now</button>}{resetPending.current?.intent!=='cancel' && <button className="primary" disabled={resetBusy} onClick={()=>void startOver()}>{resetPending.current?'Retry reset':'Erase progress and start over'}</button>}</div>
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
