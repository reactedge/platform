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
            'h1[data-subscription-title]'
        );

        await expect(title).toBeVisible();
        await expect(title).toHaveText('Subscribe & Save');
    });

    test('Subscription widget renders the configured button colour', async () => {
        const button = subscription.getByRole('button', { name: 'Subscribe' });

        const backgroundColour = await button.evaluate(
            (element: HTMLElement) =>
                getComputedStyle(element).backgroundColor
        );

        expect(backgroundColour).toBe('rgb(37, 168, 70)');
    });
});
