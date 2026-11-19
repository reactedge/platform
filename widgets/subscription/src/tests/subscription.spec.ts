import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Subscription Widget', () => {
    let subscription: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        subscription = page.locator('subscription-widget');
        await expect(subscription).toBeVisible();
    });

    test('Subscription widget renders its configured title', async () => {
        const title = subscription.locator(
            '[data-subscription-title]'
        );

        await expect(title).toBeVisible();
    });

    test('Subscription widget renders the title colour', async () => {
        const title = subscription.locator(
            '[data-subscription-title]'
        );

        const colour = await title.evaluate(
            (element: HTMLElement) =>
                getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });
});