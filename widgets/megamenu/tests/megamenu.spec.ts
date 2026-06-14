import { test, expect } from '@playwright/test';

test.describe('Megamenu widget (WordPress embed)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/fixtures/megamenu.wordpress.html');
    });

    test('Megamenu widget mounts', async ({page}) => {
        const widget = page.locator('megamenu-widget');
        await expect(widget).toBeAttached();
    });

    test('Megamenu renders top-level items', async ({page}) => {
        await expect(page.getByText('Home')).toBeVisible();
        await expect(page.getByText('Services')).toBeVisible();
    });

    test('Megamenu renders CTA item', async ({page}) => {
        const cta = page.getByText('Contact');
        await expect(cta).toBeVisible();
    });

    test('Megamenu shows submenu on interaction', async ({page}) => {
        await page.getByText('Services').click();
        await expect(page.getByText('Web Design')).toBeVisible();
    });
});