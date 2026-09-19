import { test, expect, type Page } from '@playwright/test';

async function start(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Begin the journey/ }).click();
}
async function take(page: Page, label: string) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('button', { name: `Take ${label.toLowerCase()}`, exact: true }).click();
}
async function use(page: Page, label: string, target: string, feedback: RegExp) {
  await page.getByRole('button', { name: `Select ${label}`, exact: true }).click();
  await page.getByRole('button', { name: target, exact: true }).click();
  await expect(page.locator('#dialogue-text')).toHaveText(feedback);
}

test('full repair, save/continue, ending, and restart', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 960 });
  await start(page);
  await page.getByRole('button', { name: 'Rook', exact: true }).click();
  await page.getByRole('button', { name: 'Talk to Rook', exact: true }).click();
  await expect(page.locator('#dialogue-text')).toContainText('another pair of hands');
  await take(page, 'Screw jack');
  await use(page, 'Screw jack', 'Repair point', /starts to sink/);
  await expect(page.getByRole('button', { name: 'Select Screw jack' })).toBeVisible();
  await take(page, 'Cargo plate');
  await use(page, 'Cargo plate', 'Repair point', /slide the plate/);
  await page.reload();
  await page.getByRole('button', { name: /Continue the journey/ }).click();
  await expect(page.locator('#ground-plate')).toHaveClass(/placed/);
  await expect(page.getByRole('button', { name: 'Cargo plate', exact: true })).toBeHidden();
  await use(page, 'Screw jack', 'Repair point', /sits firmly/);
  await page.getByRole('button', { name: 'Turn the crank', exact: true }).click();
  await expect(page.locator('#repaired-art')).toHaveClass(/visible/);
  await expect(page.locator('#inventory button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Rook', exact: true }).click();
  await page.getByRole('button', { name: 'Accept the ride', exact: true }).click();
  await expect(page.locator('#scene')).toHaveAttribute('data-room', 'crossing');
  await expect(page.getByRole('button', { name: 'Route pedestal', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await page.getByRole('button', { name: 'Start again', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cargo plate', exact: true })).toBeVisible();
  await expect(page.locator('#repaired-art')).not.toHaveClass(/visible/);
  await expect(page.locator('#inventory button')).toHaveCount(1);
  await expect(page.locator('#repaired-art')).toHaveCSS('opacity', '0');
  await page.screenshot({ path: 'art/qa/room-one-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('narrow screens and keyboard interaction', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  const oldPosition = await page.locator('#player').evaluate(el => (el as HTMLElement).style.left);
  await page.locator('#scene').focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.locator('#player').evaluate(el => (el as HTMLElement).style.left)).not.toBe(oldPosition);
  await page.getByRole('button', { name: 'Rook', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Talk to Rook', exact: true }).click();
  await page.getByRole('button', { name: 'Show targets', exact: true }).click();
  await expect(page.locator('#reveal')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Select Notebook', exact: true }).click();
  await expect(page.locator('#dialogue-text')).toContainText('walking lantern');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Select Notebook', exact: true })).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'art/qa/room-one-mobile.png', fullPage: true });
  await take(page, 'Cargo plate');
  await use(page, 'Cargo plate', 'Repair point', /slide the plate/);
  await take(page, 'Screw jack');
  await use(page, 'Screw jack', 'Repair point', /sits firmly/);
  await page.getByRole('button', { name: 'Turn the crank', exact: true }).click();
  await expect(page.locator('#repaired-art')).toHaveClass(/visible/);
});

test('keeps playing when browser storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); }; });
  await start(page);
  await expect(page.locator('#save-status')).toContainText('Saving unavailable');
  await page.getByRole('button', { name: 'Select Notebook', exact: true }).click();
  await expect(page.locator('#dialogue-text')).toContainText(/unfinished inventions/i);
});

test('recovers safely from an invalid save', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('raidguild:last-mile:room-one', '{broken'));
  await page.goto('/');
  await expect(page.locator('#loading-note')).toContainText('unreadable save');
  await page.getByRole('button', { name: /Begin the journey/ }).click();
  await expect(page.locator('#inventory button')).toHaveCount(1);
});
