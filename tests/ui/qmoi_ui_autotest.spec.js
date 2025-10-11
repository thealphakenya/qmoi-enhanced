import { test, expect } from '@playwright/test';

test('QMOI dashboard loads and shows health', async ({ page }) => {
  await page.goto('http://localhost:3010');
  await expect(page.locator('text=QMOI Dashboard')).toBeVisible();
  await expect(page.locator('text=Health')).toBeVisible();
  // Check that at least one download link is present
  await expect(page.locator('a[href*="downloads.qmoi.app"]')).toHaveCountGreaterThan(0);

  // Check download button exists and works (simulate click)
  const downloadBtn = page.locator('button:has-text("Download")');
  if (await downloadBtn.count() > 0) {
    await downloadBtn.first().click();
    // Optionally check for download started message or modal
    await expect(page.locator('text=Download started')).toBeVisible({ timeout: 5000 });
  }

  // Test navigation (e.g., to settings or help)
  const navLink = page.locator('a:has-text("Settings")');
  if (await navLink.count() > 0) {
    await navLink.first().click();
    await expect(page.locator('text=Settings')).toBeVisible();
  }

  // Test error message display (simulate error if possible)
  // This is a [PRODUCTION IMPLEMENTATION REQUIRED]; adapt to your UI's error triggers
  // await page.click('button:has-text("Trigger Error")');
  // await expect(page.locator('text=Error')).toBeVisible();
}); 