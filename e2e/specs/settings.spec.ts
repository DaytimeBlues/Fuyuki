import { test, expect } from '../fixtures/testFixtures';

test.describe('Settings View', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
        await homePage.navigateTo('settings');
    });

    test('should show attributes in settings view', async ({ page }) => {
        await page.getByRole('button', { name: 'Attributes' }).click();
        await expect(page.getByTestId('ability-score-cha')).toHaveText('16');
        await expect(page.getByTestId('ability-score-str')).toHaveText('8');
    });

    test('should show biography and grimoire sections', async ({ page }) => {
        await expect(page.getByText('Chronicles')).toBeVisible();
        await page.getByRole('button', { name: 'Grimoire' }).click();
        await expect(page.getByRole('button', { name: 'Invocations' })).toBeVisible();
    });
});
