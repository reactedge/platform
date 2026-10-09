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
        await widget.getByRole('button', {name: 'Use Feature reference'}).click();
        await expect(widget.getByRole('button', {name: 'Use Feature reference'})).toHaveAttribute('aria-pressed', 'true');
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

test('shows three image references and remembers the selected reference', async ({page}) => {
    await page.goto('/?reactedge_debug=eager');
    const widget = page.locator('cmsblock-widget');
    await widget.getByRole('button', {name: 'Edit', exact: true}).click();
    await expect(widget.locator('.cmsblock-editor__reference img')).toHaveCount(3);
    await widget.getByLabel('Source content').fill('Choose a template by its image');
    await widget.getByRole('button', {name: 'Use Promotional reference'}).click();
    await widget.getByRole('button', {name: 'Save source'}).click();
    await expect(widget.getByText('Source and template saved.')).toBeVisible();
    await page.reload();
    await widget.getByRole('button', {name: 'Edit', exact: true}).click();
    await expect(widget.getByRole('button', {name: 'Use Promotional reference'})).toHaveAttribute('aria-pressed', 'true');
    await expect(widget.getByRole('img', {name: 'Large preview of Promotional visual reference'})).toBeVisible();
    await expect(widget.locator('.cmsblock-editor__reference-selected')).toHaveCount(1);
    await expect(widget.getByRole('button', {name: 'Use Editorial reference'})).toHaveAttribute('aria-pressed', 'false');
});

test('updates the larger reference preview when selecting a different image', async ({page}) => {
    await page.goto('/?reactedge_debug=eager');
    const widget = page.locator('cmsblock-widget');
    await widget.getByRole('button', {name: 'Edit', exact: true}).click();

    await widget.getByRole('button', {name: 'Use Editorial reference'}).click();
    await expect(widget.getByRole('img', {name: 'Large preview of Editorial visual reference'})).toBeVisible();
    await expect(widget.getByRole('button', {name: 'Use Editorial reference'})).toHaveAttribute('aria-pressed', 'true');
    await expect(widget.locator('.cmsblock-editor__reference-selected')).toHaveCount(1);

    await widget.getByRole('button', {name: 'Use Feature reference'}).click();
    await expect(widget.getByRole('img', {name: 'Large preview of Feature visual reference'})).toBeVisible();
    await expect(widget.getByRole('button', {name: 'Use Feature reference'})).toHaveAttribute('aria-pressed', 'true');
    await expect(widget.getByRole('button', {name: 'Use Editorial reference'})).toHaveAttribute('aria-pressed', 'false');
    await expect(widget.locator('.cmsblock-editor__reference-selected')).toHaveCount(1);
});
