import { test, expect } from '../fixtures/testFixtures';
import type { Page } from '@playwright/test';
import { initialCharacterData } from '../../src/data/initialState';

const createSession = (characterOverrides: Partial<typeof initialCharacterData> = {}) => {
    const now = new Date().toISOString();
    return {
        id: 'e2e-session',
        sessionNumber: 1,
        date: now,
        label: 'E2E',
        characterData: {
            ...initialCharacterData,
            ...characterOverrides,
        },
        minions: [],
        lastModified: now,
        version: 2,
        migrationVersion: 3,
    };
};

const seedSession = async (page: Page, session: ReturnType<typeof createSession>) => {
    await page.evaluate((sessionData) => {
        localStorage.setItem('fuyuki-sessions', JSON.stringify([sessionData]));
        localStorage.setItem('fuyuki-active-session', sessionData.id);
    }, session);
    await page.reload();
};

test.describe('Pact Slots & Arcanum', () => {
    test('should track pact slot usage', async ({ homePage }) => {
        await homePage.goto();
        await seedSession(homePage.page, createSession());
        await homePage.waitForAppReady();
        await homePage.navigateTo('stats');

        // Level 5 has 2 slots
        await homePage.usePactSlot(0);
        await expect(homePage.page.getByTestId('pact-slots-display')).toContainText('1'); // 1/2
    });

    test('should track mystic arcanum usage at high level', async ({ homePage }) => {
        await homePage.goto();
        await seedSession(homePage.page, createSession({
            level: 11,
            profBonus: 4,
            pactSlots: { current: 3, max: 3, level: 5 },
            arcanum: {
                6: { spellName: 'Test Arcanum', used: false }
            }
        }));
        await homePage.waitForAppReady();
        await homePage.navigateTo('stats');

        // At level 11, should have 6th level arcanum
        const arcanumBtn = homePage.page.getByTestId('arcanum-6');
        await expect(arcanumBtn).toBeVisible({ timeout: 20000 });

        // Wait for animation to settle
        await homePage.page.waitForTimeout(500);

        await arcanumBtn.click();
        await expect(homePage.page.getByTestId('arcanum-orb-6')).toHaveClass(/bg-bg/);
    });
});
