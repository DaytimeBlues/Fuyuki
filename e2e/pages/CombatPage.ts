import { BasePage } from './BasePage';

export class CombatPage extends BasePage {
    async openMinionManager() {
        await this.page.getByTestId('manage-horde-btn').click();
    }

    async raiseMinion(type: 'skeleton' | 'zombie') {
        const testId = `add-minion-${type}-btn`;
        await this.page.getByTestId(testId).click();
    }

    async damageMinion(index: number = 0) {
        await this.page.getByTestId('minion-damage-btn').nth(index).click();
    }

    async healMinion(index: number = 0) {
        await this.page.getByTestId('minion-heal-btn').nth(index).click();
    }

    async removeMinion(index: number = 0) {
        await this.page.getByTestId('remove-minion-btn').nth(index).click();
    }

    async releaseAllMinions() {
        await this.page.getByTestId('all-minions-clear-btn').click();
    }

    async getMinionCard(index: number = 0) {
        return this.page.getByTestId('minion-card').nth(index);
    }

    async toggleSummonUndeadReference() {
        await this.page.getByTestId('summon-undead-toggle').click();
    }
}
