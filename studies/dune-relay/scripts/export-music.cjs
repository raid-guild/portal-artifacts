#!/usr/bin/env node
// Render exactly the Web Audio score used in-game, then package listening copies.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');
const { chromium } = require('playwright');

const defaultOut = path.resolve(__dirname, '../../../../../exports/dune-relay-music-faster-2026-11-22');
const outArg = process.argv.indexOf('--out');
if (outArg >= 0 && !process.argv[outArg + 1]) throw new Error('--out requires a directory');
const out = path.resolve(outArg >= 0 ? process.argv[outArg + 1] || '' : defaultOut);
if (!out || out === path.parse(out).root) throw new Error('Specify an export directory with --out');
const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/game/music.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const tracks = [
  { id: 'oasis', chapter: 1, title: 'Water Finds a Way' },
  { id: 'caravan', chapter: 2, title: "The Walker's Road" },
  { id: 'gatehouse', chapter: 3, title: 'River and Counterweight' },
  { id: 'farmland', chapter: 4, title: 'Seeds After Rain' },
  { id: 'town', chapter: 5, title: 'Lanterns at the Market' },
  { id: 'castle', chapter: 6, title: 'The Ledger at Dusk' },
];
function command(name, args, cwd) {
  const result = spawnSync(name, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) throw new Error(`${name} failed: ${result.stderr || result.stdout}`);
}

async function render(page, id) {
  return page.evaluate(async ({ compiled, id }) => {
    const exports = {};
    new Function('exports', compiled)(exports);
    const { arrangements, MUSIC_STEPS_PER_CYCLE, notesForMusicStep, scheduleMusicVoice } = exports;
    const sampleRate = 44100;
    const eighth = 30 / arrangements[id].bpm;
    const cycleSeconds = MUSIC_STEPS_PER_CYCLE * eighth;
    let lastVoiceEnd = 0;
    const events = [];
    for (let step = 0; step < MUSIC_STEPS_PER_CYCLE; step++) {
      const at = step * eighth;
      for (const note of notesForMusicStep(id, step)) {
        events.push({ at, note });
        lastVoiceEnd = Math.max(lastVoiceEnd, at + note.duration + 0.02);
      }
    }
    const duration = Math.max(cycleSeconds, lastVoiceEnd) + 0.25;
    const context = new OfflineAudioContext(2, Math.ceil(duration * sampleRate), sampleRate);
    const master = context.createGain();
    master.gain.setValueAtTime(0, 0);
    master.gain.linearRampToValueAtTime(1, 0.35);
    master.connect(context.destination);
    for (const event of events) scheduleMusicVoice(context, master, event.note, event.at);
    const buffer = await context.startRendering();
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    let peak = 0;
    for (let i = 0; i < left.length; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
    // -2.5 dBFS PCM peak leaves margin for MP3 codec overshoot. Export only.
    const targetPeak = Math.pow(10, -2.5 / 20);
    const scale = peak > 0 ? targetPeak / peak : 1;
    const bytes = new Uint8Array(44 + left.length * 4);
    const view = new DataView(bytes.buffer);
    function str(offset, value) { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); }
    str(0, 'RIFF'); view.setUint32(4, bytes.length - 8, true); str(8, 'WAVE'); str(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 2, true);
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, 4, true); view.setUint16(34, 16, true); str(36, 'data');
    view.setUint32(40, left.length * 4, true);
    for (let i = 0; i < left.length; i++) {
      view.setInt16(44 + i * 4, Math.max(-32768, Math.min(32767, Math.round(left[i] * scale * 32767))), true);
      view.setInt16(46 + i * 4, Math.max(-32768, Math.min(32767, Math.round(right[i] * scale * 32767))), true);
    }
    const chunks = [];
    for (let i = 0; i < bytes.length; i += 32768) chunks.push(String.fromCharCode(...bytes.subarray(i, i + 32768)));
    return { wav: btoa(chunks.join('')), bpm: arrangements[id].bpm, duration, cycleSeconds, sourcePeak: peak, exportGain: scale, noteCount: events.length };
  }, { compiled: source, id });
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const manifest = { format: 'Dune Relay chapter music listening exports', sampleRate: 44100, channels: 2,
    note: 'One full 16-bar score cycle per chapter. Export-only normalization to -2.5 dBFS PCM peak; game playback levels are unchanged. Music only, no effects or ambience.', tracks: [] };
  try {
    for (const track of tracks) {
      console.log(`Rendering chapter ${track.chapter}: ${track.title}`);
      const result = await render(page, track.id);
      const stem = `${track.chapter}-${track.id}`;
      const wav = path.join(out, `${stem}.wav`);
      const mp3 = path.join(out, `${stem}.mp3`);
      fs.writeFileSync(wav, Buffer.from(result.wav, 'base64'));
      command('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3]);
      fs.unlinkSync(wav);
      manifest.tracks.push({ chapter: track.chapter, levels: `${track.chapter}.1–${track.chapter}.10`, title: track.title, id: track.id, bpm: result.bpm,
        file: path.basename(mp3), durationSeconds: Math.round(result.duration * 1000) / 1000,
        cycleSeconds: Math.round(result.cycleSeconds * 1000) / 1000, notes: result.noteCount,
        exportGain: Math.round(result.exportGain * 1000) / 1000 });
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  command('python3', ['-m', 'zipfile', '-c', 'dune-relay-chapter-music.zip', ...manifest.tracks.map(track => track.file), 'manifest.json'], out);
  console.log(`Wrote six MP3s, manifest, and ZIP to ${out}`);
})().catch(error => { console.error(error); process.exitCode = 1; });
