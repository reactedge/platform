import { test, expect } from '@playwright/test';
import {WIDGET_ID} from "../src/Config";

test.describe('ContactUs Widget', () => {
    let widget;

    test.beforeEach(async ({page}) => {
        await page.goto('/?reactedge_debug=eager');
        widget = page.locator(`${WIDGET_ID}-widget`);
        await expect(widget).toBeVisible();
    });

    test('ContactUs renders configured title', async () => {
        const title = widget.locator('[data-contact-title]');
        await expect(title).toBeVisible();
        await expect(title).not.toHaveText('');
    });

    test('ContactUs renders at least one field', async () => {
        const fields = widget.locator('[data-contact-field]');

        await expect(fields).toHaveCount(3);
    });

    test('ContactUs renders submit button', async () => {
        const submit = widget.locator('[data-contact-submit]');

        await expect(submit).toBeVisible();
    });

    test('ContactUs renders Turnstile container', async ({page}) => {
        const turnstile = page.locator('#contactus-turnstile');
        await expect(turnstile).toBeVisible();
    });

    test('ContactUs submit remains disabled after filling fields (without Turnstile)', async () => {
        const submit = widget.locator('[data-contact-submit]');
        await expect(submit).toBeVisible();
        await expect(submit).toBeDisabled();

        const fields = widget.locator('[data-contact-field]');
        const count = await fields.count();

        for (let i = 0; i < count; i++) {
            const input = fields.nth(i);
            const type = await input.getAttribute('type');

            if (type === 'email') {
                await input.fill('jane@test.com');
            } else {
                await input.fill('test');
            }
        }

        await expect(submit).toBeDisabled();
    });

    test('ContactUs fields accept input', async () => {
        const fields = widget.locator('[data-contact-field]');
        const count = await fields.count();

        for (let i = 0; i < count; i++) {
            const input = fields.nth(i);
            const type = await input.getAttribute('type');
            const value = type === 'email' ? 'jane@test.com' : 'test';
            await input.fill(value);
            await expect(input).toHaveValue(value);
        }
    });
});