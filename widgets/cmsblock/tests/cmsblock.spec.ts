import {expect, test} from '@playwright/test';

test.describe('CMSBlock E2E workflow', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/?reactedge_debug=eager');
        await expect(page.locator('cmsblock-widget')).toBeVisible();
    });

    test('edits, saves, generates, approves and shows the published block', async ({page}) => {
        const widget = page.locator('cmsblock-widget');
        await expect(widget.locator('[data-cmsblock-title]')).toBeVisible();
        await widget.getByRole('button', {name: 'Edit', exact: true}).click();
        await widget.getByLabel('Source content').fill('Welcome to CMSBlock\nA beautiful responsive content block.');
        await widget.getByLabel('Template').selectOption('feature');
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
});
