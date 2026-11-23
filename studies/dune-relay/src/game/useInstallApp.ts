"use client";

import { useEffect, useRef, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function appWindow() {
  if (window.self !== window.top) return false;
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia("(display-mode: standalone)").matches;
}

export function useInstallApp() {
  const [isAppWindow, setIsAppWindow] = useState(false);
  const [installCompleted, setInstallCompleted] = useState(false);
  const [promptAvailable, setPromptAvailable] = useState(false);
  const [promptBusy, setPromptBusy] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const promptRef = useRef<InstallPromptEvent | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const sync = () => setIsAppWindow(previous => previous || appWindow());
    setIsAppWindow(appWindow());
    setIsIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsEmbedded(window.self !== window.top);
    const standalone = window.matchMedia("(display-mode: standalone)");
    const before = (event: Event) => {
      event.preventDefault();
      promptRef.current = event as InstallPromptEvent;
      setPromptAvailable(true);
    };
    const installed = () => {
      promptRef.current = null;
      setPromptAvailable(false);
      setInstallCompleted(true);
      sync();
    };
    window.addEventListener("beforeinstallprompt", before);
    window.addEventListener("appinstalled", installed);
    standalone.addEventListener("change", sync);
    window.addEventListener("pageshow", sync);
    return () => {
      window.removeEventListener("beforeinstallprompt", before);
      window.removeEventListener("appinstalled", installed);
      standalone.removeEventListener("change", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, []);

  function install() {
    if (isAppWindow || installCompleted || busyRef.current) return;
    const event = promptRef.current;
    if (!event) { setHelpOpen(true); return; }
    promptRef.current = null;
    setPromptAvailable(false);
    busyRef.current = true;
    setPromptBusy(true);
    // A native install prompt needs the click's user activation. Do not await
    // sound, transition, state updates or any other async work before prompt().
    let prompted: Promise<void>;
    try { prompted = event.prompt(); }
    catch { prompted = Promise.reject(new Error("Install prompt unavailable")); }
    void prompted.then(() => event.userChoice).then(choice => {
      if (choice.outcome === "accepted") setInstallCompleted(true);
      else setHelpOpen(true);
    }).catch(() => setHelpOpen(true)).finally(() => {
      busyRef.current = false;
      setPromptBusy(false);
    });
  }

  return { isAppWindow, installCompleted, promptAvailable, promptBusy, helpOpen, setHelpOpen, isIos, isEmbedded, install };
}
