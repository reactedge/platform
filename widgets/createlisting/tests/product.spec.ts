import { expect, test } from "@playwright/test";

const listingId = '11111111-1111-4111-8111-111111111111';
const productId = '22222222-2222-4222-8222-222222222222';

const product = {
    id: productId,
    listingId,
    sku: 'ART-001',
    title: 'Blue study',
    description: 'Oil on canvas',
    price: 450,
    image: 'https://example.com/blue-study.jpg',
};

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
            if (route.request().method() === 'GET') return route.fulfill({ json: [] });
            saved = route.request().postDataJSON();
            return route.fulfill({ status: 201, json: { id: productId, ...(saved as object) } });
        });

        await page.goto('/?reactedge_debug=eager');
        const widget = page.locator('createlisting-widget');

        await widget.getByRole('button', { name: 'Add product' }).click();
        await widget.getByLabel('Listing', { exact: true }).selectOption(listingId);
        await widget.getByLabel('SKU', { exact: true }).fill(product.sku);
        await widget.getByLabel('Title', { exact: true }).fill(product.title);
        await widget.getByLabel('Description', { exact: true }).fill(product.description);
        await widget.getByLabel('Price', { exact: true }).fill(String(product.price));
        await widget.getByLabel('Image', { exact: true }).fill(product.image);
        await widget.getByRole('button', { name: 'Save product' }).click();

        await expect(widget.getByRole('status')).toContainText('Product “Blue study” saved.');
        expect(saved).toEqual({
            listingId,
            sku: product.sku,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
        });
    });

    test('edits an existing product', async ({ page }) => {
        let updated: unknown;
        await page.route('**/listingrecord/products**', async route => {
            if (route.request().method() === 'GET') return route.fulfill({ json: [product] });
            updated = route.request().postDataJSON();
            return route.fulfill({ json: { ...product, ...(updated as object) } });
        });

        await page.goto('/?reactedge_debug=eager');
        const widget = page.locator('createlisting-widget');

        await widget.getByRole('button', { name: 'Edit product' }).click();
        await widget.getByLabel('Listing', { exact: true }).selectOption(listingId);
        await widget.getByLabel('Product', { exact: true }).selectOption(productId);
        await widget.getByLabel('Title', { exact: true }).fill('Red study');
        await widget.getByRole('button', { name: 'Save product' }).click();

        await expect(widget.getByRole('status')).toContainText('Product “Red study” saved.');
        expect(updated).toMatchObject({ listingId, title: 'Red study' });
    });

    test('deletes an existing product', async ({ page }) => {
        let deleted = false;
        await page.route('**/listingrecord/products**', async route => {
            if (route.request().method() === 'GET') return route.fulfill({ json: [product] });
            deleted = route.request().method() === 'DELETE';
            return route.fulfill({ status: 204, body: '' });
        });

        await page.goto('/?reactedge_debug=eager');
        const widget = page.locator('createlisting-widget');

        await widget.getByRole('button', { name: 'Delete product' }).click();
        await widget.getByLabel('Listing', { exact: true }).selectOption(listingId);
        await widget.getByLabel('Product', { exact: true }).selectOption(productId);
        await widget.getByRole('button', { name: 'Confirm delete' }).click();

        await expect(widget.getByRole('status')).toContainText('Product “Blue study” deleted.');
        expect(deleted).toBe(true);
    });
});
