import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Cmsblock Widget', () => {
    let cmsblock: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        cmsblock = page.locator('cmsblock-widget');
        await expect(cmsblock).toBeVisible();
    });

    test('Cmsblock widget renders its configured title', async () => {
        const title = cmsblock.locator(
            '[data-cmsblock-title]'
        );

        await expect(title).toBeVisible();
    });

    test('Cmsblock widget renders the title colour', async () => {
        const title = cmsblock.locator(
            '[data-cmsblock-title]'
        );

        const colour = await title.evaluate(
            (element: HTMLElement) =>
                getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });
});