import { expect, test } from "@playwright/test";

test.describe('Createlisting product capability', () => {
    test('opens the add product experiment against an existing listing', async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');

        const createlisting = page.locator('createlisting-widget');
        await expect(createlisting).toBeVisible();

        await createlisting.getByRole('button', { name: 'Add product' }).click();

        await expect(
            createlisting.getByRole('heading', { name: 'Add product' })
        ).toBeVisible();

        await expect(
            createlisting.getByLabel('Listing', { exact: true })
        ).toBeVisible();

        await expect(
            createlisting.getByRole('button', { name: 'Save product' })
        ).toBeDisabled();
    });
});
