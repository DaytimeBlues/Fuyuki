import { test, expect } from '../fixtures/testFixtures';

test.describe('Undead Horde Management', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
        await homePage.waitForAppReady();
        await homePage.navigateTo('combat');
    });

    test('should raise and manage skeletons', async ({ combatPage }) => {
        await combatPage.openMinionManager();
        await combatPage.raiseMinion('skeleton');

        await expect(combatPage.page.getByText('Skeleton 1')).toBeVisible();
        await expect(combatPage.page.getByTestId('skeleton-counter')).toContainText('1');
    });

    test('should damage and remove minions', async ({ combatPage }) => {
        await combatPage.openMinionManager();
        await combatPage.raiseMinion('zombie');

        // Check HP of first minion
        await expect(combatPage.page.getByTestId('minion-hp-input').first()).toHaveValue('22');

        await combatPage.damageMinion(0);
        await expect(combatPage.page.getByTestId('minion-hp-input').first()).toHaveValue('21');

        await combatPage.removeMinion(0);
        await expect(combatPage.page.getByTestId('minion-card')).toHaveCount(0);
    });

    test('should deduct spell slot on cast', async ({ combatPage }) => {
        await combatPage.openMinionManager();
        await combatPage.raiseMinion('skeleton');
        await combatPage.raiseMinion('zombie');

        await combatPage.releaseAllMinions();
        await expect(combatPage.page.getByTestId('minion-card')).toHaveCount(0);
    });

    test('should release all minions', async ({ combatPage }) => {
        await combatPage.openMinionManager();
        await combatPage.raiseMinion('skeleton');
        await combatPage.raiseMinion('zombie');

        await combatPage.releaseAllMinions();
        await expect(combatPage.page.getByTestId('minion-card')).toHaveCount(0);
    });
});
