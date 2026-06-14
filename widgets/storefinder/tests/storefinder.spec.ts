import { test, expect } from '@playwright/test';

test.describe('StoreFinder Widget', () => {
    let widget;

    test.beforeEach(async ({ page }) => {
        //await page.goto('/fixtures/storefinder.html');
        await page.goto('/');
        widget = page.locator('storefinder-widget');
    });

    test('mounts successfully', async () => {
        await expect(widget).toBeVisible();
    });

    test('mounts successfully with valid config', async ({ page }) => {
        const stores = await widget.locator('[data-store-card]').count();
        await expect(stores).toBeGreaterThan(0);
    });
});
