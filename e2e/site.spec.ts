import { expect, test } from '@playwright/test';

test('home remains usable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /登上山/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /立即加入第三屆/ })).toHaveAttribute('href', /forms\.gle/);
});

test('the four content pages have a main heading', async ({ page }) => {
  for (const path of ['/about/', '/legacy/', '/activities/', '/join/']) {
    await page.goto(path);
    await expect(page.locator('main h1')).toHaveCount(1);
  }
});
