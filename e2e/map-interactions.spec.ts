import { test, expect } from '@playwright/test';

test.describe('Map Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Wait for the map to load
    await page.waitForSelector('svg', { timeout: 10000 });
  });

  // Helper to wait for localStorage to update
  const STORAGE_KEY = 'travel_planner_data';

  async function waitForStorage(page: any, expectedData: (data: any) => boolean, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const storage = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
      if (storage) {
        const data = JSON.parse(storage);
        if (expectedData(data)) {
          return data;
        }
      }
      await page.waitForTimeout(100);
    }
    throw new Error('Storage did not update within timeout');
  }

  test('should add a country by clicking on the map', async ({ page }) => {
    // Wait for the map to be fully loaded
    await page.waitForTimeout(1000);

    // Click on Canada using evaluate to dispatch click event (more reliable)
    await page.evaluate(() => {
      const path = document.querySelector('path[data-country-code="CA"]') as HTMLElement;
      if (path) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        path.dispatchEvent(clickEvent);
      }
    });

    // Wait for the country to be added to the bar
    await page.waitForTimeout(500);

    // Verify the country appears in the selected countries bar
    const selectedBar = page.locator('.absolute.bottom-8');
    await expect(selectedBar).toBeVisible();

    // Check that the count shows "1 country"
    await expect(selectedBar.getByText('1 country')).toBeVisible();

    // Verify localStorage was updated (wait for async save)
    const data = await waitForStorage(page, (d) => d.beenTo && d.beenTo.includes('CA'));
    expect(data.beenTo).toContain('CA');
  });

  test('should remove a country by clicking on it and confirming', async ({ page }) => {
    // First, add a country programmatically (use Canada to avoid overlaps)
    await page.evaluate((storageKey) => {
      localStorage.setItem(storageKey, JSON.stringify({
        beenTo: ['CA'],
        wantToGo: [],
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      }));
    }, STORAGE_KEY);
    await page.reload();
    await page.waitForSelector('svg', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Verify the country is shown in the bar
    const selectedBar = page.locator('.absolute.bottom-8');
    await expect(selectedBar.getByText('1 country')).toBeVisible();

    // Click on Canada using evaluate
    await page.evaluate(() => {
      const path = document.querySelector('path[data-country-code="CA"]') as HTMLElement;
      if (path) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        path.dispatchEvent(clickEvent);
      }
    });

    // Wait for the removal dialog to appear
    await expect(page.getByRole('alertdialog')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/from your visited countries/)).toBeVisible();

    // Click the confirm button
    await page.getByRole('button', { name: /Remove/i }).click();

    // Wait for the dialog to close and country to be removed
    await page.waitForTimeout(500);

    // Verify the bar shows ghost placeholders (empty state)
    await expect(selectedBar.getByText('1 country')).not.toBeVisible();

    // Verify localStorage was updated (wait for async save)
    const data = await waitForStorage(page, (d) => d.beenTo && d.beenTo.length === 0);
    expect(data.beenTo).toHaveLength(0);
  });

  test('should add a country via the Add button', async ({ page }) => {
    // Wait for the map to be fully loaded
    await page.waitForTimeout(1000);

    // Click the "Add" button in the selected countries bar
    const addButton = page.locator('button', { hasText: 'Add' });
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Wait for the modal to open
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Add Country')).toBeVisible();

    // Search for a country (e.g., "Japan")
    const searchInput = page.getByPlaceholder(/Search countries/i);
    await searchInput.fill('Japan');
    await page.waitForTimeout(500);

    // Click on Japan in the results - look for the card containing Japan
    const japanButton = page.locator('button').filter({ hasText: 'Japan' }).first();
    await japanButton.click();

    // Wait for the country to be added and localStorage to update
    const data = await waitForStorage(page, (d) => d.beenTo && d.beenTo.includes('JP'));
    expect(data.beenTo).toContain('JP');

    // Close the modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Verify the country appears in the selected countries bar
    const selectedBar = page.locator('.absolute.bottom-8');
    await expect(selectedBar.getByText('1 country')).toBeVisible();
  });

  test('should persist countries after page reload', async ({ page }) => {
    // Add a country using evaluate
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      const path = document.querySelector('path[data-country-code="CA"]') as HTMLElement;
      if (path) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        path.dispatchEvent(clickEvent);
      }
    });

    // Wait for storage to be updated
    await waitForStorage(page, (d) => d.beenTo && d.beenTo.includes('CA'));

    // Verify it's in the bar
    const selectedBar = page.locator('.absolute.bottom-8');
    await expect(selectedBar.getByText('1 country')).toBeVisible();

    // Reload the page
    await page.reload();
    await page.waitForSelector('svg', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Verify the country is still there
    await expect(selectedBar.getByText('1 country')).toBeVisible();

    // Verify localStorage still has the data
    const storage = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(storage).toBeTruthy();
    const data = JSON.parse(storage!);
    expect(data.beenTo).toContain('CA');
  });
});
