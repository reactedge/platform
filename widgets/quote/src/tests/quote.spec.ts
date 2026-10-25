import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Quote Widget', () => {
    let quote: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        quote = page.locator('quote-widget');
        await expect(quote).toBeVisible();
    });

    test('Quote widget renders its configured title', async () => {
        const title = quote.locator(
            '[data-quote-title]'
        );

        await expect(title).toBeVisible();
    });

    test('Quote widget renders the title colour', async () => {
        const title = quote.locator(
            '[data-quote-title]'
        );

        const colour = await title.evaluate(
            (element: HTMLElement) =>
                getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });
});