import { test, expect } from '@playwright/test';

test.describe('RegionMap Widget', () => {
    let widget;

    test.beforeEach(async ({ page }) => {
        await page.goto('/fixtures/regionmap.html');
        widget = page.locator('regionmap-widget');
    });

    test('mounts successfully', async () => {
        await expect(widget).toBeVisible();
    });

    test('renders map container', async () => {
        const container = widget.locator('.re-regionmap');
        await expect(container).toBeVisible();
    });

    test('renders the region map title', async ({ page }) => {
        const title = page.locator('[data-regionmap-title]');
        await expect(title).toBeVisible();
    });
});
