import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

const product = {
    sku: "WJ12",
    name: "Everyday Jacket",
    small_image: { url: "https://shop.example.test/jacket.jpg" },
    price_range: {
        minimum_price: {
            final_price: { value: 25, currency: "USD" },
        },
    },
};

const searchedProduct = {
    sku: "SH23",
    name: "Trail Shell",
    small_image: { url: "https://shop.example.test/shell.jpg" },
    price_range: {
        minimum_price: {
            final_price: { value: 40, currency: "USD" },
        },
    },
};

test.describe("Quote Widget", () => {
    let quote: Locator;
    let cartMutationRequests: string[];

    test.beforeEach(async ({ page }) => {
        cartMutationRequests = [];
        await page.route("**/graphql", async route => {
            const requestText = route.request().postData() ?? "";
            const requestBody = route.request().postDataJSON();
            if (requestBody.variables?.search) {
                expect(requestBody.variables.search).toBe("Trail");
            }
            if (/addProductsToCart|removeItemFromCart|createEmptyCart/.test(requestText)) {
                cartMutationRequests.push(requestText);
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    data: {
                        products: {
                            items: requestBody.variables?.filter?.sku ? [product] : [searchedProduct],
                        },
                    },
                }),
            });
        });
        await page.route("**/v1/intent/recommend", async route => {
            const payload = route.request().postDataJSON();
            expect(payload.intentText).toBe("Trail");
            expect(payload.filters).toEqual({});
            expect(payload.products).toEqual([
                expect.objectContaining({ sku: "SH23", title: "Trail Shell" }),
            ]);
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    suggestions: [{ sku: "SH23", match: 100, reason: "Relevant" }],
                }),
            });
        });

        await page.goto("/?reactedge_debug=eager");
        quote = page.locator("quote-widget");
        await expect(quote).toBeVisible();
    });

    test("starts with a trigger and opens the quote modal", async () => {
        const dialog = quote.locator("[data-quote-dialog]");
        await expect(quote.locator("[data-quote-open]")).toHaveText("Request a quote");
        await expect(dialog).not.toBeVisible();

        await quote.locator("[data-quote-open]").click();
        await expect(dialog).toBeVisible();
        await expect(dialog.locator("#quote-dialog-title")).toHaveText("Request a quote");
        await expect(dialog.locator("[data-quote-product-name]")).toHaveText("Everyday Jacket");
        await expect(dialog.locator("[data-quote-product-price]")).toHaveText("$25.00");
    });

    test("adds product locally and recalculates the estimated subtotal", async () => {
        const dialog = quote.locator("[data-quote-dialog]");
        await quote.locator("[data-quote-open]").click();
        await dialog.locator("[data-quote-candidate-quantity]").fill("2");
        await dialog.locator("[data-quote-add]").click();

        const line = dialog.locator('[data-quote-line="WJ12"]');
        await expect(line).toBeVisible();
        await expect(line.locator("[data-quote-quantity]")).toHaveText("2");
        await expect(line.locator(".quote__line-total")).toHaveText("$50.00");
        await expect(dialog.locator("[data-quote-subtotal]")).toHaveText("$50.00");

        await line.getByRole("button", { name: "Increase Everyday Jacket quantity" }).click();
        await expect(line.locator("[data-quote-quantity]")).toHaveText("3");
        await expect(dialog.locator("[data-quote-subtotal]")).toHaveText("$75.00");

        await line.getByRole("button", { name: "Decrease Everyday Jacket quantity" }).click();
        await expect(dialog.locator("[data-quote-subtotal]")).toHaveText("$50.00");

        await line.getByRole("button", { name: "Remove" }).click();
        await expect(line).toHaveCount(0);
        await expect(dialog.locator("[data-quote-subtotal]")).toHaveText("$0.00");
        expect(cartMutationRequests).toEqual([]);
    });

    test("searches products and adds a result to the quote", async () => {
        const dialog = quote.locator("[data-quote-dialog]");
        await quote.locator("[data-quote-open]").click();
        await dialog.locator("[data-quote-search]").fill("Trail");

        const result = dialog.getByRole("list", { name: "Search results" })
            .getByRole("listitem");
        await expect(result).toContainText("Trail Shell");
        await result.getByRole("button", { name: "Add Trail Shell to quote" }).click();

        const line = dialog.locator('[data-quote-line="SH23"]');
        await expect(line).toBeVisible();
        await expect(line.locator("[data-quote-quantity]")).toHaveText("1");
        await expect(dialog.locator("[data-quote-subtotal]")).toHaveText("$40.00");
        expect(cartMutationRequests).toEqual([]);
    });

    test("closes with Escape and preserves quote state when reopened", async ({ page }) => {
        const dialog = quote.locator("[data-quote-dialog]");
        await quote.locator("[data-quote-open]").click();
        await dialog.locator("[data-quote-add]").click();
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();

        await quote.locator("[data-quote-open]").click();
        await expect(dialog.locator('[data-quote-line="WJ12"]')).toBeVisible();
        expect(cartMutationRequests).toEqual([]);
    });
});