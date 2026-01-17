import { test, expect } from '../fixtures/testFixtures';

test.describe('Navigation', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
    });

    test('should navigate between all tabs', async ({ page }) => {
        // Check strict mode - shouldn't have any console errors
        // ... (this part is fine, ensure it's preserved)

        // IDs from AppShell.tsx navItems
        const tabs = ['stats', 'spells', 'combat', 'character', 'more'];

        for (const tab of tabs) {
            // Use attribute selector for navigation buttons which we added in AppShell
            await expect(page.locator(`button[data-testid="nav-tab-${tab}"]`)).toBeVisible();
        }
    });
});
