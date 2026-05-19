import { test, expect } from '@playwright/test';

test.describe('Corporate Login Flow', () => {
  test('should display corporate login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Corporate Portal')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should login and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'hr@company.co.th');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/', { timeout: 5000 });
    await expect(page.locator('h1')).toContainText('Wellness Dashboard');
  });
});

test.describe('Corporate Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'corporate_auth_token', value: 'mock-token', domain: 'localhost', path: '/' },
    ]);
  });

  test('should display KPI dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Wellness Dashboard');
    // KPI cards should be visible
    await expect(page.locator('text=พนักงานเข้าร่วม')).toBeVisible();
    await expect(page.locator('text=Token ที่ใช้ไป')).toBeVisible();
  });

  test('should navigate to employees page', async ({ page }) => {
    await page.goto('/employees');
    await expect(page.locator('h1')).toContainText('พนักงาน');
  });

  test('should navigate to departments page', async ({ page }) => {
    await page.goto('/departments');
    await expect(page.locator('h1')).toContainText('แผนก');
  });

  test('should navigate to token allocation page', async ({ page }) => {
    await page.goto('/tokens');
    await expect(page.locator('h1')).toContainText('จัดสรร Token');
    await expect(page.locator('input[type="month"]')).toBeVisible();
  });

  test('should navigate to reports page', async ({ page }) => {
    await page.goto('/reports');
    await expect(page.locator('h1')).toContainText('รายงาน');
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('h1')).toContainText('ตั้งค่า');
    await expect(page.locator('text=Privacy-safe mode')).toBeVisible();
  });
});
