import { expect, test } from '@playwright/test';
import type { Listing } from '../src/models/listing.ts';

test.beforeEach(async ({ request, page }) => {
    const response = await request.get('/api/listings');
    expect(response.ok()).toBeTruthy();
    for (const record of await response.json() as Listing[]) {
        expect((await request.delete(`/api/listings/${record.id}`)).ok()).toBeTruthy();
    }
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Listings', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create listing', exact: true })).toBeEnabled();
});

test('creates, edits, reloads and deletes a listing', async ({ page }) => {
    await page.getByLabel('Listing name', { exact: true }).fill('Summer products');
    await page.getByRole('button', { name: 'Create listing', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Listing created.');
    await page.reload();
    await page.getByRole('button', { name: 'Edit Summer products', exact: true }).click();
    await expect(page.getByLabel('Listing name', { exact: true })).toHaveValue('Summer products');
    await page.getByLabel('Listing name', { exact: true }).fill('Winter products');
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Listing updated.');
    await page.reload();
    await page.getByRole('button', { name: 'Delete Winter products', exact: true }).click();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Edit Winter products' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete Winter products', exact: true }).click();
    await page.getByRole('button', { name: 'Confirm delete' }).click();
    await expect(page.getByRole('status')).toHaveText('Listing deleted.');
    await page.reload();
    await expect(page.getByText('No listings yet.')).toBeVisible();
});

test('enforces 50 characters, rejects whitespace and supports cancelling edits', async ({ page }) => {
    const input = page.getByLabel('Listing name', { exact: true });
    await expect(input).toHaveAttribute('maxlength', '50');
    await input.fill('   ');
    await page.getByRole('button', { name: 'Create listing', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText('Enter a listing name.');
    const name = 'x'.repeat(50);
    await input.fill(name);
    await page.getByRole('button', { name: 'Create listing', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Listing created.');
    await page.getByRole('button', { name: `Edit ${name}`, exact: true }).click();
    await input.fill('Unsaved change');
    await page.getByRole('button', { name: 'Cancel edit' }).click();
    await expect(input).toHaveValue('');
    await page.reload();
    await expect(page.getByRole('button', { name: `Edit ${name}`, exact: true })).toBeVisible();
    await expect(page.getByText('Unsaved change', { exact: true })).toHaveCount(0);
});

test('save failures retain entered data and show an error', async ({ page }) => {
    await page.route('**/api/listings', route => route.request().method() === 'POST'
        ? route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Unable to access listing storage.' }) })
        : route.continue());
    await page.getByLabel('Listing name', { exact: true }).fill('Keep this name');
    await page.getByRole('button', { name: 'Create listing', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText('Unable to access listing storage.');
    await expect(page.getByLabel('Listing name', { exact: true })).toHaveValue('Keep this name');
    await expect(page.getByText('No listings yet.')).toBeVisible();
});

test('failed loads disable writes and can be retried', async ({ page }) => {
    await page.route('**/api/listings', route => route.fulfill({
        status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Unable to access listing storage.' }),
    }));
    await page.reload();
    await expect(page.getByRole('alert')).toHaveText('Unable to access listing storage.');
    await expect(page.getByRole('button', { name: 'Create listing', exact: true })).toBeDisabled();
    await page.unroute('**/api/listings');
    await page.getByRole('button', { name: 'Retry loading' }).click();
    await expect(page.getByRole('button', { name: 'Create listing', exact: true })).toBeEnabled();
    await expect(page.getByRole('alert')).toHaveCount(0);
});
