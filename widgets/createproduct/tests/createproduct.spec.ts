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
            element => getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });

    test('Createproduct widget renders product data', async () => {
        const product = createproduct.locator(
            '[data-createproduct-product]'
        );

        await expect(product).toBeVisible();

        await expect(
            product.getByText('SKU', { exact: true })
        ).toBeVisible();

        await expect(
            product.getByText('Name', { exact: true })
        ).toBeVisible();
    });

    test('Createproduct widget loads product data from GraphQL', async () => {
        const product = createproduct.locator(
            '[data-createproduct-product]'
        );

        await expect(product).toBeVisible();

        const values = product.locator('dd');

        await expect(values).toHaveCount(2);
        await expect(values.nth(0)).toHaveText(/\S+/);
        await expect(values.nth(1)).toHaveText(/\S+/);
    });
});