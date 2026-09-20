import { test, expect } from '@playwright/test';

test('Rook works, attends to the player, pauses for dialogs, and resumes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');
  await page.getByRole('button', { name: /Begin the journey/ }).click();
  const rook = page.locator('#rook');
  const sprite = page.locator('#rook-sprite');
  await expect(rook).toHaveAttribute('data-mode', 'work');
  await expect(sprite).toHaveAttribute('data-frame', '1', { timeout: 4000 });
  const working = await sprite.evaluate((el: HTMLCanvasElement) => el.toDataURL());
  await page.screenshot({ path: 'art/qa/rook-working.png' });
  await expect(sprite).toHaveAttribute('data-frame', '2', { timeout: 2000 });
  expect(await sprite.evaluate((el: HTMLCanvasElement) => el.toDataURL())).not.toBe(working);
  await page.getByRole('button', { name: 'Rook', exact: true }).click();
  await expect(rook).toHaveAttribute('data-mode', 'attentive');
  await expect(sprite).toHaveAttribute('data-frame', '0');
  await page.getByRole('button', { name: 'Talk to Rook', exact: true }).click();
  await page.waitForTimeout(900);
  await expect(sprite).toHaveAttribute('data-frame', '0');
  await page.locator('#scene').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(rook).toHaveAttribute('data-mode', 'work');
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await expect(rook).toHaveAttribute('data-paused', 'true');
  const paused = await sprite.getAttribute('data-frame');
  await page.waitForTimeout(1600);
  await expect(sprite).toHaveAttribute('data-frame', paused!);
  await page.getByRole('button', { name: 'Keep exploring' }).click();
  await expect(rook).toHaveAttribute('data-paused', 'false');
});

test('painted props survive placement and Rook settles after repair in reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: /Begin the journey/ }).click();
  await expect(page.locator('#rook')).toHaveAttribute('data-paused', 'true');
  await expect(page.locator('#rook-sprite')).toHaveAttribute('data-frame', '0');
  for (const [item, label] of [['plate', 'Cargo plate'], ['jack', 'Screw jack']]) {
    await expect(page.locator(`#ground-${item} image`)).toHaveAttribute('href', /waystation-tools-v1.webp/);
    await page.getByRole('button', { name: label, exact: true }).click();
    await page.getByRole('button', { name: `Take ${label.toLowerCase()}`, exact: true }).click();
    await expect(page.locator(`[data-item="${item}"] [data-painted="${item}"]`)).toBeVisible();
    await page.getByRole('button', { name: `Select ${label}`, exact: true }).click();
    await page.getByRole('button', { name: 'Repair point', exact: true }).click();
    await expect(page.locator(`#ground-${item}`)).toHaveClass(/placed/);
  }
  await page.screenshot({ path: 'art/qa/painted-tools-placed.png' });
  await page.getByRole('button', { name: 'Turn the crank' }).click();
  await expect(page.locator('#rook')).toHaveAttribute('data-mode', 'settled');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(1800);
  await expect(page.locator('#rook-sprite')).toHaveAttribute('data-frame', '0');
  await expect(page.locator('#ground-jack')).toBeHidden();
  await expect(page.locator('#ground-plate')).toBeHidden();
});
