import {expect, test} from '@playwright/test';

test('create listing uses seller identity from runtime context', async ({page}) => {
    let saved: unknown;

    await page.route('**/reactedge-runtime.json', route => route.fulfill({
        json: {
            integrations: {},
            context: {sellerId: 'seller-123'},
        },
    }));
    await page.route('**/listingrecord/listings', async route => {
        if (route.request().method() === 'GET') return route.fulfill({json: []});

        saved = route.request().postDataJSON();
        return route.fulfill({
            status: 201,
            json: {
                id: '11111111-1111-4111-8111-111111111111',
                ...(saved as object),
            },
        });
    });
    await page.route('**/listingrecord/products', route => route.fulfill({json: []}));

    await page.goto('/?reactedge_debug=eager');
    const widget = page.locator('createlisting-widget');

    await widget.getByRole('button', {name: 'Create listing'}).click();
    await widget.getByLabel('Listing name').fill('Gallery');
    await widget.getByRole('button', {name: 'Save listing'}).click();

    expect(saved).toEqual({
        name: 'Gallery',
        status: 'active',
        sellerId: 'seller-123',
    });
});

test('create listing fails before persistence when no seller identity is available', async ({page}) => {
    let posted = false;

    await page.route('**/reactedge-runtime.json', route => route.fulfill({
        json: {integrations: {}, context: {}},
    }));
    await page.route('**/listingrecord/listings', async route => {
        if (route.request().method() === 'GET') return route.fulfill({json: []});
        posted = true;
        return route.fulfill({status: 500, json: {error: 'unexpected'}});
    });
    await page.route('**/listingrecord/products', route => route.fulfill({json: []}));

    await page.goto('/?reactedge_debug=eager');
    const widget = page.locator('createlisting-widget');

    await widget.getByRole('button', {name: 'Create listing'}).click();
    await widget.getByLabel('Listing name').fill('Gallery');
    await widget.getByRole('button', {name: 'Save listing'}).click();

    await expect(widget.getByRole('alert')).toContainText('No authenticated seller is available');
    expect(posted).toBe(false);
});
