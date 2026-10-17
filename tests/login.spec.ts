import { test, expect } from '@playwright/test';

// In CI the password comes from a GitHub secret (Ep 6). Locally it falls back to the demo value.
const password = process.env.TEST_PASSWORD || 'Secret123';

test('valid login shows welcome', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('asha@test.com');
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome, Asha' })).toBeVisible();
});

test('wrong password shows an error', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('asha@test.com');
  await page.getByLabel('Password').fill('wrong-pass');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Invalid email or password');
});
