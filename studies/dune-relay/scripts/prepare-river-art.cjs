// Technical asset preparation only: format conversion, atlas scaling and frame bounds.
// Usage: node scripts/prepare-river-art.cjs BOAT_PNG CLEAN_SKIFF_SHEET_PNG AVATAR_PNG
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const output = path.resolve(__dirname, '../public');

async function main() {
  const [boat, sheet, avatar] = process.argv.slice(2);
  if (!boat || !sheet || !avatar) throw new Error('Provide boat PNG, clean Skiff sheet PNG and avatar PNG');
  const metadata = await sharp(sheet).metadata();
  if (Math.abs(metadata.width / metadata.height - 2) > .01 || !metadata.hasAlpha) throw new Error('Skiff source must be a transparent 4×2 square-cell atlas');
  await fs.mkdir(path.join(output, 'sprites'), { recursive: true });
  await sharp(boat).webp({ quality: 88, effort: 6 }).toFile(path.join(output, 'river-boat.webp'));
  const atlas = await sharp(sheet).resize(1024, 512, { kernel: sharp.kernel.lanczos3 }).png({ compressionLevel: 9 }).toBuffer();
  const { data, info } = await sharp(atlas).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const frames = [];
  for (let row = 0; row < 2; row++) for (let col = 0; col < 4; col++) {
    let left = 256, top = 256, right = -1, bottom = -1;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      if (data[((row * 256 + y) * info.width + col * 256 + x) * 4 + 3] < 32) continue;
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
    if (right < left || bottom < top) throw new Error(`Empty Skiff frame ${frames.length}`);
    frames.push({ x: col * 256, y: row * 256, w: 256, h: 256, bounds: [left, top, right + 1, bottom + 1] });
  }
  await fs.writeFile(path.join(output, 'sprites/skiff.png'), atlas);
  await fs.writeFile(path.join(output, 'sprites/skiff-frames.json'), `${JSON.stringify(frames)}\n`);
  await sharp(avatar).resize(512, 512, { kernel: sharp.kernel.lanczos3 }).png({ compressionLevel: 9 }).toFile(path.join(output, 'sprites/skiff-avatar.png'));
  console.log('Prepared river-boat.webp, Skiff 8-frame atlas, frame bounds and portrait.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
