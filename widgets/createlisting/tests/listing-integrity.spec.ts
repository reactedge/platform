import { expect, test } from "@playwright/test";

const listingId = '11111111-1111-4111-8111-111111111111';
const productId = '22222222-2222-4222-8222-222222222222';

test('listing delete is disabled when products are assigned', async ({ page }) => {
    await page.route('**/reactedge-runtime.json', route => route.fulfill({
        json: { integrations: {}, context: {} },
    }));
    await page.route('**/listingrecord/listings**', route => route.fulfill({
        json: [{ id: listingId, name: 'Original listing' }],
    }));
    await page.route('**/listingrecord/products**', route => route.fulfill({
        json: [{
            id: productId,
            listingId,
            sku: 'ART-001',
            title: 'Blue study',
            description: 'Oil on canvas',
            price: 3.7,
            images: [],
        }],
    }));

    await page.goto('/?reactedge_debug=eager');
    const widget = page.locator('createlisting-widget');

    await widget.getByRole('button', { name: 'Delete listing', exact: true }).click();
    await widget.getByLabel('Select listing to delete').selectOption(listingId);

    await expect(widget.getByText(/contains 1 product/)).toBeVisible();
    await expect(widget.getByRole('button', { name: 'Confirm delete' })).toBeDisabled();
});
