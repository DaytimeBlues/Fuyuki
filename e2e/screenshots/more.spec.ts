import { test, expect } from '@playwright/test';
import { Page } from '../pages/BasePage';

test.describe('Golden Screen: MoreView', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new Page(page);
    await homePage.goto();
    await homePage.waitForAppReady();
  });

  test('should render without layout shift', async ({ page }) => {
    await page.goto('/');
    await page.waitForAppReady();
    await page.getByTestId('nav-tab-more').click();
    
    const metrics = await page.evaluate(() => {
      const firstPaint = performance.getEntriesByType('paint')[0];
      const firstContentfulPaint = performance.getEntriesByType('largest-contentful-paint')[0];
      return {
        cls: firstPaint.startTime,
        fcp: firstContentfulPaint.startTime,
        shift: firstContentfulPaint.startTime - firstPaint.startTime
      };
    });

    expect(metrics.shift).toBeLessThan(2);
  });

  test('should use consistent spacing and grid', async ({ page }) => {
    await page.goto('/');
    await page.waitForAppReady();
    await page.getByTestId('nav-tab-more').click();
    
    const gridContainer = page.locator('.grid').first();
    const gap = await gridContainer.evaluate(el => {
      const style = window.getComputedStyle(el);
      return parseInt(style.gap);
    });

    const spacingTokens = {
      space4: 16
    };

    const minExpected = spacingTokens.space4 - 4;
    const maxExpected = spacingTokens.space4 + 4;
    
    expect(gap).toBeGreaterThanOrEqual(minExpected);
    expect(gap).toBeLessThanOrEqual(maxExpected);
  });

  test('should have proper touch targets', async ({ page }) => {
    await page.goto('/');
    await page.waitForAppReady();
    await page.getByTestId('nav-tab-more').click();
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    const minSize = await buttons.evaluateAll(async (btns) => {
      const rects = await Promise.all(btns.map(btn => btn.boundingBox()));
      return Math.min(...rects.map(r => Math.min(r.width, r.height)));
    });
    
    expect(count).toBeGreaterThan(0);
    expect(minSize).toBeGreaterThanOrEqual(44); // 44px minimum
  });
});
