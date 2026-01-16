import { Page, expect } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    async goto() {
        await this.page.goto('/');
    }

    async waitForAppReady() {
        // Wait for network idle to ensure hydration
        try {
            await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        } catch (e) {
            console.warn('Network idle timed out, proceeding anyway');
        }

        // Wait for either the session picker or the main app shell
        const sessionPicker = this.page.getByText('Start Session');
        const homeTab = this.page.getByTestId('nav-tab-home');

        // Race to see which one appears first (or wait for the picker if it's there)
        try {
            await Promise.race([
                sessionPicker.waitFor({ state: 'visible', timeout: 10000 }),
                homeTab.waitFor({ state: 'visible', timeout: 10000 })
            ]);
        } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
            // If neither appears within 10s, something is wrong, but let's proceed
        }

        if (await sessionPicker.isVisible()) {
            await sessionPicker.click();
            // Wait for overlay to disappear
            await expect(sessionPicker).not.toBeVisible({ timeout: 10000 });
        }

        // Now ensure the app shell is visible
        await expect(homeTab).toBeVisible({ timeout: 20000 });
    }

    async navigateTo(tab: 'home' | 'spells' | 'combat' | 'grimoire' | 'abilities' | 'inventory' | 'bio' | 'settings') {
        const tabBtn = this.page.getByTestId(`nav-tab-${tab}`);
        await tabBtn.click({ force: true });
        // Wait for the tab to be active
        await expect(tabBtn).toHaveClass(/text-white/, { timeout: 10000 });
    }

    async verifyToast(message: string | RegExp) {
        await expect(this.page.getByTestId('toast-message')).toContainText(message);
    }

    async clearLocalStorage() {
        await this.page.evaluate(() => window.localStorage.clear());
        await this.page.reload();
    }
}
