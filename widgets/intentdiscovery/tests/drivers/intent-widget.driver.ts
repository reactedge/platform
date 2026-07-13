import { expect, Locator, Page } from '@playwright/test';

export class IntentWidgetDriver {
    readonly page: Page;
    readonly root: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator('intentdiscovery-widget');
    }

    // --- elements
    suggestionButton() {
        return this.page.getByRole('button', { name: /suggest/i });
    }

    input() {
        return this.page.getByRole('textbox');
    }

    recommendationCards() {
        return this.root.locator('[data-role="recommendation"]');
    }

    warningBanner() {
        return this.page.locator('[data-state="warning"]');
    }

    successBanner() {
        return this.page.locator('.intent-banner.success');
    }

    loader() {
        return this.root.getByRole('status', { name: 'Loading' });
    }

    readinessHint() {
        return this.root.locator('[data-readiness-hint]');
    }

    card(name: string) {
        return this.root.locator(`[data-intent-card="${name}"]`);
    }

    option(name: string) {
        return this.root.locator(`[data-intent-option="${name}"]`);
    }

    heading() {
        return this.root.getByRole('heading');
    }

    async expectOptionNotSelected(option: Locator) {
        await expect(option)
            .toHaveAttribute('data-intent-selected', 'false');
    }

    async expectOptionSelected(option: Locator) {
        await expect(option)
            .toHaveAttribute('data-intent-selected', 'true');
    }

    async expectCardInactive(card: Locator) {
        await expect(card)
            .toHaveAttribute('data-intent-active', 'false');
    }

    async expectCardActive(card: Locator) {
        await expect(card)
            .toHaveAttribute('data-intent-active', 'true');
    }

    // --- actions
    async fillIntent(text: string) {
        await this.input().fill(text);
    }

    async clickSuggest() {
        await this.suggestionButton().click();
    }

    async selectOption(card: string, option: string) {
        await this.card(card).click();
        await this.option(option).click();
    }

    async expectWarningVisible() {
        await expect(this.warningBanner()).toBeVisible();
    }

    async reload(params?: Record<string, string>) {
        await this.page.evaluate((params) => {
            const searchParams = new URLSearchParams(params || {});
            const url = `${window.location.pathname}?${searchParams.toString()}`;

            // simulate navigation without reload
            window.history.pushState({}, '', url);

            // simulate content lifecycle completion
            window.dispatchEvent(new CustomEvent('reactedge:content-updated'));
        }, params);
    }

    // --- assertions (high value)
    async expectReady() {
        await expect(this.suggestionButton()).toBeEnabled();
    }

    async expectNotReady() {
        await expect(this.suggestionButton()).toBeDisabled();
    }

    async expectRecommendationsVisible() {
        await expect(this.recommendationCards().first()).toBeVisible();
    }

    async expectSuccess() {
        await expect(this.successBanner()).toContainText('matching products found');
    }

    async expectLoaderVisible() {
        await expect(this.loader()).toBeVisible();
    }

    async expectNoRecommendations() {
        await expect(this.recommendationCards()).toHaveCount(0);
    }

    async expectSafeInitialState() {
        await this.expectNoRecommendations();
        await this.expectNotReady();
        await this.expectWarningVisible();

        const intentInput = this.page.getByRole('textbox');
        await expect(intentInput).toHaveValue('');
    }
}