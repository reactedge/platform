import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Createlisting Widget', () => {
    let createlisting: Locator;

    test.beforeEach(async ({ page }) => {
        await page.route('**/reactedge-runtime.json', route => route.fulfill({
            json: { integrations: {}, context: {} },
        }));
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
            element => getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });

    test('listing widget does not render the scaffold product example', async () => {
        await expect(createlisting.locator('[data-createlisting-product]')).toHaveCount(0);
        await expect(createlisting.getByRole('button', { name: 'Create listing', exact: true })).toBeVisible();
        await createlisting.getByRole('button', { name: 'Edit listing', exact: true }).click();
        await expect(createlisting.getByLabel('Select listing to edit')).toBeVisible();
    });
});
