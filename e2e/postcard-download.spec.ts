import { test, expect } from '@playwright/test';

async function assertImageLinkLooksNonBlank(page: Parameters<typeof test>[0]['page'], linkName: RegExp) {
  const link = page.getByRole('link', { name: linkName });
  await expect(link).toBeVisible({ timeout: 15_000 });

  const href = await link.getAttribute('href');
  expect(href).toBeTruthy();

  const analysis = await page.evaluate(async (url) => {
    if (!url) return { ok: false, reason: 'missing url' };

    const response = await fetch(url);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { ok: false, reason: 'no 2d context' };

    ctx.drawImage(bitmap, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let nonBlackOpaqueSamples = 0;
    let sampled = 0;

    const stepX = Math.max(1, Math.floor(width / 24));
    const stepY = Math.max(1, Math.floor(height / 24));
    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        sampled += 1;
        if (a > 0 && (r > 8 || g > 8 || b > 8)) {
          nonBlackOpaqueSamples += 1;
        }
      }
    }

    return {
      ok: nonBlackOpaqueSamples > Math.max(8, Math.floor(sampled * 0.05)),
      sampled,
      nonBlackOpaqueSamples,
    };
  }, href);

  expect(analysis.ok).toBeTruthy();
}

test.describe('Postcard download', () => {
  test('shows manual download links and can download front side', async ({ page }) => {
    await page.goto('/');

    const openDownloadDialogButton = page.getByRole('button', {
      name: /download both sides/i,
    });
    await openDownloadDialogButton.scrollIntoViewIfNeeded();
    await openDownloadDialogButton.click();

    const saveAndDownloadButton = page.getByRole('button', {
      name: /save & download/i,
    });
    await expect(saveAndDownloadButton).toBeVisible();

    await page.getByPlaceholder('Wanderer').fill('Tester');

    await saveAndDownloadButton.click();

    await expect(page.getByText(/If download did not start:/i)).toBeVisible({
      timeout: 15_000,
    });
    const manualFrontLink = page.getByRole('link', { name: /download front/i });
    const manualBackLink = page.getByRole('link', { name: /download back/i });
    await expect(manualFrontLink).toBeVisible();
    await expect(manualBackLink).toBeVisible();

    const frontDownloadPromise = page.waitForEvent('download');
    await manualFrontLink.click();
    const frontDownload = await frontDownloadPromise;
    expect(frontDownload.suggestedFilename()).toBe('destino-postcard-front.png');
  });

  test('exported front and back images are not blank/black', async ({ page }) => {
    await page.goto('/');

    const openDownloadDialogButton = page.getByRole('button', {
      name: /download both sides/i,
    });
    await openDownloadDialogButton.scrollIntoViewIfNeeded();
    await openDownloadDialogButton.click();
    await page.getByPlaceholder('Wanderer').fill('Tester');
    await page.getByRole('button', { name: /save & download/i }).click();

    await assertImageLinkLooksNonBlank(page, /download front/i);
    await assertImageLinkLooksNonBlank(page, /download back/i);
  });
});
