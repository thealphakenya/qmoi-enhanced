import { test, expect } from '@playwright/test';

test('QMOI dashboard loads and shows health', async ({ page }) => {
  await page.goto('http://localhost:3010');
  await expect(page.locator('text=QMOI Dashboard')).toBeVisible();
  await expect(page.locator('text=Health')).toBeVisible();
  // Check that at least one download link is present
  await expect(page.locator('a[href*="downloads.qmoi.app"]')).toHaveCountGreaterThan(0);
}); 