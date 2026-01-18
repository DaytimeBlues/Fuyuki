import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
    async openCharacterEditor() {
        const toggle = this.page.getByTestId('character-editor-toggle');
        // Check if it's already expanded (this is a bit tricky with vanilla CSS, 
        // but let's assume we need to click it if the input is not visible)
        if (!await this.page.getByTestId('level-input').isVisible()) {
            await toggle.click();
        }
    }

    async adjustLevel(delta: number) {
        await this.openCharacterEditor();
        const btnId = delta > 0 ? 'level-increase-btn' : 'level-decrease-btn';
        const absoluteDelta = Math.abs(delta);
        for (let i = 0; i < absoluteDelta; i++) {
            await this.page.getByTestId(btnId).click();
        }
    }

    async adjustAbility(ability: string, delta: number) {
        await this.openCharacterEditor();
        const btnId = delta > 0 ? `ability-${ability}-increase-btn` : `ability-${ability}-decrease-btn`;
        const absoluteDelta = Math.abs(delta);
        for (let i = 0; i < absoluteDelta; i++) {
            await this.page.getByTestId(btnId).click();
        }
    }

    async verifyAbilityScore(ability: string, expected: number) {
        await expect(this.page.getByTestId(`ability-score-${ability}`)).toContainText(expected.toString());
    }

    async spendHitDie() {
        const btn = this.page.getByTestId('spend-hit-die-btn');
        await expect(btn).toBeVisible();
        await expect(btn).toBeEnabled();
        await btn.click({ force: true });
    }

    async startShortRest() {
        await this.page.getByTestId('short-rest-btn').click();
    }

    async finishShortRest() {
        await this.page.getByTestId('finish-short-rest-btn').click();
    }

    async takeLongRest() {
        await this.page.getByTestId('long-rest-btn').click();
    }
}
