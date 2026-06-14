import { test, expect } from '@playwright/test';
import {IntentWidgetDriver} from "../drivers/intent-widget.driver";

test.describe('Intent Discovery Widget', () => {

    let widget;

    test.beforeEach(async ({ page }) => {
        widget = new IntentWidgetDriver(page);
        await page.goto('/tops-men.html');
        await expect(widget.root).toBeVisible();
    });

    test('Title is visible', async ({ page }) => {
        const title = page.getByRole('heading', {
            name: 'May I ask why you came here to shop?'
        });

        await expect(title).toBeVisible();
    });

    test('Step finder cards are partially rendered', async ({ page }) => {

        const subtitle = page.locator('label.intent-subtitle', {
            hasText: "Describe what you're looking for"
        });
        await expect(subtitle).toBeVisible();
        const cards = page.locator('[data-intent-card]');
        await expect(cards).toHaveCount(3);
    });

    test('Step finder cards toggle works', async ({ page }) => {
        const toggle = page.locator('.choice-tile--view-all');
        await expect(toggle).toHaveText('View all');
        await toggle.click();
        await expect(toggle).toHaveText('Show less');
        const options = page.locator('[data-intent-option]');
        await expect(options).not.toBeVisible();
    });

    test('Step finder cards are all shown when view all is clicked', async ({ page }) => {

        const toggle = page.locator('.choice-tile--view-all');
        await toggle.click();
        const cards = page.locator('[data-intent-card]');
        await expect(cards).toHaveCount(6);
    });

    test('Clicking a card reveals its options', async ({ page }) => {
        const weatherCard = widget.card("climate")
        const coldOption =  widget.option("Cold")

        // option should not be visible initially
        await expect(coldOption).toBeHidden();
        await weatherCard.click();

        // option should now appear
        await expect(coldOption).toBeVisible();

    });

    test('Selecting an option activates option and card', async ({ page }) => {
        const weatherCard = widget.card("climate")
        const coldOption =  widget.option("Cold")
        await weatherCard.click();

        await widget.expectOptionNotSelected(coldOption)
        await coldOption.click();

        await weatherCard.click();
        await widget.expectCardActive(weatherCard)
        await widget.expectOptionSelected(coldOption)
    });

    test('AI evaluation is Ready when Product Matches count is low', async ({ page }) => {

        await widget.expectWarningVisible();
        await widget.expectNotReady();

        const weatherCard = widget.card("climate")
        const coldOption =  widget.option("Spring")
        await weatherCard.click();
        await coldOption.click();

        await expect(widget.warningBanner().getByText('Ready to suggest')).toBeVisible();

        await widget.expectReady();
        await widget.clickSuggest();

        const loader = widget.loader();
        await expect(loader).toBeVisible();

        await page.waitForTimeout(3000);

        await widget.expectSuccess();
        await widget.expectRecommendationsVisible();
    });

    test('AI Readiness changes when intent is interpreted', async ({ page }) => {

        await widget.expectWarningVisible();
        await widget.expectNotReady();
        await widget.fillIntent('blue running jacket');

        const readinessContainer = widget.readinessHint()
        await expect(readinessContainer).toContainText('Add 11+ characters or refine your preferences');

        await widget.fillIntent('blue running jacket in cold weather');
        await expect(readinessContainer).toContainText('AI ready to interpret your request');
        await widget.expectReady();

        // become not ready if intent text length is too small again
        await widget.fillIntent('blue running jacket');
        await expect(readinessContainer).toContainText('Add 11+ characters or refine your preferences');

        await widget.expectNotReady();
    });

    test('Intent produces recommendations', async ({ page }) => {

        await widget.fillIntent('blue top for cold weather running');
        await widget.expectReady();

        await widget.clickSuggest();

        await widget.expectSuccess();
        await widget.expectRecommendationsVisible();
    });

    test('Reload restores recommendations', async ({ page }) => {

        await widget.fillIntent('blue top for cold weather running');
        await widget.expectReady();

        await widget.clickSuggest();
        await widget.expectSuccess();

        await widget.reload();

        await widget.expectSuccess();
        await widget.expectRecommendationsVisible();
    });

    test('Invalid event payload does not break system', async ({ page }) => {
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('reactedge:filter', {
                detail: null
            }));
        });

        await widget.expectSafeInitialState();
    });

    test('Widget mounts but does not render when category is not enabled', async ({ page }) => {
        await page.goto('/category-not-enabled.html');

        const widget = page.locator('intentdiscovery-widget');
        await expect(widget).toHaveCount(1);

        const shadowContent = await page.evaluate(() => {
            const el = document.querySelector('intentdiscovery-widget');
            if (!el || !el.shadowRoot) return null;

            return {
                childCount: el.shadowRoot.children.length,
                hasContainer: !!el.shadowRoot.querySelector('.intent-widget-container'),
                styleCount: el.shadowRoot.querySelectorAll('style').length
            };
        });

        expect(shadowContent).not.toBeNull();
        expect(shadowContent.childCount).toBeLessThanOrEqual(1); // allow minimal runtime node
        expect(shadowContent.styleCount).toBe(0);
    });
});