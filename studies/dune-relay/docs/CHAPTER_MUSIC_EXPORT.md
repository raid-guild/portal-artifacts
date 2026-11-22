# Chapter music exports

Each chapter uses one 16-bar Web Audio score throughout its ten levels. The shared note data and voice synthesis live in `src/game/music.ts`; `audio.ts` schedules those notes in game. The six chapter tempos are now approximately 15% faster: Oasis 83, Open Desert 97, Bridge Gatehouse 87, Farmland 92, Town on the Hill 90, and Castle Island 85 BPM. Pitches, instruments, effects, ambience, and game volume settings are unchanged.

To regenerate downloadable listening copies with Node, Chrome, Playwright, Python 3, and FFmpeg available:

```bash
npm run music:export -- --out /absolute/path/to/exports
```

The exporter renders one complete 128-step score cycle per chapter through `OfflineAudioContext`, then writes six stereo MP3s, a ZIP, and a manifest with chapter, level range, BPM, and duration. These are music-only files: no sound effects or ambience. A short entrance fade and a release tail make standalone playback smooth. Only the downloadable copies receive fixed peak normalization (to -2.5 dBFS before MP3 encoding); this does not affect game playback. Exports belong outside the served game assets and are not bundled into the app.
