import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('Subscription Widget', () => {
    let subscription: Locator;

    test.beforeEach(async ({ page }) => {
        await page.route('https://magento.example/graphql', async (route) => {
            const request = route.request().postDataJSON();
            if (request.query.includes('AddSubscriptionToCart')) {
                await route.fulfill({
                    json: { data: { addSubscriptionToCart: { success: true, message: 'Added' } } },
                });
                return;
            }
            await route.fulfill({
                json: { data: { products: { items: [{ id: 42, sku: 'example-product', name: 'Example product' }] } } },
            });
        });
        await page.route('**/subscribe/plan/terms*', (route) =>
            route.fulfill({ body: '<p>Monthly subscription terms</p>', contentType: 'text/html' })
        );
        await page.goto('/?reactedge_debug=eager');
        subscription = page.locator('subscription-widget');
        await expect(subscription).toBeVisible();
    });

    test('Subscription widget renders its configured title', async () => {
        const title = subscription.locator(
            '[data-subscription-title]'
        );

        await expect(title).toBeVisible();
    });

    test('Subscription widget renders the title colour', async () => {
        const title = subscription.locator(
            '[data-subscription-title]'
        );

        const colour = await title.evaluate(
            element => getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });

    test('Subscription widget renders product data', async () => {
        const product = subscription.locator(
            '[data-subscription-product]'
        );

        await expect(product).toBeVisible();

        await expect(
            product.getByText('SKU', { exact: true })
        ).toBeVisible();

        await expect(
            product.getByText('Name', { exact: true })
        ).toBeVisible();
    });

    test('Subscription widget loads product data from GraphQL', async () => {
        const product = subscription.locator(
            '[data-subscription-product]'
        );

        await expect(product).toBeVisible();

        const values = product.locator('dd');

        await expect(values).toHaveCount(2);
        await expect(values.nth(0)).toHaveText(/\S+/);
        await expect(values.nth(1)).toHaveText(/\S+/);
    });

    test('Subscribe dispatches a storefront event with the selected plan', async ({ page }) => {
        await page.evaluate(() => {
            window.addEventListener('reactedge:subscription:submit', (event) => {
                event.preventDefault();
                document.body.dataset.subscriptionEvent = JSON.stringify(
                    (event as CustomEvent).detail
                );
            }, { once: true });
        });
        await subscription.getByLabel('Subscribe & Save').check();
        await subscription.getByRole('button', { name: 'Subscribe' }).click();
        await expect.poll(() => page.locator('body').getAttribute('data-subscription-event')).not.toBeNull();
        expect(JSON.parse((await page.locator('body').getAttribute('data-subscription-event')) ?? 'null')).toEqual({
            purchaseType: 'subscription',
            sku: 'example-product',
            storeCode: 'default',
            plan: {
                id: 'monthly',
                frequency: 'Every month',
                discount: 'Save 10%',
                termsBlockId: 'subscription-monthly-terms',
            },
        });
        await expect(subscription.getByRole('alert')).toHaveCount(0);
    });

    test('Terms link opens a modal with the fetched CMS content', async () => {
        await subscription.getByLabel('Subscribe & Save').check();
        await subscription.getByRole('button', { name: 'View terms' }).first().click();
        const dialog = subscription.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog.getByText('Monthly subscription terms')).toBeVisible();
    });
});
