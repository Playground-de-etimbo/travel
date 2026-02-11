import { test, expect } from '@playwright/test';

test('keeps recommendation results mounted while preferences refresh', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const dismissDetectedCountry = page.getByRole('button', { name: 'Clear detected country' });
  if (await dismissDetectedCountry.isVisible()) {
    await dismissDetectedCountry.click();
  }

  await page.getByRole('button', { name: /Weather/ }).click();
  await page.getByRole('button', { name: /6-12h/ }).click();

  const recommendationsHeading = page
    .getByRole('heading', { name: /\d+ Recommendations/ })
    .first();

  await expect(recommendationsHeading).toBeVisible({ timeout: 20000 });
  const headingHandle = await recommendationsHeading.elementHandle();
  expect(headingHandle).not.toBeNull();

  await page.getByRole('button', { name: /Relaxation/ }).click();

  // Regression check: heading element should stay mounted during loading.
  await page.waitForFunction(
    (el) => {
      if (!el) return false;
      const element = el as HTMLElement;
      return element.isConnected && element.offsetParent !== null;
    },
    headingHandle,
    { timeout: 2000 }
  );
});
