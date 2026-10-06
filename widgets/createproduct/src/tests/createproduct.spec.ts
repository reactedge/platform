import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Createproduct Widget', () => {
    let createproduct: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        createproduct = page.locator('createproduct-widget');
        await expect(createproduct).toBeVisible();
    });

    test('Createproduct widget renders its configured title', async () => {
        const title = createproduct.locator(
            '[data-createproduct-title]'
        );

        await expect(title).toBeVisible();
    });

    test('Createproduct widget renders the title colour', async () => {
        const title = createproduct.locator(
            '[data-createproduct-title]'
        );

        const colour = await title.evaluate(
            (element: HTMLElement) =>
                getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });
});