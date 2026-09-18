import { access, readFile } from "node:fs/promises";
import vm from "node:vm";

const publicRoot = new URL("../../public/raid-credits/", import.meta.url);
const sourceRoot = new URL("./", import.meta.url);
const textFiles = ["index.html", "styles.css", "members.js", "app.js"];
const assetFiles = ["assets/raidguild.mp4", "assets/voyager.ogg", "assets/rainbow-warrior.png"];

const content = Object.fromEntries(
  await Promise.all(textFiles.map(async (file) => [file, await readFile(new URL(file, publicRoot), "utf8")])),
);

await Promise.all(assetFiles.map((file) => access(new URL(file, publicRoot))));

const failures = [];
const requiredHtml = [
  'href="styles.css"',
  'src="members.js"',
  'src="app.js"',
  'src="assets/raidguild.mp4"',
  'src="assets/voyager.ogg"',
  'src="assets/rainbow-warrior.png"',
  "data-member-grid",
  "data-member-search",
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
  "audio.pause()",
  "playbackVideo.pause()",
  "playbackTrigger?.focus()",
  'document.body.classList.add("playback-open")',
  'document.body.classList.remove("playback-open")',
  "members.forEach",
  "textContent = member.displayName",
];

for (const token of requiredBehavior) {
  if (!content["app.js"].includes(token)) failures.push(`app.js is missing ${token}`);
}

if (content["app.js"].includes('audio.addEventListener("ended", closePlayback)')) {
  failures.push("app.js closes playback before the full roster roll completes");
}

if (!content["styles.css"].includes("height: 100dvh")) {
  failures.push("styles.css is missing the dynamic full-viewport takeover height");
}

const sandbox = { window: {} };
vm.runInNewContext(content["members.js"], sandbox);
const snapshot = sandbox.window.RAID_CREDITS_SNAPSHOT;
if (snapshot?.collection !== "profiles") failures.push("member snapshot is not sourced from profiles");
if (snapshot?.members?.length !== snapshot?.total) failures.push("member snapshot total does not match roster");
if ((snapshot?.members?.length || 0) < 1) failures.push("member snapshot is empty");
if (new Set(snapshot?.members?.map(({ id }) => String(id))).size !== snapshot?.members?.length) {
  failures.push("member snapshot contains duplicate profile ids");
}
if (snapshot?.members?.some(({ id, displayName, handle, ...extra }) =>
  id == null || !displayName || !handle || Object.keys(extra).length,
)) {
  failures.push("member snapshot contains missing or non-minimal profile fields");
}

for (const file of textFiles) {
  const source = await readFile(new URL(file, sourceRoot), "utf8");
  if (source !== content[file]) failures.push(`${file} is out of sync between studies and public`);
}

const forbidden = [
  /walletconnect/i,
  /web3(?:modal|\.js)?/i,
  /infura/i,
  /ethereum\.request/i,
  /eth_sendTransaction/i,
  /raidbot\/members/i,
  /document\.cookie/i,
  /claimEmail/i,
  /walletAddress/i,
  /contact.*email/i,
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

console.log(`Raid Credits static checks passed for ${snapshot.members.length} Portal profiles.`);
