import { expect, test } from "@playwright/test";

const beachResults = {
    postcode: "BN1 1AA",
    radiusMiles: 10,
    beaches: [{
        id: "node-7",
        name: "Brighton Beach",
        latitude: 50.8198,
        longitude: -0.1367,
        distanceMiles: 0.8,
    }],
};

test.describe("Beach Finder widget", () => {
    test("searches by postcode and radius and displays beach details", async ({ page }) => {
        let requestUrl = "";
        await page.route("**/beachfinder/beaches?*", async (route) => {
            requestUrl = route.request().url();
            await route.fulfill({ json: beachResults });
        });
        await page.goto("/?reactedge_debug=eager");

        const widget = page.locator("beachfinder-widget");
        await expect(widget.locator("[data-beachfinder-title]")).toHaveText("Find a beach near you");
        await widget.getByLabel("UK postcode").fill("BN1 1AA");
        await widget.getByLabel("Search radius").fill("10");
        await widget.getByRole("button", { name: "Find beaches" }).click();

        await expect(widget.getByRole("heading", { name: "Beaches near BN1 1AA" })).toBeVisible();
        await expect(widget.getByRole("heading", { name: "Brighton Beach" })).toBeVisible();
        await expect(widget.getByText("0.8 miles away")).toBeVisible();
        expect(requestUrl).toContain("postcode=BN1+1AA");
        expect(requestUrl).toContain("radiusMiles=10");
        await expect(widget.getByText("OpenStreetMap contributors")).toBeVisible();
    });

    test("shows a useful message when the postcode is unknown", async ({ page }) => {
        await page.route("**/beachfinder/beaches?*", (route) => route.fulfill({ status: 404 }));
        await page.goto("/?reactedge_debug=eager");
        const widget = page.locator("beachfinder-widget");
        await widget.getByLabel("UK postcode").fill("ZZ1 1ZZ");
        await widget.getByRole("button", { name: "Find beaches" }).click();
        await expect(widget.getByRole("alert")).toHaveText("That postcode could not be found. Check it and try again.");
    });

    test("shows an empty state when the service finds no beaches", async ({ page }) => {
        await page.route("**/beachfinder/beaches?*", (route) => route.fulfill({
            json: { postcode: "BN1 1AA", radiusMiles: 10, beaches: [] },
        }));
        await page.goto("/?reactedge_debug=eager");
        const widget = page.locator("beachfinder-widget");
        await widget.getByLabel("UK postcode").fill("BN1 1AA");
        await widget.getByRole("button", { name: "Find beaches" }).click();
        await expect(widget.getByText("No beaches found within 10 miles of BN1 1AA.")).toBeVisible();
    });
});
