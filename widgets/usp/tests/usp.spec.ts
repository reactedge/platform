import { test, expect } from '@playwright/test';

test.describe('USP Widget', () => {
    let usp;

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        //await page.goto('/fixtures/usp.html');
        usp = page.locator('usp-widget');
        await expect(usp).toBeVisible();
    });

    test('USP widget finds its slides', async ({ page }) => {
        const slides = usp.locator('[data-usp-slide]');

        await expect(slides).toHaveCount(3);
        await expect(slides.first()).toHaveText(/\S+/);
    });

    test.describe('mobile behaviour', () => {

        test.use({ viewport: { width: 375, height: 667 } });

        test('USP next button activates the next slide on mobile', async ({page}) => {
            // Initial active slide
            const activeBefore = usp.locator('[data-usp-active="true"]');
            await expect(activeBefore).toHaveCount(1);

            const firstText = await activeBefore.first().textContent();

            // Click next
            const nextButton = usp.locator('[data-usp-next]');
            await expect(nextButton).toBeVisible();
            await nextButton.click();

            // New active slide
            const activeAfter = usp.locator('[data-usp-active="true"]');
            await expect(activeAfter).toHaveCount(1);

            const secondText = await activeAfter.first().textContent();

            // Assert state change
            expect(secondText).not.toEqual(firstText);
        });


        test('USP previous button activates the previous slide on mobile', async ({page}) => {
            const nextButton = usp.locator('[data-usp-next]');
            const prevButton = usp.locator('[data-usp-prev]');

            await expect(nextButton).toBeVisible();
            await expect(prevButton).toBeVisible();

            // Capture initial active slide
            const initialActive = usp.locator('[data-usp-active="true"]');
            await expect(initialActive).toHaveCount(1);
            const initialText = await initialActive.first().textContent();

            // Go forward once
            await nextButton.click();

            const afterNext = usp.locator('[data-usp-active="true"]');
            await expect(afterNext).toHaveCount(1);
            const nextText = await afterNext.first().textContent();

            expect(nextText).not.toEqual(initialText);

            // Go back
            await prevButton.click();

            const afterPrev = usp.locator('[data-usp-active="true"]');
            await expect(afterPrev).toHaveCount(1);
            const prevText = await afterPrev.first().textContent();

            // We must be back on the original slide
            expect(prevText).toEqual(initialText);
        });


        test('USP never has more than one active slide', async ({page}) => {
            await page.setViewportSize({width: 375, height: 667});

            const next = usp.locator('[data-usp-next]');
            const prev = usp.locator('[data-usp-prev]');

            for (let i = 0; i < 5; i++) {
                await next.click();
                await expect(usp.locator('[data-usp-active="true"]')).toHaveCount(1);

                await prev.click();
                await expect(usp.locator('[data-usp-active="true"]')).toHaveCount(1);
            }
        });

        test('USP does not duplicate slides on reload', async ({page}) => {
            await expect(usp.locator('[data-usp-slide]')).toHaveCount(3);

            await page.reload();

            await expect(usp.locator('[data-usp-slide]')).toHaveCount(3);
            await expect(usp.locator('[data-usp-active="true"]')).toHaveCount(1);
        });

        test('USP supports keyboard navigation on mobile', async ({page}) => {
            await usp.focus();

            const first = await usp
                .locator('[data-usp-active="true"]')
                .first()
                .textContent();

            const next = page.locator('[data-usp-next]');
            await next.focus();
            await page.keyboard.press('ArrowRight');

            const second = await usp
                .locator('[data-usp-active="true"]')
                .first()
                .textContent();

            expect(second).not.toEqual(first);
        });
    });


    test.describe('desktop behaviour', () => {

        test.use({ viewport: { width: 1280, height: 800 } });

        test('shows all slides statically', async ({ page }) => {
            const usp = page.locator('usp-widget');
            await expect(usp.locator('[data-usp-slide]')).toHaveCount(3);
        });


        test('USP desktop mode ignores next and prev', async ({page}) => {
            const slides = usp.locator('[data-usp-slide]');
            await expect(slides).toHaveCount(3);

            // Either all active, or no active flags at all
            await expect(usp.locator('[data-usp-active="true"]')).toHaveCount(0);
        });
    });
});