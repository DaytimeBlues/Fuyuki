import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    async setTempHP(value: number) {
        await this.page.getByTestId('hp-temp-input').fill(value.toString());
        await this.page.getByTestId('hp-temp-set-btn').click();
    }

    async clearTempHP() {
        await this.page.getByTestId('hp-temp-clear-btn').click();
    }

    async increaseHP(amount: number = 1) {
        for (let i = 0; i < amount; i++) {
            await this.page.getByTestId('hp-increase-btn').click();
        }
    }

    async decreaseHP(amount: number = 1) {
        for (let i = 0; i < amount; i++) {
            await this.page.getByTestId('hp-decrease-btn').click();
        }
    }

    async usePactSlot(index: number) {
        await this.page.getByTestId(`pact-slot-orb-${index}`).click();
    }

    async useArcanum(level: number) {
        await this.page.getByTestId(`arcanum-orb-${level}`).click();
    }

    async setConcentrationFromSuggestion(spellName: string) {
        const testId = `concentration-set-btn-${spellName.toLowerCase().replace(/\s+/g, '-')}`;
        await this.page.getByTestId(testId).click();
    }

    async clearConcentration() {
        await this.page.getByTestId('concentration-clear-btn').click();
    }

    async markDeathSuccess(index: number) {
        await this.page.getByTestId(`death-success-${index}`).click();
    }

    async markDeathFailure(index: number) {
        await this.page.getByTestId(`death-failure-${index}`).click();
    }

    async verifyHP(current: number, max: number, temp: number = 0) {
        await expect(this.page.getByTestId('hp-current')).toContainText(current.toString());
        await expect(this.page.getByTestId('hp-max')).toContainText(max.toString());
        if (temp > 0) {
            await expect(this.page.getByTestId('hp-temp-display')).toContainText(`+${temp}`);
        }
    }
}
