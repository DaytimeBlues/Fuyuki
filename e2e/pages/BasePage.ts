import { Page, expect } from '@playwright/test';

export class BasePage {
    protected _page: Page;

    constructor(page: Page) {
        this._page = page;
    }

    // Public getter for page access
    get page(): Page {
        return this._page;
    }

    async goto() {
        await this.page.goto('./');
        await this.page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await this.page.reload();
    }

    async waitForAppReady() {
        await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => undefined);

        await this.page.waitForSelector('[data-testid="app-ready"]', { timeout: 15000 });

        const sessionPicker = this.page.getByTestId('session-picker');
        if (await sessionPicker.isVisible().catch(() => false)) {
            const startSessionBtn = this.page.getByTestId('start-session-btn');
            const newSessionBtn = this.page.getByTestId('new-session-btn');

            if (await newSessionBtn.isVisible().catch(() => false)) {
                await newSessionBtn.click();
            }

            if (await startSessionBtn.isVisible().catch(() => false)) {
                await startSessionBtn.click();
            }

            await sessionPicker.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => undefined);
        }

        await this.page.waitForSelector('[data-testid="nav-tab-stats"]', { timeout: 10000 });
    }


    async navigateTo(tab: 'stats' | 'spells' | 'combat' | 'character' | 'more' | 'inventory' | 'patron' | 'settings' | 'home') {
        const targetTab = (tab as string) === 'home' ? 'stats' : tab;
        if (targetTab === 'inventory' || targetTab === 'patron' || targetTab === 'settings') {
            await this.page.getByTestId('nav-tab-more').click({ force: true });
            await this.page.getByTestId(`more-menu-item-${targetTab}`).click({ force: true });
        } else {
            const tabBtn = this.page.getByTestId(`nav-tab-${targetTab}`);
            await tabBtn.click({ force: true });
        }
    }

    async verifyToast(message: string | RegExp) {
        await expect(this.page.getByTestId('toast-message')).toContainText(message);
    }

    async clearLocalStorage() {
        await this.page.evaluate(() => window.localStorage.clear());
        await this.page.reload();
    }
}
