import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('CategoryFeatured Widget', () => {
    let categoryfeatured: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        categoryfeatured = page.locator('categoryfeatured-widget');
        await expect(categoryfeatured).toBeVisible();
    });

    test('CategoryFeatured widget renders its configured title', async () => {
        const title = categoryfeatured.locator(
            '[data-categoryfeatured-title]'
        );

        await expect(title).toHaveText("Featured categories");
        await expect(categoryfeatured.locator(".categoryfeatured__card")).toHaveCount(4);
    });

    test('CategoryFeatured widget renders the title colour', async () => {
        const title = categoryfeatured.locator(
            '[data-categoryfeatured-title]'
        );

        const colour = await title.evaluate(
            (element: HTMLElement) =>
                getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });

    test('shows carousel arrows only while the browser matches the mobile media query', async ({ page }) => {
        const previous = categoryfeatured.locator('[data-categoryfeatured-prev]');
        const next = categoryfeatured.locator('[data-categoryfeatured-next]');

        await page.setViewportSize({ width: 1280, height: 800 });
        await expect(next).toHaveCount(0);

        await page.setViewportSize({ width: 375, height: 667 });
        await expect(previous).toBeVisible();
        await expect(next).toBeVisible();

        await page.setViewportSize({ width: 1280, height: 800 });
        await expect(next).toHaveCount(0);
    });
});
