import {expect, test} from '@playwright/test';

test.describe('CMSBlock source editor', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/?reactedge_debug=eager');
        await expect(page.locator('cmsblock-widget')).toBeVisible();
    });

    test('renders the configured title and source', async ({page}) => {
        const widget = page.locator('cmsblock-widget');
        await expect(widget.locator('[data-cmsblock-title]')).toHaveText('CMS Block');
        await expect(widget.getByLabel('Source content')).toContainText('Add your content here');
    });

    test('updates the template association and can reset the working copy', async ({page}) => {
        const widget = page.locator('cmsblock-widget');
        const source = widget.getByLabel('Source content');
        const original = await source.inputValue();
        await widget.getByLabel('Template').selectOption('feature');
        await source.fill('A replacement headline');
        await expect(widget.getByRole('status')).toHaveText('Unsaved working copy');
        await widget.getByRole('button', {name: 'Reset changes'}).click();
        await expect(source).toHaveValue(original);
        await expect(widget.getByLabel('Template')).toHaveValue('editorial');
    });

    test('inspects HTML source as inert text rather than executing it', async ({page}) => {
        const widget = page.locator('cmsblock-widget');
        await widget.getByLabel('Content format').selectOption('html');
        await widget.getByLabel('Source content').fill('<img src="broken.png" onerror="alert(1)">');
        await widget.getByRole('button', {name: 'Inspect source'}).click();
        await expect(widget.getByLabel('Source preview')).toContainText('<img src="broken.png"');
        await expect(widget.getByLabel('Source preview').locator('img')).toHaveCount(0);
    });
});
