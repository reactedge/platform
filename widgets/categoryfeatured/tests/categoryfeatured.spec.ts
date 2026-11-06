import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe('CategoryFeatured Widget', () => {
    let categoryfeatured: Locator;

    test.beforeEach(async ({ page }) => {
        await page.route('**/data.json', route => route.fulfill({
            json: [
                { type: 'category', title: "Men's tops", link: 'https://mageos-docker.magsite.co.uk/men.html?cat=12', thumbnail: '/assets/categoryfeatured/men-tops.svg', altText: "Men's tops" },
                { type: 'product', title: 'Atomic Endurance Running Tee', link: 'https://mageos-docker.magsite.co.uk/atomic-endurance-running-tee-crew-neck.html', thumbnail: '/assets/categoryfeatured/atomic-endurance-running-tee.svg', altText: 'Red Atomic Endurance running tee' },
                { type: 'external', title: "Nike men's running", link: 'https://www.nike.com/gb/w/mens-running-shoes-37v7jznik1zy7ok', thumbnail: '/assets/categoryfeatured/nike-running.svg', altText: "Nike men's running collection" },
            ],
        }));
        await page.goto('/?reactedge_debug=eager');
        categoryfeatured = page.locator('categoryfeatured-widget');
        await expect(categoryfeatured).toBeVisible();
    });

    test('CategoryFeatured widget renders its configured title', async () => {
        const title = categoryfeatured.locator(
            '[data-categoryfeatured-title]'
        );

        await expect(title).toHaveText("Featured in this category");
        await expect(categoryfeatured.locator(".categoryfeatured__card")).toHaveCount(3);
        await expect(categoryfeatured.locator('[data-categoryfeatured-card-type="category"]')).toHaveAttribute(
            'href',
            'https://mageos-docker.magsite.co.uk/men.html?cat=12'
        );
        await expect(categoryfeatured.locator('[data-categoryfeatured-card-type="product"] img')).toHaveAttribute(
            'alt',
            'Red Atomic Endurance running tee'
        );
        await expect(categoryfeatured.locator('[data-categoryfeatured-card-type="external"]')).toHaveAttribute(
            'target',
            '_blank'
        );
    });

    test('CategoryFeatured widget renders the title colour', async () => {
        const title = categoryfeatured.locator(
            '[data-categoryfeatured-title]'
        );

        const colour = await title.evaluate(
            (element: HTMLElement) =>
                getComputedStyle(element).color
        );

        expect(colour).not.toBe('rgb(0, 0, 0)');
    });

    test('shows carousel arrows only while the browser matches the mobile media query', async ({ page }) => {
        const previous = categoryfeatured.locator('[data-categoryfeatured-prev]');
        const next = categoryfeatured.locator('[data-categoryfeatured-next]');

        await page.setViewportSize({ width: 1280, height: 800 });
        await expect(next).toHaveCount(0);

        await page.setViewportSize({ width: 375, height: 667 });
        await expect(previous).toBeVisible();
        await expect(next).toBeVisible();

        await page.setViewportSize({ width: 1280, height: 800 });
        await expect(next).toHaveCount(0);
    });

    test('renders nothing when configured cards are empty', async ({ page }) => {
        await page.route('**/data.json', route => route.fulfill({ json: [] }));
        await page.reload();

        await expect(categoryfeatured.locator('.categoryfeatured')).toHaveCount(0);
    });
});
