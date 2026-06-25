import { test, expect } from '@playwright/test';

test.describe('Megamenu widget (WordPress embed)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Megamenu widget mounts', async ({page}) => {
        const widget = page.locator('megamenu-widget');
        await expect(widget).toBeAttached();
    });

    test('Megamenu renders top-level items', async ({page}) => {
        await expect(page.getByText('Home')).toBeVisible();
        await expect(page.getByText('Women')).toBeVisible();
    });

    test('Megamenu renders CTA item', async ({page}) => {
        const cta = page.getByText('Gear');
        await expect(cta).toBeVisible();
    });

    test('Megamenu shows submenu on interaction', async ({page}) => {
        const menu = await page.locator('megamenu-widget')
        await menu.getByText('Women').click();
        await expect(menu.getByText('Bras & Tanks')).toBeVisible();
    });
});