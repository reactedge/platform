import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { WIDGET_ID } from "../src/Config";

test.describe("Category FAQ Widget", () => {
    let widget: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto("/?reactedge_debug=eager");
        widget = page.locator("categoryfaq-widget");
        await expect(widget).toBeVisible();
    });

    async function mountFaqs(page: Page, faqs: unknown[]) {
        await page.evaluate(({ widgetId, faqs }) => {
            const api = window[`ReactEdge_${widgetId}`];
            if (!api) throw new Error("FAQ widget API is not mounted");
            const element = document.createElement(`${widgetId}-widget`);
            element.id = "faq-bootstrap-test";
            document.body.append(element);
            api.mount(element, {
                data: { title: "Frequently asked questions", faqs: [] },
                settings: { colour: "#1f2937" },
            }, faqs);
        }, { widgetId: WIDGET_ID, faqs });
        widget = page.locator("#faq-bootstrap-test");
        await expect(widget).toBeVisible();
    }

    test("renders FAQ entries supplied as bootstrap data", async ({ page }) => {
        await mountFaqs(page, [
            {
                question: "How do I choose the right size?",
                answer: "Compare your measurements with the size guide.",
            },
            {
                question: "Can I return an item that does not fit?",
                answer: "Unworn items can be returned within 30 days.",
            },
        ]);

        await expect(widget.locator("h1[data-categoryfaq-title]")).toHaveText("Frequently asked questions");
        await expect(widget.locator("summary")).toHaveCount(2);
        await expect(widget.locator("summary").first()).toHaveText("How do I choose the right size?");
    });

    test("allows a bootstrap FAQ question to be expanded", async ({ page }) => {
        await mountFaqs(page, [{ question: "Returns?", answer: "Within 30 days." }]);

        const answer = widget.locator(".categoryfaq__item").first();
        await answer.locator("summary").click();
        await expect(answer.locator(".categoryfaq__answer")).toBeVisible();
    });

    test("renders an empty list when no category bootstrap data is supplied", async () => {
        await expect(widget.locator("h1[data-categoryfaq-title]")).toHaveText("Frequently asked questions");
        await expect(widget.locator("summary")).toHaveCount(0);
    });
});
