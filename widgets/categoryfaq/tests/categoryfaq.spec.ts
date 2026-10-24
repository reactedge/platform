import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.describe("Category FAQ Widget", () => {
    let widget: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto("/?reactedge_debug=eager");
        widget = page.locator("categoryfaq-widget");
        await expect(widget).toBeVisible();
    });

    test("renders its configured title and category FAQs", async () => {
        await expect(widget.locator("h1[data-categoryfaq-title]")).toHaveText("Frequently asked questions");
        await expect(widget.locator("summary")).toHaveCount(2);
        await expect(widget.locator("summary").first()).toHaveText("How should I choose the right size?");
    });

    test("allows a question to be expanded", async () => {
        const answer = widget.locator(".categoryfaq__item").first();
        await answer.locator("summary").click();
        await expect(answer.locator(".categoryfaq__answer")).toBeVisible();
    });
});
