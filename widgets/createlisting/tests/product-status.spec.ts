import {expect, test} from '@playwright/test';

const listingId = '11111111-1111-4111-8111-111111111111';

test('product status defaults to active and can be selected in the product form', async ({page}) => {
    await page.route('**/reactedge-runtime.json', route => route.fulfill({
        json: {integrations: {}, context: {}},
    }));
    await page.route('**/listingrecord/listings', route => route.fulfill({
        json: [{id: listingId, name: 'Gallery', status: 'active'}],
    }));
    await page.route('**/listingrecord/products', route => route.fulfill({
        json: [],
    }));

    await page.goto('/?reactedge_debug=eager');
    const widget = page.locator('createlisting-widget');

    await widget.getByRole('button', {name: 'Add product'}).click();
    await widget.getByLabel('Listing', {exact: true}).selectOption(listingId);

    const status = widget.getByLabel('Status', {exact: true});
    await expect(status).toHaveValue('active');
    await status.selectOption('disable');
    await expect(status).toHaveValue('disable');
});
