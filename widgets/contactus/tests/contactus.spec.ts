import { test, expect } from '@playwright/test';

test('ContactUs mounts successfully', async ({ page }) => {
    await page.goto('/');

    const widget = page.locator('contactus-widget');
    await expect(widget).toBeVisible();
});

test('ContactUs renders configured title', async ({ page }) => {
    await page.goto('/');

    const widget = page.locator('contactus-widget');
    await expect(widget).toBeVisible();

    const title = widget.locator('[data-contact-title]');
    await expect(title).toBeVisible();
    await expect(title).not.toHaveText('');
});

test('ContactUs renders at least one field', async ({ page }) => {
    await page.goto('/');

    const widget = page.locator('contactus-widget');
    const fields = widget.locator('[data-contact-field]');

    await expect(fields).toHaveCount(3);
});

test('ContactUs renders submit button', async ({ page }) => {
    await page.goto('/');

    const widget = page.locator('contactus-widget');
    const submit = widget.locator('[data-contact-submit]');

    await expect(submit).toBeVisible();
});

test('ContactUs renders Turnstile container', async ({ page }) => {
    await page.goto('/');

    const widget = page.locator('contactus-widget');
    await expect(widget).toBeVisible();

    const turnstile = page.locator('#contactus-turnstile');
    await expect(turnstile).toBeVisible();
});

test('ContactUs submit remains disabled after filling fields (without Turnstile)', async ({ page }) => {
    await page.goto('/');

    const widget = page.locator('contactus-widget');
    await expect(widget).toBeVisible();

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

test('ContactUs submit enables when Turnstile token is present', async ({ page }) => {
    await page.goto('/');

    const widget = page.locator('contactus-widget');
    const submit = widget.locator('[data-contact-submit]');
    const fields = widget.locator('[data-contact-field]');

    // Fill fields
    const count = await fields.count();
    for (let i = 0; i < count; i++) {
        const input = fields.nth(i);
        const type = await input.getAttribute('type');
        await input.fill(type === 'email' ? 'jane@test.com' : 'test');
    }
});
