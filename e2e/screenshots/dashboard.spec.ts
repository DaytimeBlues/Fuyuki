import { test, expect } from '@playwright/test';
import { Page } from '../pages/BasePage';

test.describe('Golden Screen: Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new Page(page);
    await homePage.goto();
    await homePage.waitForAppReady();
  });

  test('should render without layout shift', async ({ page }) => {
    await page.goto('/');
    await page.waitForAppReady();
    
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

  test('should have consistent spacing', async ({ page }) => {
    await page.goto('/');
    await page.waitForAppReady();
    
    const cardElement = page.locator('.card-parchment').first();
    const spacing = await cardElement.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        paddingTop: parseInt(style.paddingTop),
        paddingBottom: parseInt(style.paddingBottom),
        marginLeft: parseInt(style.marginLeft),
        marginRight: parseInt(style.marginRight)
      };
    });

    const tokens = {
      space4: 16,
      space6: 24
    };

    for (const [prop, token] of Object.entries(spacing)) {
      expect(Math.abs(tokens[token as number] - prop)).toBeLessThanOrEqual(4);
    }
  });

  test('should use consistent border radius', async ({ page }) => {
    await page.goto('/');
    await page.waitForAppReady();
    
    const cardElement = page.locator('.card-parchment').first();
    const borderRadius = await cardElement.evaluate(el => {
      const style = window.getComputedStyle(el);
      return parseInt(style.borderRadius);
    });

    const expectedRadius = 8;
    expect(borderRadius).toBeGreaterThanOrEqual(expectedRadius - 2);
    expect(borderRadius).toBeLessThanOrEqual(expectedRadius + 2);
  });
});
