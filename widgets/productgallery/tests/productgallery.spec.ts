import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";
import { WIDGET_ID } from "../src/Config";

test.describe('Product Gallery Widget', () => {
    let widget: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        widget = page.locator(`${WIDGET_ID}-widget`);
        await expect(widget).toBeVisible();
    });

    test('mounts the custom element', async () => {
        await expect(widget).toBeVisible();
    });

    test('renders tiled images in tiled view', async () => {
        const tiledView = widget.locator('[data-gallery-tiled]');
        await expect(tiledView).toBeVisible();

        // In tiled mode, classic elements should not exist
        await expect(widget.locator('[data-gallery-main]')).toHaveCount(0);
        await expect(widget.locator('[data-gallery-thumb]')).toHaveCount(0);

        // And tiled tiles should exist (add a dedicated selector if you can)
        const tiles = widget.locator('[data-gallery-tile]');
        await expect(tiles).toHaveCount(3);
    });

    test('next and prev arrows update the image in zoom mode', async () => {
        const tiles = widget.locator('[data-gallery-tile]');
        await expect(tiles).toHaveCount(3);

        // Enter zoom mode
        await tiles.first().click();

        const zoomView = widget.locator('[data-gallery-zoom]');
        const mainImage = widget.locator('[data-gallery-main]');
        const nextButton = widget.locator('[data-gallery-next]');
        const prevButton = widget.locator('[data-gallery-prev]');

        await expect(zoomView).toBeVisible();
        await expect(mainImage).toBeVisible();
        await expect(nextButton).toBeVisible();
        await expect(prevButton).toBeVisible();
        await expect(zoomView.locator('[data-imagezoom-zoom-in]')).toBeVisible();

        const initialSrc = await mainImage.getAttribute('src');

        if (initialSrc === null) {
            throw new Error("Expected zoom image to have a src attribute");
        }

        await zoomView.locator('[data-imagezoom-zoom-in]').click();
        await expect(zoomView.locator('[data-imagezoom-scale]')).toHaveText('150%');

        await nextButton.click();
        await expect(mainImage).not.toHaveAttribute('src', initialSrc);
        await expect(zoomView.locator('[data-imagezoom-scale]')).toHaveText('100%');

        await prevButton.click();
        await expect(mainImage).toHaveAttribute('src', initialSrc);
    });

    test('clicking a tile enters zoom mode', async () => {
        const tiles = widget.locator('[data-gallery-tile]');
        await expect(tiles).toHaveCount(3);

        const firstTile = tiles.first();
        const tileSrc = await firstTile.getAttribute('src');

        expect(tileSrc).not.toBeNull();

        if (tileSrc === null) {
            throw new Error("Expected gallery tile to have a src attribute");
        }

        await firstTile.click();

        const zoomView = widget.locator('[data-gallery-zoom]');
        await expect(zoomView).toBeVisible();

        const mainImage = widget.locator('[data-gallery-main]');
        await expect(mainImage).toHaveAttribute('src', tileSrc);

        // Tiled view should be gone
        await expect(widget.locator('[data-gallery-tile]')).toHaveCount(0);
    });

    test('minify exits zoom mode and returns to tiled', async () => {
        const tiles = widget.locator('[data-gallery-tile]');
        await tiles.first().click();

        const minify = widget.locator('[data-gallery-minify]');
        await expect(minify).toBeVisible();

        await minify.click();

        await expect(widget.locator('[data-gallery-tiled]')).toBeVisible();
        await expect(widget.locator('[data-gallery-zoom]')).toHaveCount(0);
    });

    test('adds selected attribute image to the gallery', async ({ page }) => {
        const tiles = widget.locator('[data-gallery-tile]');

        await expect(tiles).toHaveCount(3);

        await page.evaluate(() => {
            window.ReactEdgeSignals.emit({
                type: 'product_attribute_changed',
                code: 'color',
                value: '57'
            });
        });

        await expect(tiles).toHaveCount(4);

        await expect(
            tiles.last()
        ).toHaveAttribute('src', /purple/);
    });

    test('does not duplicate an existing image after attribute selection', async ({ page }) => {
        const tiles = widget.locator('[data-gallery-tile]');

        await expect(tiles).toHaveCount(3);

        const initialSources = await tiles.evaluateAll(images =>
            images.map(image => image.getAttribute('src'))
        );

        await page.evaluate(() => {
            window.ReactEdgeSignals.emit({
                type: 'product_attribute_changed',
                code: 'color',
                value: 'EXISTING_VALUE'
            });
        });

        await expect(tiles).toHaveCount(3);

        const sources = await tiles.evaluateAll(images =>
            images.map(image => image.getAttribute('src'))
        );

        expect(sources).toEqual(initialSources);
    });
});


test.describe('Product Gallery - Magento failures', () => {

    test('does not break when Magento returns no products', async ({ page }) => {
        await page.route('**/graphql', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        products: {
                            items: []
                        }
                    }
                })
            });
        });

        await page.goto('/?reactedge_debug=eager');

        const widget = page.locator(`${WIDGET_ID}-widget`);

        await expect(widget).toBeAttached();

        await expect(
            widget.locator('[data-gallery-tiled]')
        ).toHaveCount(0);
    });
});