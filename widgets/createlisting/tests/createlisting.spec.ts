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
            element => getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });

    test('Createlisting widget renders product data', async () => {
        const product = createlisting.locator(
            '[data-createlisting-product]'
        );

        await expect(product).toBeVisible();

        await expect(
            product.getByText('SKU', { exact: true })
        ).toBeVisible();

        await expect(
            product.getByText('Name', { exact: true })
        ).toBeVisible();
    });

    test('Createlisting widget loads product data from GraphQL', async () => {
        const product = createlisting.locator(
            '[data-createlisting-product]'
        );

        await expect(product).toBeVisible();

        const values = product.locator('dd');

        await expect(values).toHaveCount(2);
        await expect(values.nth(0)).toHaveText(/\S+/);
        await expect(values.nth(1)).toHaveText(/\S+/);
    });
});
