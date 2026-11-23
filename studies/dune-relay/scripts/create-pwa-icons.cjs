const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'public/sprites/coin.png');
const output = path.join(root, 'public/icons');

async function create(name, size, coinSize) {
  const coin = await sharp(source).resize(coinSize, coinSize, { fit: 'contain', kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#0b2732' } })
    .composite([{ input: coin, left: Math.round((size - coinSize) / 2), top: Math.round((size - coinSize) / 2) }])
    .png().toFile(path.join(output, name));
}

async function main() {
  await fs.mkdir(output, { recursive: true });
  await create('dune-relay-192.png', 192, 150);
  await create('dune-relay-512.png', 512, 400);
  await create('dune-relay-maskable-512.png', 512, 304);
  await create('dune-relay-apple-180.png', 180, 140);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
