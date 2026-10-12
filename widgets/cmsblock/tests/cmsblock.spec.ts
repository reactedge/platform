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
            element => getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });

    test('Cmsblock widget renders product data', async () => {
        const product = cmsblock.locator(
            '[data-cmsblock-product]'
        );

        await expect(product).toBeVisible();

        await expect(
            product.getByText('SKU', { exact: true })
        ).toBeVisible();

        await expect(
            product.getByText('Name', { exact: true })
        ).toBeVisible();
    });

    test('Cmsblock widget loads product data from GraphQL', async () => {
        const product = cmsblock.locator(
            '[data-cmsblock-product]'
        );

        await expect(product).toBeVisible();

        const values = product.locator('dd');

        await expect(values).toHaveCount(2);
        await expect(values.nth(0)).toHaveText(/\S+/);
        await expect(values.nth(1)).toHaveText(/\S+/);
    });
});