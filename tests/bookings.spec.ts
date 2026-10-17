import { test, expect } from '@playwright/test';

test('bookings page lists seeded bookings', async ({ page }) => {
  await page.goto('/bookings');
  await expect(page.getByRole('heading', { name: 'Bookings' })).toBeVisible();
  await expect(page.getByRole('listitem').first()).toBeVisible();
});
