import { test, expect } from '@playwright/test';

test.describe('Partner Login Flow', () => {
  test('should display login page with branding', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Wellness Partner Dashboard/);
    await expect(page.locator('text=Partner Portal')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should login and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'demo@partner.co.th');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('/', { timeout: 5000 });
    await expect(page.locator('text=ภาพรวม')).toBeVisible();
  });
});

test.describe('Partner Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set auth cookie to skip login
    await page.context().addCookies([
      { name: 'partner_auth_token', value: 'mock-token', domain: 'localhost', path: '/' },
    ]);
  });

  test('should display dashboard overview', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('ภาพรวม');
  });

  test('should navigate to bookings page', async ({ page }) => {
    await page.goto('/bookings');
    await expect(page.locator('h1')).toContainText('การจอง');
    // Should have booking table
    await expect(page.locator('table')).toBeVisible();
  });

  test('should navigate to offers page', async ({ page }) => {
    await page.goto('/offers');
    await expect(page.locator('h1')).toContainText('ข้อเสนอ');
  });

  test('should navigate to check-in page', async ({ page }) => {
    await page.goto('/check-in');
    await expect(page.locator('h1')).toContainText('เช็คอิน');
  });

  test('should navigate to settlement page', async ({ page }) => {
    await page.goto('/settlement');
    await expect(page.locator('h1')).toContainText('Settlement');
  });

  test('should navigate to slot management page', async ({ page }) => {
    await page.goto('/slots');
    await expect(page.locator('h1')).toContainText('จัดการ Slot');
  });
});

test.describe('Partner Offer CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'partner_auth_token', value: 'mock-token', domain: 'localhost', path: '/' },
    ]);
  });

  test('should open create offer form', async ({ page }) => {
    await page.goto('/offers/new');
    await expect(page.locator('h1')).toContainText('สร้างข้อเสนอใหม่');
    // Form fields should be present
    await expect(page.locator('#offer-name')).toBeVisible();
    await expect(page.locator('#offer-type')).toBeVisible();
  });
});
