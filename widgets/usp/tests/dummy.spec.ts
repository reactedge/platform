/*import { test, expect } from '@playwright/test';

import { mount } from '../src/widget';

test('mounts widget', async ({ page }) => {

    await page.setContent(`
        <usp-widget></usp-widget>
    `);

    const html = await page.evaluate(() => {
        return document.body.innerHTML;
    });

    expect(html).toContain('usp-widget');
});*/

import { test, expect } from '@playwright/test';
import { mount } from '../vite_project/src/widget';

test('mount function exists', async () => {
    expect(mount).toBeDefined();
});