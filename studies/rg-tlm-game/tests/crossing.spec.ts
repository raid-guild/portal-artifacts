import { test, expect, type Page } from '@playwright/test';

const oldSave = { version: 1, started: true, metRook: true, plate: 'packed', jack: 'packed', repaired: true, departed: true, position: { x: 46, y: 88 } };
async function start(page: Page, viewport = { width: 1440, height: 960 }) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(save => localStorage.setItem('raidguild:last-mile:room-one', JSON.stringify(save)), oldSave);
  await page.reload();
  await page.getByRole('button', { name: /Continue the journey/ }).click();
  await expect(page.locator('#scene')).toHaveAttribute('data-room', 'crossing');
}
async function openControls(page: Page) {
  await page.getByRole('button', { name: 'Route pedestal', exact: true }).click();
  await expect(page.locator('#route-dialog')).toBeVisible();
}

test('old ending migrates, wrong route is safe, notebook solves crossing across a reload', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await start(page);
  await expect(page.locator('#rook')).toBeHidden();
  await expect(page.locator('#inventory button')).toHaveCount(1);
  await page.screenshot({ path: 'art/qa/crossing-arrival.png' });
  await page.getByRole('button', { name: 'Transit arch', exact: true }).click();
  await page.getByRole('button', { name: 'Try the crossing', exact: true }).click();
  await expect(page.locator('#dialogue-text')).toContainText('Set the route');
  await openControls(page);
  await page.getByRole('button', { name: /Pull signal lever/ }).click();
  await expect(page.locator('#route-feedback')).toContainText('Wrong stop');
  await page.getByRole('button', { name: 'Open notebook', exact: true }).click();
  await expect(page.locator('#route-clue')).toContainText('Spire');
  await expect(page.locator('#route-clue')).toContainText('Lantern');
  await page.getByRole('button', { name: /Turn destination ring/ }).click();
  await page.reload();
  await page.getByRole('button', { name: /Continue the journey/ }).click();
  await openControls(page);
  await expect(page.locator('#label-destination')).toHaveText('Spire');
  await expect(page.locator('#route-clue')).toBeVisible();
  await page.getByRole('button', { name: /Turn beacon ring/ }).click();
  await page.getByRole('button', { name: /Turn beacon ring/ }).click();
  await page.screenshot({ path: 'art/qa/crossing-route-book.png' });
  await page.getByRole('button', { name: /Pull signal lever/ }).click();
  await expect(page.locator('#route-feedback')).toContainText('another cup');
  await expect(page.locator('#route-connection')).toHaveText('CONNECTED · RAID GUILD');
  await expect(page.getByRole('button', { name: /Turn destination ring/ })).toBeDisabled();
  await page.getByRole('button', { name: /Back to landing/ }).click();
  await expect(page.locator('#crossing-active')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'art/qa/crossing-active.png' });
  await page.getByRole('button', { name: 'Transit arch', exact: true }).click();
  await page.getByRole('button', { name: 'Step through the arch', exact: true }).click();
  await expect(page.locator('#scene')).toHaveAttribute('data-room', 'workshop');
  await expect(page.locator('.workshop-art')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Keeper Orin', exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /Continue the journey/ }).click();
  await expect(page.locator('#scene')).toHaveAttribute('data-room', 'workshop');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('raidguild:last-mile:room-one')!).transit.completed)).toBe(true);
  expect(errors).toEqual([]);
});

test('mobile notebook and keyboard rings remain reachable', async ({ page }) => {
  await start(page, { width: 390, height: 844 });
  await page.getByRole('button', { name: 'Select Notebook' }).click();
  await expect(page.locator('#route-dialog')).toHaveClass(/notebook-only/);
  await expect(page.locator('#route-clue')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#route-dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Rook', exact: true }).click();
  await page.getByRole('button', { name: 'Talk to Rook', exact: true }).click();
  await page.getByRole('button', { name: 'How can I help?', exact: true }).click();
  await expect(page.locator('#dialogue-text')).toContainText('Spire on the left');
  await openControls(page);
  await page.getByRole('button', { name: /Turn destination ring/ }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /Turn beacon ring/ }).focus();
  await page.keyboard.press('Space'); await page.keyboard.press('Space');
  await page.screenshot({ path: 'art/qa/crossing-mobile-controls.png' });
  await page.getByRole('button', { name: /Pull signal lever/ }).click();
  await expect(page.locator('#route-feedback')).toContainText('another cup');
  expect(await page.locator('#route-dialog').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.getByRole('button', { name: /Back to landing/ }).click();
  await page.getByRole('button', { name: 'Transit arch', exact: true }).click();
  await page.getByRole('button', { name: 'Step through the arch', exact: true }).click();
  await expect(page.locator('#scene')).toHaveAttribute('data-room', 'workshop');
  await expect(page.getByRole('button', { name: 'Keeper Orin', exact: true })).toBeVisible();
});
