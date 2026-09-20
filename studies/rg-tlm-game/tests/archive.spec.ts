import { test, expect, type Page } from '@playwright/test';

const archiveSave = {
  version: 4,
  room: 'archive',
  transit: { destination: 1, beacon: 2, notebookRead: true, active: true, completed: true },
  workshop: { metOrin: true, metMica: true, metSable: true, brief: 'placed', key: 'placed', thread: 'placed', assembled: true, joined: true },
  archive: { shift: 0, attempts: 0, solved: false },
  started: true,
  metRook: true,
  plate: 'packed',
  jack: 'packed',
  repaired: true,
  departed: true,
  position: { x: 14, y: 91 },
};

async function startArchive(page: Page, viewport = { width: 1440, height: 960 }) {
  await page.setViewportSize(viewport);
  await page.goto('/');
  await page.evaluate(save => localStorage.setItem('raidguild:last-mile:room-one', JSON.stringify(save)), archiveSave);
  await page.reload();
  await page.getByRole('button', { name: /Continue the journey/ }).click();
  await expect(page.locator('#scene')).toHaveAttribute('data-room', 'archive');
}

test('desktop Archive decodes the lantern signal, gives progressive help, and saves completion', async ({ page }) => {
  const errors: string[] = [];
  const failed: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  await startArchive(page);
  await expect(page.locator('.archive-art')).toBeVisible();
  await expect(page.locator('.archive-prop')).toHaveCount(3);
  expect(await page.locator('.archive-prop').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await expect(page.getByRole('button', { name: 'History shelves', exact: true })).toBeVisible();
  await page.screenshot({ path: 'art/qa/archive-desktop-arrival.png', fullPage: true });

  await page.getByRole('button', { name: 'History shelves', exact: true }).click();
  await page.getByRole('button', { name: 'Examine', exact: true }).click();
  await expect(page.locator('#dialogue-text')).toContainText(/cypherpunks write code/i);
  await page.getByRole('button', { name: 'ROT decoder desk', exact: true }).click();
  await page.getByRole('button', { name: 'Use the decoder ring', exact: true }).click();
  await expect(page.locator('#archive-dialog')).toContainText('Cypherpunks write code');
  await page.getByRole('button', { name: 'Check the signal', exact: true }).click();
  await expect(page.locator('#archive-feedback')).toContainText('do not form a clear instruction');
  await page.getByRole('button', { name: 'Close decoder', exact: true }).click();
  await page.getByRole('button', { name: 'A little hint', exact: true }).click();
  await expect(page.locator('#dialogue-text')).toContainText('four letters');

  await page.getByRole('button', { name: 'ROT decoder desk', exact: true }).click();
  await page.getByRole('button', { name: 'Use the decoder ring', exact: true }).click();
  const ring = page.locator('#archive-ring');
  await ring.focus();
  for (let index = 0; index < 7; index += 1) await page.keyboard.press('ArrowRight');
  await expect(page.locator('#archive-preview')).toHaveText('SEND THE LANTERN');
  await page.getByRole('button', { name: 'Check the signal', exact: true }).click();
  await expect(page.locator('#archive-ending-dialog')).toContainText('SEND THE LANTERN');
  await page.getByRole('button', { name: /Return to the Archive/ }).click();
  await expect(page.locator('#objective')).toHaveText('The First Raid awaits');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('raidguild:last-mile:room-one')!).archive.solved)).toBe(true);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test('mobile reduced-motion Archive supports touch-sized controls without overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startArchive(page, { width: 390, height: 844 });
  await expect(page.locator('.archive-prop')).toHaveCount(3);
  await page.screenshot({ path: 'art/qa/archive-mobile-arrival.png', fullPage: true });
  await page.getByRole('button', { name: 'ROT decoder desk', exact: true }).click();
  await page.getByRole('button', { name: 'Use the decoder ring', exact: true }).click();
  await page.getByRole('button', { name: 'Turn decoder ring forward', exact: true }).click();
  await expect(page.locator('#archive-shift')).toHaveText('ROT 01');
  const box = await page.getByRole('button', { name: 'Turn decoder ring backward', exact: true }).boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'art/qa/archive-mobile.png', fullPage: true });
});

test('Archive works inside a Portal-style sandboxed iframe', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/');
  await page.evaluate(save => localStorage.setItem('raidguild:last-mile:room-one', JSON.stringify(save)), archiveSave);
  await page.setContent('<iframe title="The Last Mile" sandbox="allow-scripts allow-same-origin" src="http://127.0.0.1:4173/" style="width:100%;height:840px;border:0"></iframe>');
  const frame = page.frameLocator('iframe[title="The Last Mile"]');
  await frame.getByRole('button', { name: /Continue the journey/ }).click();
  await expect(frame.locator('#scene')).toHaveAttribute('data-room', 'archive');
  await frame.getByRole('button', { name: 'ROT decoder desk', exact: true }).click();
  await frame.getByRole('button', { name: 'Use the decoder ring', exact: true }).click();
  await expect(frame.locator('#archive-dialog')).toBeVisible();
});
