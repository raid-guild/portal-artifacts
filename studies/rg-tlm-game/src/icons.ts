export function icon(name: string): string {
  const drawings: Record<string, string> = {
    wrench: '<path d="M39 10a14 14 0 0 0-17 18L8 43a7 7 0 0 0 10 10l15-15a14 14 0 0 0 18-17L40 32l-8-8Z"/>',
    notebook: '<path d="M17 10h30v44H17q-5 0-5-5V15q0-5 5-5Z" fill="#bc9259"/><path d="M18 10v44M39 10v44"/><path d="M23 23h11m-11 7h11m-11 7h7"/>',
    plate: '<path d="m9 25 32-8 15 15-32 12L8 33Z" fill="#74918a"/><path d="m8 33 16 11 32-12v6L24 50 8 39Z" fill="#3d6462"/><path d="m15 27 6-2m20 1 5-2m-20 14 6-2m14-3 5-2" stroke-width="4"/>',
    jack: '<path d="M16 51h32v6H16zm7-16h18v16H23z" fill="#607d74"/><path d="M29 15h6v23h-6z" fill="#c8aa72"/><path d="M23 10h18v6H23z" fill="#607d74"/><path d="M35 23h10V9h11v9M27 20h10m-10 5h10m-10 5h10"/>',
    brief: '<path d="M14 10h36v44H14z" fill="#d9c28e"/><path d="M21 22h22M21 31h16M21 40h20"/><path d="M14 10l6 5 7-5 7 5 7-5 9 6"/>',
    key: '<circle cx="23" cy="25" r="12" fill="#bd9151"/><path d="M31 33l20 20m-8-8 6-6m-12 0 6-6"/><circle cx="23" cy="25" r="4"/>',
    thread: '<path d="M11 48c9-25 17 2 26-23 5-14 11-11 16-9"/><circle cx="11" cy="48" r="4" fill="#5c8f8b"/><circle cx="53" cy="16" r="4" fill="#5c8f8b"/><path d="M18 44c4 4 8 5 12 2" stroke="#d39a68"/>',
    eye: '<path d="M6 32s9-15 26-15 26 15 26 15-9 15-26 15S6 32 6 32Z"/><circle cx="32" cy="32" r="7"/>',
    spark: '<path d="m32 6 6 20 20 6-20 6-6 20-6-20-20-6 20-6Z"/>',
    arrow: '<path d="M12 32h38M36 18l14 14-14 14"/>',
    compass: '<circle cx="32" cy="32" r="23"/><path d="m40 21-5 14-14 8 7-16Z" fill="currentColor"/>',
  };
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${drawings[name] ?? drawings.spark}</svg>`;
}
