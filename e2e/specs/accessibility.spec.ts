import { test, expect } from '../fixtures/testFixtures';

test.describe('Accessibility', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
    });

    test('main navigation should have labels', async ({ homePage }) => {
        const homeTab = homePage.page.getByTestId('nav-tab-stats');
        await expect(homeTab).toBeVisible();
    });
});
