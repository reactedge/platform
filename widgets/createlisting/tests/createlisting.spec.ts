import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Createlisting Widget', () => {
    let createlisting: Locator;

    test.beforeEach(async ({ page }) => {
        await page.route('**/reactedge-runtime.json', route => route.fulfill({
            json: { integrations: {}, context: {} },
        }));
        await page.goto('/?reactedge_debug=eager');
        createlisting = page.locator('createlisting-widget');
        await expect(createlisting).toBeVisible();
    });

    test('Createlisting widget renders its configured title', async () => {
        const title = createlisting.locator(
            '[data-createlisting-title]'
        );

        await expect(title).toBeVisible();
    });

    test('Createlisting widget renders the title colour', async () => {
        const title = createlisting.locator(
            '[data-createlisting-title]'
        );

        const colour = await title.evaluate(
            element => getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });

    test('listing widget does not render the scaffold product example', async () => {
        await expect(createlisting.locator('[data-createlisting-product]')).toHaveCount(0);
        await expect(createlisting.getByRole('button', { name: 'Create listing', exact: true })).toBeVisible();
        await createlisting.getByRole('button', { name: 'Edit listing', exact: true }).click();
        await expect(createlisting.getByLabel('Select listing to edit')).toBeVisible();
    });
    test('failed edits retain the entered name and can be cancelled', async ({ page }) => {
        await page.route('**/reactedge-runtime.json', route => route.fulfill({
            json: {integrations: {}, context: {sellerId: 'seller-123'}},
        }));
        const record = { id: '11111111-1111-4111-8111-111111111111', name: 'Original listing' };
        await page.route('**/listingrecord/listings**', route => route.fulfill(
            route.request().method() === 'PUT'
                ? { status: 503, json: { error: 'Unavailable' } }
                : { json: [record] }
        ));
        await page.reload();
        await createlisting.getByRole('button', { name: 'Edit listing', exact: true }).click();
        await createlisting.getByLabel('Select listing to edit').selectOption(record.id);
        await createlisting.getByLabel('Listing name', { exact: true }).fill('Changed listing');
        await createlisting.getByRole('button', { name: 'Save listing', exact: true }).click();
        await expect(createlisting.getByRole('alert')).toContainText('Your entered name has been kept.');
        await expect(createlisting.getByLabel('Listing name', { exact: true })).toHaveValue('Changed listing');
        await createlisting.getByRole('button', { name: 'Cancel', exact: true }).click();
        await expect(createlisting.getByLabel('Listing name', { exact: true })).toHaveCount(0);
        await expect(createlisting.getByRole('region', { name: 'Saved listings' })).toContainText('Original listing');
    });

    test('failed deletions retain the selected record and allow retry', async ({ page }) => {
        const record = { id: '11111111-1111-4111-8111-111111111111', name: 'Original listing' };
        let failDelete = true;
        await page.route('**/listingrecord/listings**', route => route.fulfill(
            route.request().method() === 'DELETE'
                ? failDelete ? { status: 503, json: { error: 'Unavailable' } } : { status: 204, body: '' }
                : { json: [record] }
        ));
        await page.reload();
        await createlisting.getByRole('button', { name: 'Delete listing', exact: true }).click();
        await createlisting.getByLabel('Select listing to delete').selectOption(record.id);
        await createlisting.getByRole('button', { name: 'Confirm delete', exact: true }).click();
        await expect(createlisting.getByRole('alert')).toContainText('The listing service is unavailable.');
        await expect(createlisting.getByLabel('Select listing to delete')).toHaveValue(record.id);
        await expect(createlisting.getByRole('region', { name: 'Saved listings' })).toContainText('Original listing');
        failDelete = false;
        await createlisting.getByRole('button', { name: 'Confirm delete', exact: true }).click();
        await expect(createlisting.getByRole('status')).toContainText('deleted');
        await expect(createlisting.getByRole('region', { name: 'Saved listings' })).toHaveCount(0);
    });
});
