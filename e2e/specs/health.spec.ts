import { test, expect } from '../fixtures/testFixtures';

test.describe('Health Management', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
        await homePage.navigateTo('stats');
    });

    test('should increase and decrease current HP', async ({ homePage }) => {
        await homePage.decreaseHP(2);
        await homePage.verifyHP(36, 38); // Baseline 38

        await homePage.increaseHP(1);
        await homePage.verifyHP(37, 38);
    });

    test('should set and clear temporary HP', async ({ homePage }) => {
        await homePage.setTempHP(5);
        await homePage.verifyHP(38, 38, 5);

        await homePage.clearTempHP();
        await homePage.verifyHP(38, 38, 0);
    });

    test('should track death saves', async ({ homePage }) => {
        // Decrease HP to 0 so the widget is rendered
        await homePage.reduceHpToZero();

        await homePage.markDeathSuccess(0);
        await expect(homePage.page.getByTestId('death-success-0')).toBeVisible();

        await homePage.markDeathFailure(0);
        await expect(homePage.page.getByTestId('death-failure-0')).toBeVisible();
    });
});
