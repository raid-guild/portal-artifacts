// Next's basePath prefixes its own chunks, but public assets loaded by Phaser,
// plain image/video elements, and CSS still need an explicit prefix.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetUrl(path: `/${string}`): string {
  return `${basePath}${path}`;
}
