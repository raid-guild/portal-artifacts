import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../../public/raid-credits/", import.meta.url);
const textFiles = ["index.html", "styles.css", "app.js"];
const assetFiles = ["assets/raidguild.mp4", "assets/voyager.ogg", "assets/rainbow-warrior.png"];

const content = Object.fromEntries(
  await Promise.all(
    textFiles.map(async (file) => [file, await readFile(new URL(file, root), "utf8")]),
  ),
);

await Promise.all(assetFiles.map((file) => access(new URL(file, root))));

const failures = [];
const requiredHtml = [
  'href="styles.css"',
  'src="app.js"',
  'src="assets/raidguild.mp4"',
  'src="assets/voyager.ogg"',
  'src="assets/rainbow-warrior.png"',
  "data-playback-open",
  "data-playback-close",
  'role="dialog"',
  'aria-modal="true"',
  "Minting is no longer active.",
];

for (const token of requiredHtml) {
  if (!content["index.html"].includes(token)) failures.push(`index.html is missing ${token}`);
}

const requiredBehavior = [
  'event.key === "Escape"',
  'audio.pause()',
  'playbackVideo.pause()',
  'playbackTrigger?.focus()',
  'document.body.classList.add("playback-open")',
  'document.body.classList.remove("playback-open")',
];

for (const token of requiredBehavior) {
  if (!content["app.js"].includes(token)) failures.push(`app.js is missing ${token}`);
}

if (!content["styles.css"].includes("height: 100dvh")) {
  failures.push("styles.css is missing the dynamic full-viewport takeover height");
}

const forbidden = [
  /walletconnect/i,
  /web3(?:modal|\.js)?/i,
  /infura/i,
  /ethereum\.request/i,
  /eth_sendTransaction/i,
  /raidbot\/members/i,
  /document\.cookie/i,
];

for (const [file, source] of Object.entries(content)) {
  for (const pattern of forbidden) {
    if (pattern.test(source)) failures.push(`${file} contains forbidden browser code matching ${pattern}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Raid Credits static checks passed.");
