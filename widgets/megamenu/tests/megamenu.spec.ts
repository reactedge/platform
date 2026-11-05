import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";
import {WIDGET_ID} from "../src/bootstrap/config/Config";

test.describe('Megamenu widget (WordPress embed)', () => {
    let widget: Locator;

    test.beforeEach(async ({page}) => {
        await page.goto('/?reactedge_debug=eager');
        widget = page.locator(`${WIDGET_ID}-widget`);
        await expect(widget).toBeVisible();
    });

    test('Megamenu widget mounts', async () => {
        await expect(widget).toBeAttached();
    });

    test('Megamenu renders top-level items', async () => {
        await expect(widget.getByText('Men').first()).toBeVisible();
        await expect(widget.getByText('Women')).toBeVisible();
    });

    test('Megamenu renders CTA item', async () => {
        const cta = widget.getByText('Gear');
        await expect(cta).toBeVisible();
    });

    test('Megamenu shows submenu on interaction', async () => {
        await widget.getByText('Women').click();
        await expect(widget.getByText('Bras & Tanks')).toBeVisible();
    });

    test('shows the current category breadcrumb', async ({ page }) => {
        await page.goto(
            '/women/tops-women/hoodies-and-sweatshirts-women.html'
        );

        const parent = page.locator('.parent-label.is-breadcrumb');
        const current = page.locator('a.link.in-breadcrumb');

        await expect(parent).toContainText('Women');

        await expect(current).toHaveText('Hoodies & Sweatshirts');
        await expect(current).toHaveAttribute(
            'href',
            /\/women\/tops-women\/hoodies-and-sweatshirts-women\.html$/
        );
    });
});