import { test, expect } from '@playwright/test';

test('landing page renders title and login link', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/GCLMS/);
  await expect(page.getByRole('link', { name: /Sign In/i })).toBeVisible();
});
