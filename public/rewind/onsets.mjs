// A lightweight attack estimate in the upper mids. It responds to pluck-like
// transients in the mix; it does not isolate or identify an instrument.
export function detectOnsets(buffer) {
  const rate = buffer.sampleRate;
  const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) => buffer.getChannelData(i));
  const hop = Math.max(1, Math.round(rate * .01));
  const energy = new Float32Array(Math.ceil(buffer.length / hop));
  const hp = rate / (rate + 2 * Math.PI * 850);
  const lp = (2 * Math.PI * 4800) / (rate + 2 * Math.PI * 4800);
  let previousInput = 0, high = 0, band = 0, sum = 0, count = 0, index = 0;
  for (let i = 0; i < buffer.length; i++) {
    let sample = 0;
    for (const channel of channels) sample += channel[i];
    sample /= channels.length;
    high = hp * (high + sample - previousInput);
    previousInput = sample;
    band += lp * (high - band);
    sum += band * band;
    count++;
    if (count === hop || i === buffer.length - 1) {
      energy[index++] = Math.sqrt(sum / count);
      sum = 0; count = 0;
    }
  }

  const novelty = new Float32Array(energy.length);
  const thresholds = new Float32Array(energy.length);
  let trailing = 0;
  for (let i = 0; i < energy.length; i++) {
    if (i) trailing += energy[i - 1];
    if (i > 15) trailing -= energy[i - 16];
    const mean = trailing / Math.max(1, Math.min(i, 15));
    novelty[i] = Math.max(0, energy[i] - mean);
    thresholds[i] = Math.max(.0025, mean * .19);
  }

  const events = [];
  const minGap = Math.round(.13 * rate / hop);
  for (let i = 3; i < novelty.length - 3; i++) {
    const value = novelty[i];
    if (value <= thresholds[i] || value < novelty[i - 1] || value <= novelty[i + 1] ||
        value < novelty[i - 2] || value <= novelty[i + 2]) continue;
    const time = i * hop / rate;
    const strength = Math.min(1, value / Math.max(thresholds[i], .001) / 3);
    if (events.length && i - events.at(-1).frame < minGap) {
      if (value > events.at(-1).value) events[events.length - 1] = { frame: i, time, strength, value };
    } else events.push({ frame: i, time, strength, value });
  }
  return events.map(({ time, strength }) => ({ time, strength }));
}

export async function analyzeAudioBlob(blob) {
  const offline = new OfflineAudioContext(1, 1, 44100);
  const decoded = await offline.decodeAudioData(await blob.arrayBuffer());
  return { duration: decoded.duration, events: detectOnsets(decoded) };
}
