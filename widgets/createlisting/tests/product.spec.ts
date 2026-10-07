import { expect, test } from "@playwright/test";

const listingId = '11111111-1111-4111-8111-111111111111';

test.describe('Createlisting product capability', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('**/reactedge-runtime.json', route => route.fulfill({
            json: { integrations: {}, context: {} },
        }));
        await page.route('**/listingrecord/listings', route => route.fulfill({
            json: [{ id: listingId, name: 'Existing listing' }],
        }));
    });

    test('saves a product against an existing listing', async ({ page }) => {
        let saved: unknown;
        await page.route('**/listingrecord/products', async route => {
            saved = route.request().postDataJSON();
            await route.fulfill({
                status: 201,
                json: { id: '22222222-2222-4222-8222-222222222222', ...(saved as object) },
            });
        });

        await page.goto('/?reactedge_debug=eager');

        const widget = page.locator('createlisting-widget');
        await widget.getByRole('button', { name: 'Add product' }).click();
        await widget.getByLabel('Listing', { exact: true }).selectOption(listingId);

        await widget.getByLabel('SKU', { exact: true }).fill('ART-001');
        await widget.getByLabel('Title', { exact: true }).fill('Blue study');
        await widget.getByLabel('Description', { exact: true }).fill('Oil on canvas');
        await widget.getByLabel('Price', { exact: true }).fill('450');
        await widget.getByLabel('Image', { exact: true }).fill('https://example.com/blue-study.jpg');
        await widget.getByRole('button', { name: 'Save product' }).click();

        await expect(widget.getByRole('status')).toContainText('Product “Blue study” saved.');
        expect(saved).toEqual({
            listingId,
            sku: 'ART-001',
            title: 'Blue study',
            description: 'Oil on canvas',
            price: 450,
            image: 'https://example.com/blue-study.jpg',
        });
    });
});
