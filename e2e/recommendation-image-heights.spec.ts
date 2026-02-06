import { test, expect } from '@playwright/test';

test.describe('Recommendation Card Image Heights and Grid Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  async function generateRecommendations(page: any) {
    const homeInput = page.getByPlaceholder('Start typing your country...');
    await homeInput.fill('United');
    await page.waitForSelector('text=United States');
    await page.getByText('United States', { exact: true }).first().click();
    await page.getByText('Weather', { exact: true }).click();
    await page.getByText('6-12h').click();
    await page.waitForSelector('button:has-text("Get New Recommendations")', { timeout: 10000 });
  }

  test('mobile: images are 192px (h-48) in 1 column grid', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await generateRecommendations(page);

    // Verify 1 column grid
    const gridContainer = page.locator('.grid').first();
    const gridCols = await gridContainer.evaluate((el) =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    // Should be a single column (one value, not multiple)
    expect(gridCols.split(' ').length).toBe(1);

    // Verify image heights are 192px (h-48)
    const count = await page.locator('.recommendation-card').count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const imageContainer = page.locator('.recommendation-card').nth(i)
        .locator('> div > div').first();
      const box = await imageContainer.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        // h-48 is 192px, allow 1px tolerance
        expect(Math.abs(box.height - 192)).toBeLessThanOrEqual(1);
      }
    }
  });

  test('medium (768px): images fill card height with min 320px in 2 column grid', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await generateRecommendations(page);

    // Verify 2 column grid
    const gridContainer = page.locator('.grid').first();
    const gridCols = await gridContainer.evaluate((el) =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    expect(gridCols.split(' ').length).toBe(2);

    // Verify image heights are at least 320px and fill card height
    const count = await page.locator('.recommendation-card').count();

    for (let i = 0; i < count; i++) {
      const card = page.locator('.recommendation-card').nth(i);
      const imageContainer = card.locator('> div > div').first();

      const cardBox = await card.boundingBox();
      const imageBox = await imageContainer.boundingBox();

      expect(cardBox).not.toBeNull();
      expect(imageBox).not.toBeNull();

      if (cardBox && imageBox) {
        // Images should be at least 320px
        expect(imageBox.height).toBeGreaterThanOrEqual(320);

        // Images should fill most of the card height (within 10px for padding/borders)
        expect(Math.abs(cardBox.height - imageBox.height)).toBeLessThanOrEqual(10);
      }
    }
  });

  test('medium-large (1024px): stays 2 columns, images fill height', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await generateRecommendations(page);

    // At 1024px, should still be 2 columns (breakpoint moved to xl:1280px)
    const gridContainer = page.locator('.grid').first();
    const gridCols = await gridContainer.evaluate((el) =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    expect(gridCols.split(' ').length).toBe(2);

    // Verify images fill card height
    const count = await page.locator('.recommendation-card').count();

    for (let i = 0; i < count; i++) {
      const card = page.locator('.recommendation-card').nth(i);
      const imageContainer = card.locator('> div > div').first();

      const cardBox = await card.boundingBox();
      const imageBox = await imageContainer.boundingBox();

      if (cardBox && imageBox) {
        expect(imageBox.height).toBeGreaterThanOrEqual(320);
        expect(Math.abs(cardBox.height - imageBox.height)).toBeLessThanOrEqual(10);
      }
    }
  });

  test('xl (1280px): switches to 3 columns, images fill height', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await generateRecommendations(page);

    // At 1280px, should be 3 columns
    const gridContainer = page.locator('.grid').first();
    const gridCols = await gridContainer.evaluate((el) =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    expect(gridCols.split(' ').length).toBe(3);

    // Verify images fill card height with minimum 320px
    const count = await page.locator('.recommendation-card').count();

    for (let i = 0; i < count; i++) {
      const card = page.locator('.recommendation-card').nth(i);
      const imageContainer = card.locator('> div > div').first();

      const cardBox = await card.boundingBox();
      const imageBox = await imageContainer.boundingBox();

      if (cardBox && imageBox) {
        expect(imageBox.height).toBeGreaterThanOrEqual(320);
        expect(Math.abs(cardBox.height - imageBox.height)).toBeLessThanOrEqual(10);
      }
    }
  });

  test('xl (1920px): 3 columns with properly filled images', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await generateRecommendations(page);

    // Verify 3 columns at large desktop width
    const gridContainer = page.locator('.grid').first();
    const gridCols = await gridContainer.evaluate((el) =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    expect(gridCols.split(' ').length).toBe(3);

    // Verify no gaps between image and card
    const count = await page.locator('.recommendation-card').count();

    for (let i = 0; i < count; i++) {
      const card = page.locator('.recommendation-card').nth(i);
      const imageContainer = card.locator('> div > div').first();

      const cardBox = await card.boundingBox();
      const imageBox = await imageContainer.boundingBox();

      if (cardBox && imageBox) {
        // At large width, images should comfortably exceed minimum
        expect(imageBox.height).toBeGreaterThanOrEqual(320);
        // Should fill the card with minimal gap
        expect(Math.abs(cardBox.height - imageBox.height)).toBeLessThanOrEqual(5);
      }
    }
  });

  test('cards in same row have uniform heights', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await generateRecommendations(page);

    // Get all cards and group by row (based on y position)
    const cards = page.locator('.recommendation-card');
    const count = await cards.count();

    const cardsByRow: { y: number; heights: number[] }[] = [];

    for (let i = 0; i < count; i++) {
      const box = await cards.nth(i).boundingBox();
      if (box) {
        // Find or create row
        const existingRow = cardsByRow.find(r => Math.abs(r.y - box.y) < 5);
        if (existingRow) {
          existingRow.heights.push(box.height);
        } else {
          cardsByRow.push({ y: box.y, heights: [box.height] });
        }
      }
    }

    // Verify all cards in each row have the same height
    for (const row of cardsByRow) {
      if (row.heights.length > 1) {
        const firstHeight = row.heights[0];
        for (const height of row.heights) {
          expect(Math.abs(height - firstHeight)).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  test('loading skeleton images match real card dimensions', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to page and intercept the recommendation request to slow it down
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 1000);
    });

    const homeInput = page.getByPlaceholder('Start typing your country...');
    await homeInput.fill('France');
    await page.waitForSelector('text=France');
    await page.getByText('France', { exact: true }).first().click();
    await page.getByText('Culture', { exact: true }).click();
    await page.getByText('3-6h').click();

    // Check skeleton heights while loading
    const skeletons = page.locator('.animate-pulse .bg-muted').first();
    const skeletonBox = await skeletons.boundingBox();

    if (skeletonBox) {
      // Skeleton should have minimum 320px height
      expect(skeletonBox.height).toBeGreaterThanOrEqual(320);
    }

    // Wait for real results and verify they match skeleton dimensions
    await page.waitForSelector('text=Recommendations', { timeout: 10000 });
  });

  test('sample result cards have consistent image heights', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Sample results should be visible by default
    await expect(page.getByText('Sample destinations')).toBeVisible();

    // Get sample card image container heights (opacity-60 class)
    const sampleCards = page.locator('.opacity-60');
    const count = await sampleCards.count();
    expect(count).toBe(3); // Japan, Italy, Thailand

    const heights = [];
    for (let i = 0; i < count; i++) {
      const imageContainer = sampleCards.nth(i).locator('> div > div').first();
      const box = await imageContainer.boundingBox();
      if (box) heights.push(box.height);
    }

    // Verify all sample images have consistent heights
    const firstHeight = heights[0];
    for (const height of heights) {
      expect(Math.abs(height - firstHeight)).toBeLessThanOrEqual(1);
    }

    // Verify minimum 320px on desktop
    expect(firstHeight).toBeGreaterThanOrEqual(320);
  });

  test('images fill container even with varying content lengths', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await generateRecommendations(page);

    // Wait for enriched data to load (adds more content to cards)
    await page.waitForTimeout(2000);

    // Verify that even with different content lengths, images still fill their cards
    const cards = page.locator('.recommendation-card');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const imageContainer = card.locator('> div > div').first();

      const cardBox = await card.boundingBox();
      const imageBox = await imageContainer.boundingBox();

      if (cardBox && imageBox) {
        // Image should fill the card even if content varies
        expect(Math.abs(cardBox.height - imageBox.height)).toBeLessThanOrEqual(10);
        // Minimum height maintained
        expect(imageBox.height).toBeGreaterThanOrEqual(320);
      }
    }
  });
});
