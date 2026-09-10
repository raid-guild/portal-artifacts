const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const origin = "http://127.0.0.1:4173";
const url = `${origin}/motion-lab-v1/`;
const evidenceDirectory = "/tmp/verification-2325";

function attachAudit(page, label) {
  const failures = [];
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => {
    failures.push(`requestfailed: ${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(`http ${response.status()}: ${response.url()}`);
  });
  page.on("request", (request) => {
    const requestUrl = request.url();
    if (!requestUrl.startsWith(origin) && !requestUrl.startsWith("data:") && !requestUrl.startsWith("blob:")) {
      failures.push(`external request: ${requestUrl}`);
    }
  });
  return () => assert.deepEqual(failures, [], `${label} browser audit failed:\n${failures.join("\n")}`);
}

async function waitForTransition(pageOrFrame) {
  await pageOrFrame.locator("body").waitFor({ state: "visible" });
  await pageOrFrame.waitForFunction(() => !document.body.classList.contains("is-transitioning"), null, {
    timeout: 3000,
  });
}

async function setDuration(pageOrFrame, value) {
  await pageOrFrame.locator("#duration").evaluate((input, nextValue) => {
    input.value = nextValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, String(value));
}

async function chooseRecipe(pageOrFrame, value) {
  await pageOrFrame.locator(`input[name="recipe"][value="${value}"]`).check();
  await pageOrFrame.waitForFunction((recipe) => {
    const input = document.querySelector(`input[name="recipe"][value="${recipe}"]`);
    return input?.checked && input.closest(".recipe-card")?.classList.contains("is-selected");
  }, value);
}

async function clickDestination(pageOrFrame, value) {
  await pageOrFrame.locator(`[data-destination="${value}"]`).click();
  await pageOrFrame.waitForFunction((destination) => {
    const layer = document.querySelector("[data-transition-layer]");
    return document.body.classList.contains("is-transitioning") && layer?.classList.contains("is-running") &&
      layer.dataset.recipe === document.querySelector('input[name="recipe"]:checked')?.value;
  }, value);
}

async function assertScene(pageOrFrame, value) {
  assert.equal(await pageOrFrame.locator(`[data-scene="${value}"]`).getAttribute("aria-hidden"), "false");
  assert.equal(await pageOrFrame.locator(`[data-destination="${value}"]`).getAttribute("aria-current"), "page");
}

async function desktopJourney(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const assertAudit = attachAudit(page, "desktop");
  const response = await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(await page.title(), "Motion Lab v1 · RaidGuild");
  assert.equal(await page.locator('.brand-mark img').getAttribute("src"), "raidguild-stamp.svg");
  assert.equal(await page.locator('.stamp-mask-image').getAttribute("href"), "raidguild-stamp.svg");

  const assetResponse = await page.request.get(`${origin}/motion-lab-v1/raidguild-stamp.svg`);
  assert.equal(assetResponse.status(), 200);

  await clickDestination(page, "arsenal");
  await page.waitForTimeout(560);
  const firstScale = await page.locator(".stamp-mask-image").evaluate((image) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(image).transform);
    return Math.hypot(matrix.a, matrix.b);
  });
  const surfaceOpacity = Number(await page.locator(".stamp-mask-surface").evaluate((surface) => getComputedStyle(surface).opacity));
  assert.ok(surfaceOpacity > 0.5, `mask surface was not visibly opaque: ${surfaceOpacity}`);
  await page.screenshot({ path: path.join(evidenceDirectory, "desktop-stamp-reveal.png"), fullPage: false });
  await page.waitForTimeout(250);
  const secondScale = await page.locator(".stamp-mask-image").evaluate((image) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(image).transform);
    return Math.hypot(matrix.a, matrix.b);
  });
  assert.ok(firstScale > 0.08, `stamp mask did not begin scaling: ${firstScale}`);
  assert.ok(secondScale > firstScale * 2, `stamp mask did not expand materially: ${firstScale} -> ${secondScale}`);
  await waitForTransition(page);
  await assertScene(page, "arsenal");

  await setDuration(page, 500);
  for (const [recipe, destination] of [["ink", "field-notes"], ["split", "tavern"], ["fade", "threshold"]]) {
    await chooseRecipe(page, recipe);
    await clickDestination(page, destination);
    assert.equal(await page.locator("[data-transition-layer]").getAttribute("data-recipe"), recipe);
    await waitForTransition(page);
    await assertScene(page, destination);
  }

  await page.locator("[data-replay]").click();
  await waitForTransition(page);
  await assertScene(page, "threshold");

  const opener = page.locator('[data-scene="threshold"] [data-open-modal]');
  await opener.click();
  await page.waitForTimeout(280);
  assert.equal(await page.locator("dialog").getAttribute("open"), "");
  assert.equal(await page.evaluate(() => document.activeElement?.matches("[data-close-modal]")), true);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog").open && !document.body.classList.contains("is-transitioning"), null, {
    timeout: 2500,
  });
  assert.equal(await opener.evaluate((button) => document.activeElement === button), true);

  assertAudit();
  await context.close();
  return { firstScale, secondScale, surfaceOpacity };
}

async function mobileJourney(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();
  const assertAudit = attachAudit(page, "mobile");
  await page.goto(url, { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert.ok(dimensions.scrollWidth <= dimensions.viewport, `horizontal overflow: ${JSON.stringify(dimensions)}`);
  await setDuration(page, 500);
  await clickDestination(page, "arsenal");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(evidenceDirectory, "mobile-stamp-reveal.png"), fullPage: false });
  await waitForTransition(page);
  await assertScene(page, "arsenal");
  assertAudit();
  await context.close();
  return dimensions;
}

async function sandboxJourney(browser) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 900 } });
  const page = await context.newPage();
  const assertAudit = attachAudit(page, "sandbox");
  await page.setContent(`<iframe title="Motion Lab sandbox" sandbox="allow-scripts allow-modals" src="${url}" style="width:100%;height:880px;border:0"></iframe>`);
  const frame = page.frames().find((candidate) => candidate.url() === url);
  assert.ok(frame, "sandboxed Motion Lab frame did not load");
  await frame.waitForLoadState("networkidle");
  await setDuration(frame, 500);
  await clickDestination(frame, "tavern");
  await waitForTransition(frame);
  await assertScene(frame, "tavern");
  assertAudit();
  await context.close();
}

async function reducedMotionJourney(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  const assertAudit = attachAudit(page, "reduced-motion");
  await page.goto(url, { waitUntil: "networkidle" });
  assert.match(await page.locator("#motion-status").textContent(), /reduced motion/);
  const start = Date.now();
  await clickDestination(page, "arsenal");
  const reducedStyles = await page.locator("[data-transition-layer]").evaluate((layer) => ({
    animationName: getComputedStyle(layer).animationName,
    stampDisplay: getComputedStyle(layer.querySelector(".transition-stamp")).display,
    maskDisplay: getComputedStyle(layer.querySelector(".stamp-mask")).display,
  }));
  assert.equal(reducedStyles.animationName, "reduced-fade");
  assert.equal(reducedStyles.stampDisplay, "none");
  assert.equal(reducedStyles.maskDisplay, "none");
  await waitForTransition(page);
  const elapsedMs = Date.now() - start;
  assert.ok(elapsedMs < 500, `reduced transition took ${elapsedMs}ms`);
  await assertScene(page, "arsenal");

  const opener = page.locator('[data-scene="arsenal"] [data-open-modal]');
  await opener.click();
  await page.waitForFunction(() => document.querySelector("dialog").open);
  await waitForTransition(page);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog").open && !document.body.classList.contains("is-transitioning"), null, {
    timeout: 1000,
  });
  assert.equal(await opener.evaluate((button) => document.activeElement === button), true);
  await page.screenshot({ path: path.join(evidenceDirectory, "reduced-motion-final.png"), fullPage: false });
  assertAudit();
  await context.close();
  return { elapsedMs, reducedStyles };
}

(async () => {
  await fs.mkdir(evidenceDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await desktopJourney(browser);
    const mobile = await mobileJourney(browser);
    await sandboxJourney(browser);
    const reducedMotion = await reducedMotionJourney(browser);
    console.log(JSON.stringify({
      status: "passed",
      url,
      desktop,
      mobile,
      sandbox: "passed",
      reducedMotion,
      screenshots: [
        path.join(evidenceDirectory, "desktop-stamp-reveal.png"),
        path.join(evidenceDirectory, "mobile-stamp-reveal.png"),
        path.join(evidenceDirectory, "reduced-motion-final.png"),
      ],
    }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
