import { expect, test } from "@playwright/test";

test.describe("Golf course finder widget", () => {
    test("renders a postcode and radius search", async ({ page }) => {
        await page.goto("/?reactedge_debug=eager");
        const widget = page.locator("golfcoursefinder-widget");
        await expect(widget).toBeVisible();
        await expect(widget.getByRole("heading", { level: 1, name: "Find golf courses near you" })).toBeVisible();
        await expect(widget.getByLabel("UK postcode")).toBeVisible();
        await expect(widget.getByLabel("Search radius")).toBeVisible();
        await expect(widget.getByRole("button", { name: "Find golf courses" })).toBeVisible();
    });
});
