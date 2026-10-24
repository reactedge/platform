import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Sizeguide Widget', () => {
    let sizeguide: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        sizeguide = page.locator('sizeguide-widget');
        await expect(sizeguide).toBeVisible();
    });

    test('Sizeguide widget renders its configured title', async () => {
        await sizeguide.locator('[data-sizeguide-open]').click();
        const title = sizeguide.locator(
            '[data-sizeguide-title]'
        );

        await expect(title).toBeVisible();
    });

    test('Sizeguide widget renders the title colour', async () => {
        await sizeguide.locator('[data-sizeguide-open]').click();
        const title = sizeguide.locator(
            '[data-sizeguide-title]'
        );

        const colour = await title.evaluate(
            (element: HTMLElement) =>
                getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });

    test('Size guide opens in a modal and closes from its close button', async () => {
        const dialog = sizeguide.locator('[data-sizeguide-dialog]');
        await expect(sizeguide.locator('[data-sizeguide-open]')).toBeVisible();
        await expect(dialog).not.toBeVisible();

        await sizeguide.locator('[data-sizeguide-open]').click();
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute('open', '');
        await expect(dialog.locator('[data-sizeguide-title]')).toBeVisible();

        await dialog.locator('[data-sizeguide-close]').click();
        await expect(dialog).not.toBeVisible();
    });
});