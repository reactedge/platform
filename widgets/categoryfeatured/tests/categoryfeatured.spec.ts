import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { WIDGET_ID } from "../src/Config";

test.describe('CategoryFeatured Widget', () => {
    let categoryfeatured: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        categoryfeatured = page.locator('categoryfeatured-widget');
        await expect(categoryfeatured).toBeVisible();
    });

    async function mountCategories(page: Page) {
        await page.evaluate(widgetId => {
            const api = window[`ReactEdge_${widgetId}`];
            if (!api) throw new Error("Featured category widget API is not mounted");
            const element = document.createElement(`${widgetId}-widget`);
            element.id = "featured-bootstrap-test";
            document.body.append(element);
            api.mount(element, {
                data: { title: "Featured categories", categories: [] },
                settings: { colour: "#1f2937" },
            }, [
                {
                    title: "Jackets",
                    image: "/media/catalog/category/category-23.jpg",
                    imageAlt: "Jackets",
                    url: "/women/tops-women/jackets-women.html",
                },
                {
                    title: "Hoodies & Sweatshirts",
                    image: "/media/catalog/category/category-24.jpg",
                    imageAlt: "Hoodies & Sweatshirts",
                    url: "/women/tops-women/hoodies-and-sweatshirts-women.html",
                },
            ]);
        }, WIDGET_ID);
        categoryfeatured = page.locator("#featured-bootstrap-test");
        await expect(categoryfeatured).toBeVisible();
    }

    test('renders featured categories supplied as bootstrap data', async ({ page }) => {
        await mountCategories(page);
        const title = categoryfeatured.locator(
            '[data-categoryfeatured-title]'
        );

        await expect(title).toHaveText("Featured categories");
        await expect(categoryfeatured.locator(".categoryfeatured__card")).toHaveCount(2);
        await expect(categoryfeatured.locator(".categoryfeatured__card").first())
            .toHaveAttribute("href", "/women/tops-women/jackets-women.html");
    });

    test('renders configured title colour with bootstrap categories', async ({ page }) => {
        await mountCategories(page);
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
        await mountCategories(page);
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
});
