import { expect, test } from "@playwright/test";

test.describe('Createlisting product capability', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('**/reactedge-runtime.json', route => route.fulfill({
            json: { integrations: {}, context: {} },
        }));
        await page.route('**/listingrecord/listings', route => route.fulfill({
            json: [{ id: '11111111-1111-4111-8111-111111111111', name: 'Existing listing' }],
        }));
    });

    test('opens the add product experiment against an existing listing', async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');

        const createlisting = page.locator('createlisting-widget');
        await expect(createlisting).toBeVisible();

        await createlisting.getByRole('button', { name: 'Add product' }).click();

        await expect(
            createlisting.getByRole('heading', { name: 'Add product' })
        ).toBeVisible();

        const listing = createlisting.getByLabel('Listing', { exact: true });
        await expect(listing).toBeVisible();
        await listing.selectOption('11111111-1111-4111-8111-111111111111');

        await expect(createlisting.getByText('Existing listing', { exact: true })).toBeVisible();
        await expect(createlisting.getByRole('heading', { name: 'Product details' })).toBeVisible();

        await expect(
            createlisting.getByRole('button', { name: 'Save product' })
        ).toBeDisabled();
    });
});
