import {expect, test} from '@playwright/test';

test.describe('CMSBlock E2E workflow', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/?reactedge_debug=eager');
        await expect(page.locator('cmsblock-widget')).toBeVisible();
    });

    test('edits, saves the style, generates, approves and shows the published block', async ({page}) => {
        const widget = page.locator('cmsblock-widget');
        await expect(widget.locator('[data-cmsblock-title]')).toBeVisible();
        await widget.getByRole('button', {name: 'Edit', exact: true}).click();
        await widget.getByLabel('Source content').fill('Welcome to CMSBlock\nA beautiful responsive content block.');
        await widget.getByRole('button', {name: 'Use Minimal style'}).click();
        await expect(widget.getByRole('button', {name: 'Use Minimal style'})).toHaveAttribute('aria-pressed', 'true');
        await widget.getByRole('button', {name: 'Save source'}).click();
        await expect(widget.getByText('Source and template saved.')).toBeVisible();
        await widget.getByRole('button', {name: 'Generate draft'}).click();
        await expect(widget.getByRole('heading', {name: /Review generated revision/})).toBeVisible();
        await expect(widget.frameLocator('iframe[title="Generated CMSBlock draft"]').locator('h2')).toHaveText('Welcome to CMSBlock');
        await widget.getByRole('button', {name: 'Approve and publish'}).click();
        await expect(widget.getByRole('heading', {name: /Published revision/})).toBeVisible();
        await expect(widget.frameLocator('iframe[title="Published CMSBlock"]').locator('h2')).toHaveText('Welcome to CMSBlock');
        await page.reload();
        await expect(widget.getByRole('heading', {name: /Published revision/})).toBeVisible();
    });

    test('keeps editorial style separate from the layout preview', async ({page}) => {
        const widget = page.locator('cmsblock-widget');
        await widget.getByRole('button', {name: 'Edit', exact: true}).click();
        await expect(widget.locator('.cmsblock-editor__style')).toHaveCount(3);
        await expect(widget.locator('.cmsblock-editor__reference')).toHaveCount(3);

        await widget.getByRole('button', {name: 'Use Editorial style'}).click();
        await widget.getByRole('button', {name: 'Use Image left layout'}).click();
        await expect(widget.getByRole('img', {name: 'Large preview of Image left layout'})).toBeVisible();
        await expect(widget.getByRole('button', {name: 'Use Editorial style'})).toHaveAttribute('aria-pressed', 'true');

        await widget.getByRole('button', {name: 'Use Promotional style'}).click();
        await expect(widget.getByRole('button', {name: 'Use Promotional style'})).toHaveAttribute('aria-pressed', 'true');
        await expect(widget.getByRole('button', {name: 'Use Image left layout'})).toHaveAttribute('aria-pressed', 'true');
        await expect(widget.locator('.cmsblock-editor__reference-selected')).toHaveCount(1);
        await expect(widget.getByText(/Layout selection is a UI preview only/)).toBeVisible();
    });

    test('saves editorial style but does not submit the preview-only layout', async ({page}) => {
        const widget = page.locator('cmsblock-widget');
        await widget.getByRole('button', {name: 'Edit', exact: true}).click();
        await widget.getByLabel('Source content').fill('Choose a style and inspect the image arrangement');
        await widget.getByRole('button', {name: 'Use Promotional style'}).click();
        await widget.getByRole('button', {name: 'Use Image right layout'}).click();

        const saveRequest = page.waitForRequest(request =>
            request.method() === 'PUT' && request.url().includes('/cmsblock/blocks/demo'));
        await widget.getByRole('button', {name: 'Save source'}).click();
        const request = await saveRequest;
        const payload = request.postDataJSON() as {templateId: string; layoutId?: string};
        expect(payload.templateId).toBe('promotion');
        expect(payload).not.toHaveProperty('layoutId');
        await expect(widget.getByText('Source and template saved.')).toBeVisible();

        await page.reload();
        await widget.getByRole('button', {name: 'Edit', exact: true}).click();
        await expect(widget.getByRole('button', {name: 'Use Promotional style'})).toHaveAttribute('aria-pressed', 'true');
        await expect(widget.getByRole('button', {name: 'Use Image above layout'})).toHaveAttribute('aria-pressed', 'true');
    });

    test('changing the layout preview does not mark saved source as changed', async ({page}) => {
        const widget = page.locator('cmsblock-widget');
        await widget.getByRole('button', {name: 'Edit', exact: true}).click();
        await widget.getByRole('button', {name: 'Use Image right layout'}).click();
        await expect(widget.getByRole('img', {name: 'Large preview of Image right layout'})).toBeVisible();
        await expect(widget.getByRole('button', {name: 'Use Image right layout'})).toHaveAttribute('aria-pressed', 'true');
        await expect(widget.locator('.cmsblock-editor__reference-selected')).toHaveCount(1);
    });
});
