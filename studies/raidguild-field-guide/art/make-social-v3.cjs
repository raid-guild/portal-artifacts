// Rebuild a 1200 × 630 share card from the approved web hero art and local fonts.
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const root = __dirname;
const temp = path.join(root, '.social-v3-preview.html');
const output = path.join(root, 'field-guide-social-v3.png');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><style>
@font-face{font-family:LastDuel;src:url(../fonts/LastDuel-BoldEx2.woff2);font-weight:700}
@font-face{font-family:LastDuelRetalic;src:url(../fonts/LastDuel-BoldEx2Retalic.woff2);font-weight:700}
@font-face{font-family:Ubuntu;src:url(../fonts/Ubuntu-Variable.ttf)}
@font-face{font-family:Mono;src:url(../fonts/UbuntuMono-Regular.ttf)}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{position:relative;background:#191e4e;color:#fff8e7}
.art{position:absolute;inset:0 0 0 480px;background:url(field-guide-cover-moloch-v1.png) center 32%/cover no-repeat}
.veil{position:absolute;inset:0;background:linear-gradient(90deg,#191e4e 0%,#191e4e 29%,#191e4ef5 42%,#191e4eb3 55%,#191e4e0d 100%)}
.brand{position:absolute;left:60px;top:46px;display:flex;gap:17px;align-items:center;font:700 18px/1.1 Mono;letter-spacing:.08em}
.brand img{width:51px;height:48px;filter:brightness(0) saturate(100%) invert(87%) sepia(39%) saturate(953%) hue-rotate(6deg) brightness(100%) contrast(94%)}
.kicker{position:absolute;left:60px;top:176px;font:700 14px Mono;letter-spacing:.15em;color:#8fe3ef}
h1{position:absolute;left:60px;top:205px;width:1040px;margin:0;font:700 70px/1.02 LastDuel;letter-spacing:-.045em;text-transform:uppercase}
h1 em{font-family:LastDuelRetalic;font-style:normal;color:#d7e34d}
.footer{position:absolute;left:60px;bottom:51px;font:400 25px/1.25 Ubuntu;max-width:650px}
.rule{position:absolute;left:60px;right:60px;bottom:25px;height:2px;background:linear-gradient(90deg,#ee3c78 0%,#ee3c78 42%,transparent 75%)}
</style><div class="art"></div><div class="veil"></div><div class="brand"><img src="raidguild-crossed-swords.svg" alt=""><span>RAIDGUILD<br>FIELD GUIDE</span></div><div class="kicker">AN ILLUSTRATED GUIDE TO GUILD LIFE</div><h1>FIND YOUR PARTY.<br><em>BUILD WHAT<br>COMES NEXT.</em></h1><div class="footer">A world of builders, strange quests, shared tools, and work worth doing together.</div><div class="rule"></div></html>`;

(async () => {
  await fs.writeFile(temp, html);
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(temp).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: output });
  } finally {
    await browser.close();
    await fs.rm(temp, { force: true });
  }
  console.log(`Wrote ${output}`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
