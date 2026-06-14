import { test, expect } from '@playwright/test';

test.describe('Minicart Widget', () => {
    let minicart;

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        //await page.goto('/fixtures/minicart.html');
        minicart = page.locator('minicart-widget');
        await expect(minicart).toBeVisible();
    });
});