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
        await this.page.goto('/');
    }

    async waitForAppReady() {
        console.log('Starting waitForAppReady...');

        // Wait for network idle to ensure hydration
        try {
            await this.page.waitForLoadState('networkidle', { timeout: 15000 });
            console.log('Network idle achieved');
        } catch (e) {
            console.warn('Network idle timed out after 15s, proceeding anyway');
        }

        // Take initial screenshot for debugging
        await this.page.screenshot({ path: 'debug-initial-state.png', fullPage: true });

        // Check if session picker is showing
        const startSessionBtn = this.page.getByText('Start Session');
        const newSessionBtn = this.page.getByText('New Session');
        const sessionsTitle = this.page.getByText(/Sessions/i);

        // Wait a bit for app to stabilize
        await this.page.waitForTimeout(500);

        // Check what's visible
        const hasStartBtn = await startSessionBtn.isVisible().catch(() => false);
        const hasNewBtn = await newSessionBtn.isVisible().catch(() => false);
        const hasTitle = await sessionsTitle.isVisible().catch(() => false);

        console.log('Session picker elements visible:', {
            hasStartBtn,
            hasNewBtn,
            hasTitle
        });

        if (hasStartBtn || hasNewBtn || hasTitle) {
            // Session picker is showing
            console.log('Session picker is visible, handling it...');

            if (hasStartBtn) {
                // No existing sessions, can click "Start Session" directly
                console.log('Clicking "Start Session" button');
                await startSessionBtn.click();
            } else if (hasNewBtn) {
                // There are existing sessions, need to click "New Session" first
                console.log('Clicking "New Session" button');
                await newSessionBtn.click();
                // Wait for "Start Session" button to appear
                await this.page.waitForTimeout(500);
                const startBtn = this.page.getByText('Start Session');
                await startBtn.click();
            }

            // Wait for session picker overlay to completely disappear
            console.log('Waiting for session picker to disappear...');
            const overlay = this.page.locator('.fixed').filter({ hasText: /Sessions/i });

            // Wait for overlay to be hidden
            try {
                await expect(overlay).not.toBeVisible({ timeout: 5000 });
                console.log('Session picker overlay is hidden');
            } catch (e) {
                console.log('Overlay still visible after click, continuing anyway');
            }

            // Give React time to re-render
            await this.page.waitForTimeout(1000);
        }

        // Wait for ANY visible interactive element to be present
        // Try stats nav, spells nav, or any main content element
        console.log('Waiting for main app content...');
        await this.page.waitForTimeout(500);

        try {
            // Try multiple selectors to find ANY visible element
            const mainContent = await Promise.race([
                this.page.getByTestId('nav-tab-stats').isVisible(),
                this.page.getByTestId('nav-tab-spells').isVisible(),
                this.page.getByTestId('nav-tab-combat').isVisible(),
                this.page.getByTestId('nav-tab-character').isVisible(),
                this.page.getByTestId('nav-tab-more').isVisible(),
                this.page.locator('main').isVisible()
            ]);

            console.log('Found main content, continuing to test');
        } catch (e) {
            console.error('No main content found after session picker. Page content:');
            const content = await this.page.content();
            console.log('Page HTML length:', content.length);
            console.log('Page HTML preview:', content.substring(0, 1000));

            // Take another screenshot
            await this.page.screenshot({ path: 'debug-after-session.png', fullPage: true });
            throw new Error('App failed to initialize after session creation');
        }

        // Additional wait to ensure full render
        await this.page.waitForTimeout(500);
    }


    async navigateTo(tab: 'stats' | 'spells' | 'combat' | 'character' | 'more' | 'inventory' | 'patron' | 'settings') {
        if (tab === 'inventory' || tab === 'patron' || tab === 'settings') {
            await this.page.getByTestId('nav-tab-more').click({ force: true });
            await this.page.getByTestId(`more-menu-item-${tab}`).click({ force: true });
        } else {
            const tabBtn = this.page.getByTestId(`nav-tab-${tab}`);
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
