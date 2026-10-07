import { expect, test } from "@playwright/test";

const listingId = '11111111-1111-4111-8111-111111111111';
const productId = '22222222-2222-4222-8222-222222222222';

const images = [
    'https://res.cloudinary.com/reactedge-demo/image/upload/example-1.jpg',
    'https://res.cloudinary.com/reactedge-demo/image/upload/example-2.jpg',
];

const product = {
    id: productId,
    listingId,
    sku: 'ART-001',
    title: 'Blue study',
    description: 'Oil on canvas',
    price: 450,
    images,
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

    test('uploads several images selected from one file chooser before saving a product', async ({ page }) => {
        let saved: unknown;
        let uploadCount = 0;

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
            const index = uploadCount++;
            await route.fulfill({
                status: 200,
                json: {
                    secure_url: images[index],
                    public_id: `reactedge/products/example-${index + 1}`,
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

        await widget.getByLabel('Images', { exact: true }).setInputFiles([
            { name: 'artwork-1.png', mimeType: 'image/png', buffer: Buffer.from('image-one') },
            { name: 'artwork-2.png', mimeType: 'image/png', buffer: Buffer.from('image-two') },
        ]);

        await expect(widget.getByRole('region', { name: 'Uploaded product images' }).locator('img')).toHaveCount(2);
        expect(uploadCount).toBe(2);

        await widget.getByRole('button', { name: 'Save product' }).click();

        expect(saved).toEqual({
            listingId,
            sku: product.sku,
            title: product.title,
            description: product.description,
            price: product.price,
            images,
        });
    });

    test('appends uploaded images while editing an existing product', async ({ page }) => {
        const addedImage = 'https://res.cloudinary.com/reactedge-demo/image/upload/example-3.jpg';
        let updated: unknown;

        await page.route('**/listingrecord/product-images/signature', route => route.fulfill({
            json: {
                cloudName: 'reactedge-demo',
                apiKey: 'public-key',
                timestamp: 1700000000,
                folder: 'reactedge/products',
                signature: 'signed-value',
            },
        }));

        await page.route('https://api.cloudinary.com/v1_1/reactedge-demo/image/upload', route => route.fulfill({
            status: 200,
            json: {
                secure_url: addedImage,
                public_id: 'reactedge/products/example-3',
            },
        }));

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

        await expect(widget.getByRole('region', { name: 'Uploaded product images' }).locator('img')).toHaveCount(2);

        await widget.getByLabel('Images', { exact: true }).setInputFiles({
            name: 'artwork-3.png',
            mimeType: 'image/png',
            buffer: Buffer.from('image-three'),
        });

        await expect(widget.getByRole('region', { name: 'Uploaded product images' }).locator('img')).toHaveCount(3);
        await expect(widget.getByAltText('Product preview 3')).toHaveAttribute('src', addedImage);

        await widget.getByRole('button', { name: 'Save product' }).click();

        expect(updated).toMatchObject({
            listingId,
            images: [...images, addedImage],
        });
    });
});
