import { expect, test } from '@playwright/test';

test('listing status defaults to active and is shown in the saved listing list', async ({page}) => {
    const listing = {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Gallery',
        status: 'active',
    };

    await page.route('**/reactedge-runtime.json', route => route.fulfill({
        json: {integrations: {}, context: {}},
    }));
    await page.route('**/listingrecord/listings', async route => {
        if (route.request().method() === 'GET') return route.fulfill({json: [listing]});
        return route.fulfill({status: 201, json: listing});
    });
    await page.route('**/listingrecord/products', route => route.fulfill({json: []}));

    await page.goto('/?reactedge_debug=eager');
    const widget = page.locator('createlisting-widget');

    await expect(widget.getByRole('region', {name: 'Saved listings'})).toContainText('Active');

    await widget.getByRole('button', {name: 'Create listing'}).click();
    await expect(widget.getByLabel('Status')).toHaveValue('active');
});
