import { test, expect } from '@playwright/test';

test.describe('USP Widget', () => {
    let trustpilot;

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        //await page.goto('/fixtures/trustpilot.html');
        trustpilot = page.locator('trustpilot-widget');
        await expect(trustpilot).toBeVisible();
    });

    test('USP widget finds its slides', async ({ page }) => {
        const slides = trustpilot.locator('[data-trustpilot-slide]');

        await expect(slides).toHaveCount(3);
        await expect(slides.first()).toContainText('Over 20 years');
    });

    test.describe('mobile behaviour', () => {

        test.use({ viewport: { width: 375, height: 667 } });

        test('USP next button activates the next slide on mobile', async ({page}) => {
            // Initial active slide
            const activeBefore = trustpilot.locator('[data-trustpilot-active="true"]');
            await expect(activeBefore).toHaveCount(1);

            const firstText = await activeBefore.first().textContent();

            // Click next
            const nextButton = trustpilot.locator('[data-trustpilot-next]');
            await expect(nextButton).toBeVisible();
            await nextButton.click();

            // New active slide
            const activeAfter = trustpilot.locator('[data-trustpilot-active="true"]');
            await expect(activeAfter).toHaveCount(1);

            const secondText = await activeAfter.first().textContent();

            // Assert state change
            expect(secondText).not.toEqual(firstText);
        });


        test('USP previous button activates the previous slide on mobile', async ({page}) => {
            const nextButton = trustpilot.locator('[data-trustpilot-next]');
            const prevButton = trustpilot.locator('[data-trustpilot-prev]');

            await expect(nextButton).toBeVisible();
            await expect(prevButton).toBeVisible();

            // Capture initial active slide
            const initialActive = trustpilot.locator('[data-trustpilot-active="true"]');
            await expect(initialActive).toHaveCount(1);
            const initialText = await initialActive.first().textContent();

            // Go forward once
            await nextButton.click();

            const afterNext = trustpilot.locator('[data-trustpilot-active="true"]');
            await expect(afterNext).toHaveCount(1);
            const nextText = await afterNext.first().textContent();

            expect(nextText).not.toEqual(initialText);

            // Go back
            await prevButton.click();

            const afterPrev = trustpilot.locator('[data-trustpilot-active="true"]');
            await expect(afterPrev).toHaveCount(1);
            const prevText = await afterPrev.first().textContent();

            // We must be back on the original slide
            expect(prevText).toEqual(initialText);
        });


        test('USP never has more than one active slide', async ({page}) => {
            await page.setViewportSize({width: 375, height: 667});

            const next = trustpilot.locator('[data-trustpilot-next]');
            const prev = trustpilot.locator('[data-trustpilot-prev]');

            for (let i = 0; i < 5; i++) {
                await next.click();
                await expect(trustpilot.locator('[data-trustpilot-active="true"]')).toHaveCount(1);

                await prev.click();
                await expect(trustpilot.locator('[data-trustpilot-active="true"]')).toHaveCount(1);
            }
        });

        test('USP does not duplicate slides on reload', async ({page}) => {
            await expect(trustpilot.locator('[data-trustpilot-slide]')).toHaveCount(3);

            await page.reload();

            await expect(trustpilot.locator('[data-trustpilot-slide]')).toHaveCount(3);
            await expect(trustpilot.locator('[data-trustpilot-active="true"]')).toHaveCount(1);
        });

        test('USP supports keyboard navigation on mobile', async ({page}) => {
            await trustpilot.focus();

            const first = await trustpilot
                .locator('[data-trustpilot-active="true"]')
                .first()
                .textContent();

            const next = page.locator('[data-trustpilot-next]');
            await next.focus();
            await page.keyboard.press('ArrowRight');

            const second = await trustpilot
                .locator('[data-trustpilot-active="true"]')
                .first()
                .textContent();

            expect(second).not.toEqual(first);
        });
    });


    test.describe('desktop behaviour', () => {

        test.use({ viewport: { width: 1280, height: 800 } });

        test('shows all slides statically', async ({ page }) => {
            const trustpilot = page.locator('trustpilot-widget');
            await expect(trustpilot.locator('[data-trustpilot-slide]')).toHaveCount(3);
        });


        test('USP desktop mode ignores next and prev', async ({page}) => {
            const slides = trustpilot.locator('[data-trustpilot-slide]');
            await expect(slides).toHaveCount(3);

            // Either all active, or no active flags at all
            await expect(trustpilot.locator('[data-trustpilot-active="true"]')).toHaveCount(0);
        });
    });

    test('USP does not make network requests', async ({page}) => {
        await page.route('**/*', route => {
            const url = route.request().url();
            if (!url.startsWith('file://') && !url.includes('localhost')) {
                throw new Error(`Unexpected request: ${url}`);
            }
            route.continue();
        });

        await page.goto('/fixtures/trustpilot.html');
    });
});