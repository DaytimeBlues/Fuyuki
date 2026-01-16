import { test, expect } from '../fixtures/testFixtures';

test.describe('Persistence & State', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
    });

    test('should persist state across reloads', async ({ homePage }) => {
        await homePage.decreaseHP(5);
        await homePage.usePactSlot(0);

        // Wait a bit for persistence (requestIdleCallback + debounce)
        await homePage.page.waitForTimeout(5000);

        await homePage.page.reload();
        await homePage.waitForAppReady();

        await homePage.verifyHP(33, 38);
        await expect(homePage.page.getByTestId('pact-slots-display')).toContainText('1');
    });
});
