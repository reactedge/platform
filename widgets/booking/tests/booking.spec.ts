import { test, expect } from '@playwright/test';

test.describe('Booking widget (current contract)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        //await page.goto('/fixtures/booking.current.html');
    });
    // test.beforeEach(async ({ page }) => {
    //     await page.goto('/fixtures/booking.current.html');
    // });
    test('Booking widget does not crash the page', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
    });

    test('Booking widget mounts', async ({ page }) => {
        await expect(page.locator('bookingsystem-widget')).toBeAttached();
    });

    test('renders initial category selection state', async ({ page }) => {
        await expect(page.locator('bookingsystem-widget')).toBeAttached();

        const spinner = page.getByRole('status', { name: 'Loading' })
        await expect(spinner).toBeVisible()
        await page.evaluate(() => localStorage.clear())
        await page.waitForTimeout(10000)

        // await page.route('**/graphql', route => {
        //     setTimeout(() => {
        //         route.fulfill({
        //             status: 200,
        //             contentType: 'application/json',
        //             /*body: JSON.stringify(mockInitialData)*/
        //         })
        //     }, 300) // simulate delay
        // })

        await expect(page.getByText('make this booking easy')).toBeVisible()

        // await expect(page.getByRole('button', { name: 'Garden Maintenance' })).toBeVisible()
        // await expect(page.getByRole('button', { name: 'Landscaping Projects' })).toBeVisible()
        // await expect(page.getByRole('button', { name: 'Support & Repairs' })).toBeVisible()

        // No slot grid yet
        //await expect(page.locator('[data-testid="timeslot-grid"]')).toHaveCount(0)

        // No success state
        //await expect(page.locator('[data-testid="booking-success"]')).toHaveCount(0)

        // Turnstile gate present
        await expect(page.locator('#security-gate')).toBeAttached()
    })
});