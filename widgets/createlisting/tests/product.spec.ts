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
    image: 'https://res.cloudinary.com/reactedge-demo/image/upload/example.jpg',
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

    test('uploads one image to Cloudinary before saving a product', async ({ page }) => {
        let saved: unknown;
        let cloudinaryUpload = '';

        await page.route('**/listingrecord/product-images/signature', route => route.fulfill({
            json: {
                cloudName: 'reactedge-demo',
                apiKey: 'public-key',
                timestamp: 1700000000,
                folder: 'reactedge/products',
                signature: 'signed-value',
            },
        }));

        await page.route('https://api.cloudinary.com/v1_1/reactedge-demo/image/upload', async route => {
            cloudinaryUpload = route.request().postData() ?? '';
            await route.fulfill({
                status: 200,
                json: {
                    secure_url: product.image,
                    public_id: 'reactedge/products/example',
                },
            });
        });

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

        await widget.getByLabel('Image', { exact: true }).setInputFiles({
            name: 'artwork.png',
            mimeType: 'image/png',
            buffer: Buffer.from('image-bytes'),
        });

        await expect(widget.getByAltText('Product preview')).toHaveAttribute('src', product.image);
        expect(cloudinaryUpload).toContain('public-key');
        expect(cloudinaryUpload).toContain('signed-value');
        expect(cloudinaryUpload).toContain('reactedge/products');

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

    test('edits an existing product without using the Cloudinary experiment', async ({ page }) => {
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
        await expect(widget.getByLabel('Image', { exact: true })).toHaveAttribute('type', 'url');
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
