import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Createlisting Widget', () => {
    let createlisting: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        createlisting = page.locator('createlisting-widget');
        await expect(createlisting).toBeVisible();
    });

    test('Createlisting widget renders its configured title', async () => {
        const title = createlisting.locator(
            '[data-createlisting-title]'
        );

        await expect(title).toBeVisible();
    });

    test('Createlisting widget renders the title colour', async () => {
        const title = createlisting.locator(
            '[data-createlisting-title]'
        );

        const colour = await title.evaluate(
            (element: HTMLElement) =>
                getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });
});