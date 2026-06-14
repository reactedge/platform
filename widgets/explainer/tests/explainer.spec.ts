import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test('Explainer widget mounts', async ({ page }) => {
    const host = page.locator('#banner-explainer');
    await expect(host).toBeVisible();
});

test("opens explainer on click", async ({ page }) => {
    await page.click("text=Banner trigger");

    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toBeVisible();
});

test("toggles explainer closed on second click", async ({ page }) => {
    await page.click("text=Banner trigger");
    await expect(page.getByRole("tooltip")).toBeVisible();

    await page.click("text=Banner trigger");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("opens explainer with Enter key", async ({ page }) => {
    const trigger = page.locator("text=Banner trigger");
    await trigger.focus();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("tooltip")).toBeVisible();
});

test("closes explainer with Escape", async ({ page }) => {
    await page.click("text=Banner trigger");
    await expect(page.getByRole("tooltip")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("closes explainer on outside click", async ({ page }) => {
    await page.click("text=Banner trigger");
    await expect(page.getByRole("tooltip")).toBeVisible();

    await page.click("#outside");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("does nothing if trigger is missing", async ({ page }) => {
    await page.goto("/tests/fixtures/explainer-no-trigger.html");

    await expect(page.getByRole("tooltip")).toHaveCount(0);
});
