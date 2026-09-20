const shapes: Record<string, string> = {
  Quarry: '<path d="m8 48 7-19 13-7 11 7 9 19Zm17 0 3-26m11 7-2 19M13 37h31"/>',
  Spire: '<path d="M20 51V27h7V16l5-10 5 10v11h7v24ZM14 51h36M27 27h10M29 51V39h6v12"/>',
  Harbor: '<path d="M32 8v33m0-31L16 30h16m4-15 13 15H36M12 41h40l-8 10H21ZM8 57q6-6 12 0 6 6 12 0 6-6 12 0 6 6 12 0"/>',
  Orchard: '<path d="M29 53V33h6v20M21 53h23"/><path d="M17 33C3 28 12 13 22 16c0-16 23-16 23 0 13-3 18 18 4 20H19Z"/>',
  Hammer: '<path d="m13 10 30 10-5 13-30-10Zm14 20-9 25 8 3 9-26M43 20l8 3-4 13-9-3"/>',
  Leaf: '<path d="M15 46C6 19 33 9 52 10c2 29-12 48-37 36Zm-5 9 31-32M22 43V30m9 4h11"/>',
  Lantern: '<path d="M22 17V12a10 10 0 0 1 20 0v5M18 21h28l4 32H14ZM14 53h36M20 17h24M22 26v21m20-21v21"/><path d="M32 28c-12 14-4 20 0 20s11-7 0-20Z"/>',
  Wave: '<path d="M7 27c10 7 17 3 20-7 5-17 24-15 28 0-11-9-18 4-11 10M7 40q8-8 16 0t16 0 17 0M7 52q8-8 16 0t16 0 17 0"/>',
};
export function routeSymbol(name: string) {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name] ?? ''}</svg>`;
}
