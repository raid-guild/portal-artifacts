const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const url = process.env.DUNE_TEST_URL || 'http://127.0.0.1:3101/dune-relay/';
const chrome = process.env.CHROMIUM_EXECUTABLE || '/usr/bin/google-chrome';

async function main() {
  const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const desktop = await browser.newContext({ viewport: { width: 1100, height: 650 }, reducedMotion: 'reduce' });
    const page = await desktop.newPage();
    await page.goto(url);
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    assert(manifestHref?.endsWith('/manifest.webmanifest'));
    const manifestResponse = await page.request.get(new URL(manifestHref, url).href);
    assert.equal(manifestResponse.ok(), true);
    assert.match(manifestResponse.headers()['content-type'], /manifest\+json|application\/json/);
    const manifest = await manifestResponse.json();
    const scope = new URL('.', url).pathname;
    assert.deepEqual([manifest.id, manifest.start_url, manifest.scope], [scope, scope, scope]);
    assert.equal(manifest.display, 'standalone');
    assert.equal(manifest.orientation, 'landscape');
    assert(!JSON.stringify(manifest).includes('playtest='));
    for (const entry of manifest.icons) {
      const response = await page.request.get(new URL(entry.src, url).href);
      assert.equal(response.ok(), true, `icon ${entry.src}`);
      assert.match(response.headers()['content-type'], /image\/png/);
      const png = await response.body();
      assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `PNG signature ${entry.src}`);
      const size = Number(entry.sizes.split('x')[0]);
      assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [size, size], `PNG dimensions ${entry.src}`);
    }
    const appleHref = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
    const applePng = await (await page.request.get(new URL(appleHref, url).href)).body();
    assert.deepEqual([applePng.readUInt32BE(16), applePng.readUInt32BE(20)], [180, 180]);
    assert(await page.getByRole('button', { name: /Install Dune Relay/ }).isVisible());
    await page.getByRole('button', { name: /Install Dune Relay/ }).click();
    assert(await page.getByRole('dialog', { name: 'Install Dune Relay' }).isVisible());
    assert.match(await page.getByRole('dialog', { name: 'Install Dune Relay' }).innerText(), /internet connection is currently required/i);
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Close', 'dialog receives focus');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Close', 'focus stays inside dialog');
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog', { name: 'Install Dune Relay' }).count(), 0, 'Escape closes install help');
    assert.match(await page.evaluate(() => document.activeElement?.textContent?.trim()), /Install Dune Relay/, 'focus returns to opener');
    await page.evaluate(() => {
      window.__installPromptCalls = 0;
      const event = new Event('beforeinstallprompt', { cancelable: true });
      event.prompt = () => { window.__installPromptCalls++; return new Promise(resolve => { window.__resolvePrompt = resolve; }); };
      event.userChoice = Promise.resolve({ outcome: 'dismissed' });
      window.dispatchEvent(event);
    });
    await page.getByRole('button', { name: /Install Dune Relay/ }).click();
    assert.equal(await page.getByRole('button', { name: /Install Dune Relay/ }).isDisabled(), true, 'pending native prompt disables repeat clicks');
    assert.equal(await page.evaluate(() => window.__installPromptCalls), 1);
    await page.evaluate(() => window.__resolvePrompt());
    await page.getByRole('dialog', { name: 'Install Dune Relay' }).waitFor();
    await page.getByRole('dialog', { name: 'Install Dune Relay' }).getByRole('button', { name: 'Close' }).click();
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt', { cancelable: true });
      event.prompt = () => { throw new Error('not allowed'); };
      event.userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
    });
    await page.getByRole('button', { name: /Install Dune Relay/ }).click();
    assert(await page.getByRole('dialog', { name: 'Install Dune Relay' }).isVisible(), 'prompt error falls back to help');
    await page.getByRole('dialog', { name: 'Install Dune Relay' }).getByRole('button', { name: 'Close' }).click();
    assert.equal(await page.getByRole('dialog', { name: 'Install Dune Relay' }).count(), 0);
    await page.evaluate(() => {
      window.__installPromptCalls = 0;
      const event = new Event('beforeinstallprompt', { cancelable: true });
      event.prompt = () => { window.__installPromptCalls++; return Promise.resolve(); };
      event.userChoice = Promise.resolve({ outcome: 'dismissed' });
      window.dispatchEvent(event);
    });
    await page.getByRole('button', { name: /Install Dune Relay/ }).click();
    await page.getByRole('dialog', { name: 'Install Dune Relay' }).waitFor();
    assert.equal(await page.evaluate(() => window.__installPromptCalls), 1);
    await page.getByRole('dialog', { name: 'Install Dune Relay' }).getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: /Install Dune Relay/ }).click();
    assert.equal(await page.evaluate(() => window.__installPromptCalls), 1, 'native prompt consumed once');
    await page.getByRole('dialog', { name: 'Install Dune Relay' }).getByRole('button', { name: 'Close' }).click();
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt', { cancelable: true });
      event.prompt = () => Promise.resolve();
      event.userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
    });
    await page.getByRole('button', { name: /Install Dune Relay/ }).click();
    await page.getByRole('button', { name: /Install Dune Relay/ }).waitFor({ state: 'detached' });
    await page.getByRole('button', { name: /Enter the oasis/ }).click();
    assert.equal(await page.evaluate(() => Boolean(document.fullscreenElement)), false, 'desktop remains windowed');
    await desktop.close();

    const installed = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await installed.addInitScript(() => {
      const original = window.matchMedia.bind(window);
      window.matchMedia = query => query === '(display-mode: standalone)'
        ? { matches: true, media: query, addEventListener() {}, removeEventListener() {} }
        : original(query);
      window.__fullscreenCalls = 0;
      Element.prototype.requestFullscreen = () => { window.__fullscreenCalls++; return Promise.resolve(); };
    });
    const app = await installed.newPage();
    await app.goto(url);
    await app.getByRole('button', { name: /Enter the oasis/ }).waitFor();
    assert.equal(await app.getByRole('button', { name: /Install Dune Relay/ }).count(), 0, 'installed app hides install');
    await app.getByRole('button', { name: /Enter the oasis/ }).click();
    assert.equal(await app.evaluate(() => window.__fullscreenCalls), 0, 'standalone launch skips Fullscreen API');
    assert.equal(await app.getByRole('button', { name: /Full screen/ }).count(), 0, 'standalone app needs no recovery button');
    await installed.close();

    const apiFullscreen = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
    await apiFullscreen.addInitScript(() => {
      const original = window.matchMedia.bind(window);
      window.matchMedia = query => query === '(display-mode: fullscreen)'
        ? { matches: true, media: query, addEventListener() {}, removeEventListener() {} }
        : original(query);
      Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => document.documentElement });
    });
    const browserFullscreen = await apiFullscreen.newPage();
    await browserFullscreen.goto(url);
    await browserFullscreen.getByRole('button', { name: /Install Dune Relay/ }).waitFor();
    assert(await browserFullscreen.getByRole('button', { name: /Install Dune Relay/ }).isVisible(), 'ordinary API fullscreen is not an installed app');
    await browserFullscreen.evaluate(() => Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => null }));
    assert(await browserFullscreen.getByRole('button', { name: /Install Dune Relay/ }).isVisible(), 'fullscreen media alone does not hide install');
    await apiFullscreen.close();

    const ios = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1' });
    const safari = await ios.newPage();
    await safari.goto(url);
    await safari.getByRole('button', { name: /Install Dune Relay/ }).click();
    assert.match(await safari.getByRole('dialog', { name: 'Install Dune Relay' }).innerText(), /Share.*Add to Home Screen/s);
    await ios.close();

    const embedded = await browser.newContext({ viewport: { width: 844, height: 390 } });
    const wrapper = await embedded.newPage();
    await wrapper.goto(url);
    await wrapper.evaluate(href => {
      const iframe = document.createElement('iframe');
      iframe.src = `${href}?test_token=secret`;
      iframe.style.width = '844px'; iframe.style.height = '390px';
      document.body.append(iframe);
    }, url);
    const iframe = wrapper.frameLocator('iframe');
    await iframe.getByRole('button', { name: /Install Dune Relay/ }).click();
    const directLink = iframe.getByRole('dialog', { name: 'Install Dune Relay' }).getByRole('link', { name: /Open game/ });
    assert.equal(new URL(await directLink.getAttribute('href')).search, '', 'embedded install link strips query data');
    await embedded.close();

    const portrait = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await portrait.addInitScript(() => {
      window.__fullscreenAttempts = [];
      Element.prototype.requestFullscreen = () => {
        window.__fullscreenAttempts.push(Boolean(navigator.userActivation?.isActive));
        return Promise.reject(new DOMException('blocked', 'NotAllowedError'));
      };
    });
    const phone = await portrait.newPage();
    await phone.goto(url);
    assert.equal(await phone.locator('.rotate').count(), 0, 'portrait is not blocked');
    const frame = await phone.locator('.frame').boundingBox();
    assert(frame?.height > 600, 'portrait welcome uses available height');
    assert(await phone.getByRole('button', { name: /Enter the oasis/ }).isVisible());
    await phone.getByRole('button', { name: /Install Dune Relay/ }).click();
    const dialog = await phone.getByRole('dialog', { name: 'Install Dune Relay' }).boundingBox();
    assert(dialog && dialog.y >= 0 && dialog.y + dialog.height <= 844, 'install guidance fits portrait');
    await phone.getByRole('dialog', { name: 'Install Dune Relay' }).getByRole('button', { name: 'Close' }).click();
    await phone.getByRole('button', { name: /Enter the oasis/ }).click();
    await phone.locator('.awning-wipe').waitFor({ state: 'detached' });
    assert.deepEqual(await phone.evaluate(() => window.__fullscreenAttempts), [true], 'fullscreen requested within Play gesture');
    assert(await phone.locator('.portrait-hint').isVisible());
    assert(await phone.getByRole('button', { name: 'Settings' }).isVisible());
    assert.equal(await phone.locator('.fullscreen-issue').count(), 0, 'automatic fullscreen failure does not nag');
    assert.equal(await phone.evaluate(async () => (await navigator.serviceWorker?.getRegistrations() || []).length), 0);
    await portrait.close();
    console.log('PWA browser checks passed: manifest, icons, install prompts, desktop and portrait play.');
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
