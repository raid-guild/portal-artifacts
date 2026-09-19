import { test, expect } from '@playwright/test';

test('walks with changing leg pixels in four directions and stands on arrival', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('button', { name: /Begin the journey/ }).click();
  const canvas = page.locator('#traveler');
  await expect(canvas).toHaveAttribute('data-animation', 'idle');
  const world = (await page.locator('#scene-world').boundingBox())!;
  for (const step of [{ x: 75, y: 91, facing: 'right' }, { x: 25, y: 91, facing: 'left' }, { x: 25, y: 85, facing: 'up' }, { x: 25, y: 94, facing: 'down' }]) {
    const observed = page.evaluate(() => new Promise<{ frames: string[]; hashes: number[]; facings: string[]; clipped: boolean }>((resolve, reject) => {
      const canvas = document.querySelector<HTMLCanvasElement>('#traveler')!;
      const ctx = canvas.getContext('2d')!;
      const frames = new Set<string>(), hashes = new Set<number>(), facings = new Set<string>();
      const deadline = performance.now() + 6000;
      let seenWalking = false, lastFrame = '', clipped = false;
      const sample = () => {
        if (canvas.dataset.animation === 'walk') {
          seenWalking = true;
          const frame = canvas.dataset.frame!;
          frames.add(frame); facings.add(canvas.dataset.facing!);
          if (frame !== lastFrame) {
            lastFrame = frame;
            // Compare the actual knee/boot drawing, not just animation attributes.
            const pixels = ctx.getImageData(0, Math.floor(canvas.height * .65), canvas.width, Math.floor(canvas.height * .35)).data;
            let hash = 2166136261;
            for (let i = 0; i < pixels.length; i += 64) hash = Math.imul(hash ^ pixels[i], 16777619);
            hashes.add(hash);
            for (const x of [0, canvas.width - 1]) {
              const edge = ctx.getImageData(x, 0, 1, canvas.height).data;
              if (edge.some((v, i) => i % 4 === 3 && v > 32)) clipped = true;
            }
          }
        } else if (seenWalking) {
          resolve({ frames: [...frames], hashes: [...hashes], facings: [...facings], clipped }); return;
        }
        if (performance.now() > deadline) { reject(new Error('Walking animation did not finish')); return; }
        requestAnimationFrame(sample);
      };
      sample();
    }));
    await page.mouse.click(world.x + world.width * step.x / 100, world.y + world.height * step.y / 100);
    const sample = await observed;
    expect(sample.facings).toEqual([step.facing]);
    expect(sample.frames.length).toBeGreaterThanOrEqual(2);
    expect(sample.hashes.length).toBeGreaterThanOrEqual(2);
    expect(sample.clipped).toBe(false);
    await expect(canvas).toHaveAttribute('data-frame', '0');
    await expect(canvas).toHaveAttribute('data-animation', 'idle');
  }
  await page.getByRole('button', { name: 'Rook', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Talk to Rook', exact: true })).toBeEnabled();
  await expect(canvas).toHaveAttribute('data-facing', 'up');
  await expect(canvas).toHaveAttribute('data-animation', 'idle');
  await page.screenshot({ path: 'art/qa/traveler-in-room.png' });
});

test('reduced motion changes facing without running a walk cycle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: /Begin the journey/ }).click();
  await page.locator('#scene').focus();
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#traveler')).toHaveAttribute('data-facing', 'up');
  await expect(page.locator('#traveler')).toHaveAttribute('data-frame', '0');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#traveler')).toHaveAttribute('data-facing', 'down');
  await expect(page.locator('#traveler')).toHaveAttribute('data-animation', 'idle');
});

test('motion preview loads all directions and can show standing poses', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto('/sprites.html');
  await page.getByRole('button', { name: 'Show standing poses', exact: true }).click();
  for (const direction of ['right', 'left', 'up', 'down']) {
    await expect(page.locator(`#pose-${direction}`)).toHaveAttribute('data-facing', direction);
    await expect(page.locator(`#pose-${direction}`)).toHaveAttribute('data-animation', 'idle');
  }
  await page.screenshot({ path: 'art/qa/traveler-directions.png', fullPage: true });
  await page.getByRole('button', { name: 'Show walking poses', exact: true }).click();
  await expect(page.locator('#pose-right')).toHaveAttribute('data-animation', 'walk');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const frame = await page.locator('#pose-right').getAttribute('data-frame');
  await page.waitForTimeout(200);
  await expect(page.locator('#pose-right')).toHaveAttribute('data-frame', frame!);
});
