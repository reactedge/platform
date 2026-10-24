import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Imagezoom Widget', () => {
    let imagezoom: Locator;

    test.beforeEach(async ({ page }) => {
        await page.route('**/images.unsplash.com/**', route => route.fulfill({
            status: 200,
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="1200" height="900" fill="#176b5b"/></svg>',
        }));
        await page.goto('/?reactedge_debug=eager');
        imagezoom = page.locator('imagezoom-widget');
        await expect(imagezoom).toBeVisible();
    });

    test('opens a modal with the configured image and title', async () => {
        const opener = imagezoom.locator('[data-imagezoom-open]');
        const dialog = imagezoom.locator('[data-imagezoom-dialog]');

        await expect(opener).toBeVisible();
        await expect(dialog).not.toBeVisible();
        await opener.click();

        await expect(dialog).toBeVisible();
        await expect(dialog.locator('[data-imagezoom-title]')).toHaveText('Product image');
        await expect(dialog.locator('[data-imagezoom-image]'))
            .toHaveAttribute('alt', 'Red running shoe');
        await expect(dialog.locator('[data-imagezoom-image]'))
            .toHaveAttribute('src', /images\.unsplash\.com/);
    });

    test('zooms in, pans in each direction, and resets to the original view', async () => {
        const opener = imagezoom.locator('[data-imagezoom-open]');
        const dialog = imagezoom.locator('[data-imagezoom-dialog]');
        await opener.click();

        const scale = dialog.locator('[data-imagezoom-scale]');
        await dialog.locator('[data-imagezoom-zoom-in]').click();
        await expect(scale).toHaveText('150%');

        const panLeft = dialog.locator('[data-imagezoom-pan-left]');
        await expect(panLeft).toBeEnabled();
        await panLeft.click();
        await dialog.locator('[data-imagezoom-pan-up]').click();
        await dialog.locator('[data-imagezoom-pan-down]').click();
        await dialog.locator('[data-imagezoom-pan-right]').click();

        await dialog.locator('[data-imagezoom-reset]').click();
        await expect(scale).toHaveText('100%');
        await expect(panLeft).toBeDisabled();

        await dialog.locator('[data-imagezoom-close]').click();
        await expect(dialog).not.toBeVisible();
    });

    test('drags the zoomed image within the modal stage', async ({ page }) => {
        const opener = imagezoom.locator('[data-imagezoom-open]');
        const dialog = imagezoom.locator('[data-imagezoom-dialog]');
        await opener.click();

        const image = dialog.locator('[data-imagezoom-image]');
        await expect(image).toHaveClass(/is-loaded/);
        await dialog.locator('[data-imagezoom-zoom-in]').click();

        const stage = dialog.locator('[data-imagezoom-stage]');
        const bounds = await stage.boundingBox();
        if (!bounds) throw new Error('Image stage is not rendered');
        await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        await page.mouse.down();
        await page.mouse.move(bounds.x + bounds.width / 2 + 50, bounds.y + bounds.height / 2 + 30);
        await page.mouse.up();

        const transform = await image.evaluate(element => getComputedStyle(element).transform);
        const values = transform.match(/matrix\(([^)]+)\)/)?.[1]
            .split(', ')
            .map(Number);
        expect(values).toHaveLength(6);
        expect(values?.[0]).toBe(1.5);
        expect(values?.[4]).toBeGreaterThan(0);
        expect(values?.[4]).toBeLessThan(50);
        expect(values?.[5]).toBe(30);
    });

    test('closes with Escape and restores the original zoom on next open', async ({ page }) => {
        const opener = imagezoom.locator('[data-imagezoom-open]');
        const dialog = imagezoom.locator('[data-imagezoom-dialog]');
        await opener.click();
        await dialog.locator('[data-imagezoom-zoom-in]').click();
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();

        await opener.click();
        await expect(dialog.locator('[data-imagezoom-scale]')).toHaveText('100%');
    });
});