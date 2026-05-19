import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
  test('should display admin login page with red branding', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Admin Console')).toBeVisible();
    await expect(page.locator('text=Restricted Access')).toBeVisible();
  });

  test('should login and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@wellness.th');
    await page.fill('input[type="password"]', 'admin-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/', { timeout: 5000 });
    await expect(page.locator('h1')).toContainText('Admin Console');
  });
});

test.describe('Admin Console Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      { name: 'admin_auth_token', value: 'mock-token', domain: 'localhost', path: '/' },
    ]);
  });

  test('should display platform KPIs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Admin Console');
    await expect(page.locator('text=ผู้ใช้ทั้งหมด')).toBeVisible();
    await expect(page.locator('text=พาร์ทเนอร์')).toBeVisible();
  });

  test('should navigate to users page', async ({ page }) => {
    await page.goto('/users');
    await expect(page.locator('h1')).toContainText('ผู้ใช้งาน');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should navigate to partners page', async ({ page }) => {
    await page.goto('/partners');
    await expect(page.locator('h1')).toContainText('พาร์ทเนอร์');
  });

  test('should navigate to approvals page', async ({ page }) => {
    await page.goto('/approvals');
    await expect(page.locator('h1')).toContainText('การอนุมัติ');
  });

  test('should navigate to security page', async ({ page }) => {
    await page.goto('/security');
    await expect(page.locator('h1')).toContainText('ความปลอดภัย');
  });

  test('should navigate to audit log page', async ({ page }) => {
    await page.goto('/audit');
    await expect(page.locator('h1')).toContainText('Audit Log');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should search users by name', async ({ page }) => {
    await page.goto('/users');
    const searchInput = page.locator('input[placeholder*="ค้นหา"]');
    await searchInput.fill('สมชาย');
    // Should filter to matching results
    await expect(page.locator('text=สมชาย ใจดี')).toBeVisible();
  });
});
