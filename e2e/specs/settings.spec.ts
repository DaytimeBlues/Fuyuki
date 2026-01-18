import { test, expect } from '../fixtures/testFixtures';

test.describe('Settings View', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
        await homePage.navigateTo('settings');
    });

    test('should update character level and reflect in stats', async ({ page }) => {
        await page.getByTestId('character-editor-toggle').click();

        const levelInput = page.getByTestId('level-input');
        await expect(levelInput).toBeVisible();

        // Check Initial State (Assuming level 5 from mocked data or default)
        // We read the value first
        const initialLevel = await levelInput.inputValue();
        const newLevel = parseInt(initialLevel) + 1;

        // Change Level
        await levelInput.fill(newLevel.toString());

        // Verify Input Updated
        await expect(levelInput).toHaveValue(newLevel.toString());

        // Verify Proficiency Bonus Might Change (Level 5->6 is same +3, Level 4->5 becomes +3 from +2)
        // If we are Level 5 (+3), going to 6 is still +3.
        // Let's set to Level 1 (+2) then Level 5 (+3).
        await levelInput.fill('1');
        await expect(page.getByTestId('proficiency-bonus')).toHaveText('+2');

        await levelInput.fill('5');
        await expect(page.getByTestId('proficiency-bonus')).toHaveText('+3');
    });

    test('should update ability scores', async ({ page }) => {
        await page.getByTestId('character-editor-toggle').click();

        const strInput = page.getByTestId('ability-str-input');
        await strInput.fill('18');

        // We don't have a Strength Widget visible to cross-verify easily on this view unless we verify Saving Throw
        // But verifying the input retains value is good enough for smoke test.
        await expect(strInput).toHaveValue('18');
    });
});
