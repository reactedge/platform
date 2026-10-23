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
            element => getComputedStyle(element).backgroundColor
        );

        expect(backgroundColour).toBe('rgb(37, 168, 70)');
    });

    test('Subscription widget renders contract-provided plans', async () => {
        await expect(subscription.getByText('One-time purchase')).toBeVisible();
        await expect(subscription.getByText('Subscribe & Save up to 10% Off')).toBeVisible();
        await expect(subscription.getByText('Subscription Options')).toBeVisible();
        await expect(subscription.getByText('Weekly - 10% Off')).toBeVisible();
        await expect(subscription.getByText('Monthly - 5% Off')).toBeVisible();
        await expect(subscription.getByRole('button', { name: 'Subscribe' })).toBeVisible();
    });

});
