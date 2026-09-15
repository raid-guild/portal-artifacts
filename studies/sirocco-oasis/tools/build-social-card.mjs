// Capture the real scene with a quiet title treatment. Start the local Vite server first.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const browser = await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--use-angle=swiftshader']});
try {
 const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1,reducedMotion:'reduce'});
 await page.goto(process.env.OASIS_TEST_URL || 'http://localhost:5174/sirocco-oasis/');
 await page.waitForFunction(()=>window.__oasis?.getStats().ready);
 await page.addStyleTag({content:`body> :not(#scene):not(#social-card){display:none!important}#social-card{position:fixed;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(28,44,64,.35),transparent 45%,rgba(28,44,64,.3));color:#fff1dc;padding:38px 44px}#social-card h1{font:52px Georgia,serif;letter-spacing:9px;margin:0 0 9px}#social-card p{font:10px sans-serif;letter-spacing:4px;margin:0}#social-card .credit{position:absolute;bottom:30px;right:38px;display:flex;align-items:center;gap:10px;font:11px sans-serif;letter-spacing:1px}#social-card img{width:30px;height:28px}`});
 await page.evaluate(()=>{const card=document.createElement('div');card.id='social-card';card.innerHTML='<h1>SIROCCO</h1><p>A DESERT REVERIE</p><div class="credit">Built by <img src="raidguild-stamp.svg" alt="RaidGuild"></div>';document.body.append(card);});
 await page.locator('#social-card img').evaluate(img=>img.decode());
 await page.screenshot({path:fileURLToPath(new URL('../public/sirocco-social.png',import.meta.url))});
 console.log('Saved 1200 × 630 Sirocco social card.');
} finally { await browser.close(); }
