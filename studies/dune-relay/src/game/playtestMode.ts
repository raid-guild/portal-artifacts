// Next replaces this expression at build time. Public artifacts force it off.
const sandboxBuilt = process.env.NEXT_PUBLIC_DUNE_PLAYTEST === "1";

export function isPlaytestMode(search: string): boolean {
  return sandboxBuilt && new URLSearchParams(search).get("playtest") === "1";
}
