"use client";

import { useEffect, useRef } from "react";
import { assetUrl } from "./assetUrl";

type Props = { open: boolean; ios: boolean; embedded: boolean; onClose: () => void };

export function InstallDialog({ open, ios, embedded, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); onCloseRef.current(); return; }
      if (event.key !== "Tab") { event.stopImmediatePropagation(); return; }
      const focusable = Array.from(cardRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !cardRef.current?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !cardRef.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      event.stopImmediatePropagation();
    };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); if (previous?.isConnected) previous.focus(); };
  }, [open]);
  if (!open) return null;
  const directUrl = typeof window === "undefined" ? assetUrl("/") : `${window.location.origin}${assetUrl("/")}`;
  return <div className="install-scrim" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={cardRef} className="install-card" role="dialog" aria-modal="true" aria-label="Install Dune Relay">
      <img src={assetUrl("/icons/dune-relay-192.png")} alt="" width="72" height="72" />
      <span className="speaker">TAKE THE JOURNEY WITH YOU</span>
      <h2>Install Dune Relay</h2>
      {embedded && <p>Open the game in its own browser tab before installing.</p>}
      {ios ? <p>In Safari, tap Share, then <strong>Add to Home Screen</strong>. Open the new icon to play as an app.</p>
        : <p>Use your browser menu and choose <strong>Install app</strong> or <strong>Add to Home Screen</strong>. Open the new icon to play as an app.</p>}
      <p className="install-online">An internet connection is currently required. Guest saves may stay in the original browser on some phones. Sign in with Portal first if you want progress to follow you into the installed app and across devices.</p>
      <div className="install-actions">
        {embedded && <a className="primary" href={directUrl} target="_blank" rel="noopener noreferrer">Open game ↗</a>}
        <button ref={closeRef} className="quiet" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>;
}
