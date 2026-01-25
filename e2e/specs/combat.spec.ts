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

        await expect(combatPage.page.getByText('Skeleton Spirit 1')).toBeVisible();
        await expect(combatPage.page.getByTestId('skeleton-counter')).toContainText('1');
    });

    test('should damage and remove minions', async ({ combatPage }) => {
        await combatPage.openMinionManager();
        await combatPage.raiseMinion('zombie');
        const hpInput = combatPage.page.getByTestId('minion-hp-input').first();
        const currentHp = Number(await hpInput.inputValue());
        const nextHp = Math.max(0, currentHp - 1);

        await hpInput.fill(nextHp.toString());
        await expect(hpInput).toHaveValue(nextHp.toString());

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
