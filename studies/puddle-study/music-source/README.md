# Soft Signal source

Original Web Audio composition and listening/export app for the puddle demo's background music. Serve this folder with a static HTTP server to adjust the eight-layer mix, audition moods and passages, and export the full loop as WAV. The signature is D–A–B♭–E–D; the 32-bar composition lasts about 87 seconds at 88 BPM and includes a wordless bridge and synthesized guitar solo.

The published game uses the approved Exploring mix in `../public/audio/soft-signal.mp3`. Re-encode a newly exported WAV with:

```sh
ffmpeg -i soft-signal-surreal-explore-88bpm.wav -codec:a libmp3lame -b:a 192k -metadata title='Soft Signal' ../public/audio/soft-signal.mp3
```

These are synthesized instruments, not sampled recordings. The authoring app has an optional Google Fonts stylesheet; the published game bundles its fonts locally.
