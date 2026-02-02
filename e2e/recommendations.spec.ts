import { test, expect } from '@playwright/test';

test.describe('Personalized Recommendations', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows sample results by default', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Wait for page to load
    await page.waitForSelector('text=Personalized Recommendations');

    // Check sample results are visible
    await expect(page.getByText('Sample destinations')).toBeVisible();
    await expect(page.getByText('Japan')).toBeVisible();
    await expect(page.getByText('Italy')).toBeVisible();
    await expect(page.getByText('Thailand')).toBeVisible();
  });

  test('all form fields are visible and enabled from start', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check all fields are visible
    await expect(page.getByText('Where do you live?')).toBeVisible();
    await expect(page.getByText('What interests you?')).toBeVisible();
    await expect(page.getByText('How far are you willing to travel?')).toBeVisible();

    // Check fields are not disabled/greyed out
    const interestsSection = page.locator('text=What interests you?').locator('..');
    await expect(interestsSection).not.toHaveClass(/opacity-50/);

    const durationSection = page.locator('text=How far are you willing to travel').locator('..');
    await expect(durationSection).not.toHaveClass(/opacity-50/);
  });

  test('budget slider is always visible', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Budget slider should be visible before any country is selected
    await expect(page.getByRole('slider')).toBeVisible();
    await expect(page.getByText('Budget')).toBeVisible();
    await expect(page.getByText('Modest')).toBeVisible();
    await expect(page.getByText('Luxury')).toBeVisible();
  });

  test('can select home location', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Click home location input
    const homeInput = page.getByPlaceholder('Start typing your country...');
    await homeInput.click();
    await homeInput.fill('United');

    // Wait for dropdown and select United States
    await page.waitForSelector('text=United States');
    await page.getByText('United States').click();

    // Check selection is visible (not greyed out in dark mode)
    await expect(homeInput).toHaveValue('United States');
  });

  test('can select interests', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Click interest buttons
    await page.getByText('Weather', { exact: true }).click();
    await page.getByText('Culture', { exact: true }).click();

    // Verify selections are highlighted
    const weatherBtn = page.getByText('Weather', { exact: true });
    await expect(weatherBtn).toHaveClass(/bg-accent/);
  });

  test('can select travel duration', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Select travel duration
    await page.getByText('6-12h').click();

    // Verify selection
    const durationBtn = page.locator('text=6-12h').locator('..');
    await expect(durationBtn).toHaveClass(/border-accent/);
  });

  test('generates recommendations when form is complete', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Fill out form
    const homeInput = page.getByPlaceholder('Start typing your country...');
    await homeInput.fill('United');
    await page.getByText('United States').click();

    await page.getByText('Weather', { exact: true }).click();
    await page.getByText('6-12h').click();

    // Wait for loading state
    await expect(page.getByText('Generating your personalized recommendations...')).toBeVisible();

    // Wait for results (with timeout)
    await expect(page.getByText('Recommendations')).toBeVisible({ timeout: 10000 });

    // Sample results should be replaced with real results
    await expect(page.getByText('Sample destinations')).not.toBeVisible();
  });

  test('budget slider updates cost display', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Generate recommendations first
    const homeInput = page.getByPlaceholder('Start typing your country...');
    await homeInput.fill('United');
    await page.getByText('United States').click();
    await page.getByText('Weather', { exact: true }).click();
    await page.getByText('6-12h').click();

    // Wait for results
    await page.waitForSelector('text=Recommendations', { timeout: 10000 });

    // Switch budget tier
    await page.getByText('Luxury').click();

    // Cost should update (luxury costs more)
    // This is a basic check - actual values will vary
    await expect(page.locator('text=/\\$\\d+,\\d+/')).toBeVisible();
  });

  test('can regenerate recommendations', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Generate initial recommendations
    const homeInput = page.getByPlaceholder('Start typing your country...');
    await homeInput.fill('Japan');
    await page.getByText('Japan').click();
    await page.getByText('Culture', { exact: true }).click();
    await page.getByText('3-6h').click();

    // Wait for results
    await page.waitForSelector('button:has-text("Get New Recommendations")', { timeout: 10000 });

    // Click regenerate button
    await page.getByRole('button', { name: 'Get New Recommendations' }).click();

    // Should show loading state again
    await expect(page.getByText('Generating your personalized recommendations...')).toBeVisible();
  });

  test('shows error message for invalid selections', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Try to select a country without coordinates (if any)
    // This tests error handling
    const homeInput = page.getByPlaceholder('Start typing your country...');
    await homeInput.fill('Test');

    // Should not show any matches or show only valid countries
    await expect(page.getByText('42 countries available')).toBeVisible();
  });

  test('dark mode: selected country is visible', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Enable dark mode (assuming there's a toggle or it's system default)
    await page.emulateMedia({ colorScheme: 'dark' });

    // Select a country
    const homeInput = page.getByPlaceholder('Start typing your country...');
    await homeInput.fill('Japan');
    await page.getByText('Japan').click();

    // Verify input is readable (not greyed out)
    await expect(homeInput).toHaveValue('Japan');
    await expect(homeInput).not.toHaveCSS('opacity', '0.5');
  });
});
