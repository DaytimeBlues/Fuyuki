import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    async getCurrentHP() {
        const text = await this.page.getByTestId('hp-current').textContent();
        return Number(text ?? 0);
    }

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
        await this.page.getByTestId(`pact-slot-btn-${index}`).click();
    }

    async useArcanum(level: number) {
        await this.page.getByTestId(`arcanum-orb-${level}`).click();
    }

    async setConcentrationFromSuggestion(spellName: string) {
        const testId = `concentration-set-btn-${spellName.toLowerCase().replace(/\s+/g, '-')}`;
        const specificButton = this.page.getByTestId(testId);
        if (await specificButton.count()) {
            await specificButton.click();
            return;
        }

        const firstSuggestion = this.page.locator('[data-testid^="concentration-set-btn-"]').first();
        await firstSuggestion.click();
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

    async reduceHpToZero() {
        const current = await this.getCurrentHP();
        const totalClicks = Number.isFinite(current) ? current : 0;
        for (let i = 0; i < totalClicks; i++) {
            await this.page.getByTestId('hp-decrease-btn').click();
        }
    }

    async verifyHP(current: number, max: number, temp: number = 0) {
        await expect(this.page.getByTestId('hp-current')).toContainText(current.toString());
        await expect(this.page.getByTestId('hp-max')).toContainText(max.toString());
        const tempDisplay = this.page.getByTestId('hp-temp-display');
        if (temp > 0) {
            await expect(tempDisplay).toContainText(temp.toString());
        } else {
            await expect(tempDisplay).toHaveCount(0);
        }
    }
}
