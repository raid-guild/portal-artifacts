import { test, expect, type Page } from '@playwright/test';

const workshopSave = {
  version: 3,
  room: 'workshop',
  transit: { destination: 1, beacon: 2, notebookRead: true, active: true, completed: true },
  workshop: { metOrin: false, metMica: false, metSable: false, brief: 'locked', key: 'locked', thread: 'locked', assembled: false, joined: false },
  started: true,
  metRook: true,
  plate: 'packed',
  jack: 'packed',
  repaired: true,
  departed: true,
  position: { x: 12, y: 91 },
};

async function startWorkshop(page: Page, viewport = { width: 1440, height: 960 }) {
  await page.setViewportSize(viewport);
  await page.goto('/');
  await page.evaluate(save => localStorage.setItem('raidguild:last-mile:room-one', JSON.stringify(save)), workshopSave);
  await page.reload();
  await page.getByRole('button', { name: /Continue the journey/ }).click();
  await expect(page.locator('#scene')).toHaveAttribute('data-room', 'workshop');
}
async function talk(page: Page, target: string, button: string) {
  await page.getByRole('button', { name: target, exact: true }).click();
  await page.getByRole('button', { name: button, exact: true }).click();
}
async function use(page: Page, item: string, target: string) {
  await page.getByRole('button', { name: `Select ${item}`, exact: true }).click();
  await page.getByRole('button', { name: target, exact: true }).click();
}

test('desktop Workshop assembles a collaborative raid, recovers mistakes, saves, and welcomes the player', async ({ page }) => {
  const errors: string[] = [];
  const failed: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  await startWorkshop(page);
  await expect(page.locator('.workshop-art')).toBeVisible();
  await expect(page.locator('#rook')).toBeHidden();
  await page.screenshot({ path: 'art/qa/workshop-desktop-arrival.png', fullPage: true });

  await talk(page, 'Keeper Orin', 'Talk to Keeper Orin');
  await expect(page.getByRole('button', { name: 'Select Raid brief' })).toBeVisible();
  await talk(page, 'Mica · Builder', 'Talk to Mica');
  await talk(page, 'Sable · Strategist', 'Talk to Sable');

  await use(page, 'Continuity key', 'Route board');
  await expect(page.locator('#dialogue-text')).toContainText('matches the signal frame');
  await expect(page.getByRole('button', { name: 'Select Continuity key' })).toBeVisible();

  await use(page, 'Route thread', 'Route board');
  await expect(page.locator('#hotspot-routeboard')).toHaveClass(/station-complete/);
  await use(page, 'Raid brief', 'Open ledger');
  await expect(page.locator('#hotspot-ledger')).toHaveClass(/station-complete/);
  await page.reload();
  await page.getByRole('button', { name: /Continue the journey/ }).click();
  await expect(page.locator('#hotspot-ledger')).toHaveClass(/station-complete/);
  await expect(page.locator('#hotspot-routeboard')).toHaveClass(/station-complete/);
  await use(page, 'Continuity key', 'Signal frame');
  await expect(page.locator('#scene')).toHaveClass(/workshop-assembled/);
  await expect(page.locator('#objective')).toHaveText('Take your place at the table');
  await page.screenshot({ path: 'art/qa/workshop-assembled.png', fullPage: true });

  await page.getByRole('button', { name: 'Shared raid table', exact: true }).click();
  await page.getByRole('button', { name: 'Take your place at the table', exact: true }).click();
  await expect(page.locator('#ending-dialog')).toContainText('CHAPTER THREE COMPLETE');
  await expect(page.locator('#ending-dialog')).toContainText('archive door');
  await page.getByRole('button', { name: /Enter the Archive/ }).click();
  await expect(page.locator('#scene')).toHaveAttribute('data-room', 'archive');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('raidguild:last-mile:room-one')!).workshop.joined)).toBe(true);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test('mobile reduced-motion Workshop remains keyboard reachable without horizontal overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startWorkshop(page, { width: 390, height: 844 });
  await page.locator('#scene').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#traveler')).toHaveAttribute('data-facing', 'right');
  await page.getByRole('button', { name: 'Keeper Orin', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Talk to Keeper Orin', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Select Raid brief' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'art/qa/workshop-mobile.png', fullPage: true });
});

test('Workshop runs inside a Portal-style sandboxed iframe', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/');
  await page.evaluate(save => localStorage.setItem('raidguild:last-mile:room-one', JSON.stringify(save)), workshopSave);
  await page.setContent('<iframe title="The Last Mile" sandbox="allow-scripts allow-same-origin" src="http://127.0.0.1:4173/" style="width:100%;height:840px;border:0"></iframe>');
  const frame = page.frameLocator('iframe[title="The Last Mile"]');
  await frame.getByRole('button', { name: /Continue the journey/ }).click();
  await expect(frame.locator('#scene')).toHaveAttribute('data-room', 'workshop');
  await frame.getByRole('button', { name: 'Keeper Orin', exact: true }).click();
  await frame.getByRole('button', { name: 'Talk to Keeper Orin', exact: true }).click();
  await expect(frame.getByRole('button', { name: 'Select Raid brief' })).toBeVisible();
});
