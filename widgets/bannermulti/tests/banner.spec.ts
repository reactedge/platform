import { test, expect } from '@playwright/test';

test.describe('Banner Widget', () => {
    let banner;

    test.beforeEach(async ({ page }) => {
        await page.goto('/fixtures/banner.html');
        banner = page.locator('banner-widget');
        await expect(banner).toBeVisible();
    });

    test('Banner widget finds its slides', async ({ page }) => {
        const slides = banner.locator('[data-banner-slide]');

        await expect(slides).toHaveCount(3);
    });

    test.describe('mobile behaviour', () => {

        test.use({ viewport: { width: 375, height: 667 } });

        test('Banner next button activates next image on mobile', async ({ page }) => {
            const banner = page.locator('banner-widget');

            const activeBefore = banner.locator('[data-banner-active="true"]');
            await expect(activeBefore).toHaveCount(1);

            const imgBefore = activeBefore.locator('img');
            const srcBefore = await imgBefore.getAttribute('src');

            const nextButton = banner.locator('[data-banner-next]');
            await expect(nextButton).toBeVisible();
            await nextButton.click();

            const activeAfter = banner.locator('[data-banner-active="true"]');
            await expect(activeAfter).toHaveCount(1);

            const imgAfter = activeAfter.locator('img');
            const srcAfter = await imgAfter.getAttribute('src');

            expect(srcAfter).not.toBe(srcBefore);
        });



        test('Banner previous button activates the previous slide on mobile', async ({page}) => {
            const nextButton = banner.locator('[data-banner-next]');
            const prevButton = banner.locator('[data-banner-prev]');

            await expect(nextButton).toBeVisible();
            await expect(prevButton).toBeVisible();

            // Capture initial active slide
            const initialActive = banner.locator('[data-banner-active="true"]');
            await expect(initialActive).toHaveCount(1);
            const initialImg = initialActive.locator('img');
            const initialSrc = await initialImg.getAttribute('src');

            // Go forward once
            await nextButton.click();

            const afterNext = banner.locator('[data-banner-active="true"]');
            await expect(afterNext).toHaveCount(1);
            const nextImg = afterNext.locator('img');
            const nextSrc = await nextImg.getAttribute('src');

            expect(nextSrc).not.toEqual(initialSrc);

            // Go back
            await prevButton.click();

            const afterPrev = banner.locator('[data-banner-active="true"]');
            await expect(afterPrev).toHaveCount(1);
            const prevImg = afterNext.locator('img');
            const prevSrc = await prevImg.getAttribute('src');

            // We must be back on the original slide
            expect(initialSrc).toEqual(prevSrc);
        });


        test('Banner never has more than one active slide', async ({page}) => {
            await page.setViewportSize({width: 375, height: 667});

            const next = banner.locator('[data-banner-next]');
            const prev = banner.locator('[data-banner-prev]');

            for (let i = 0; i < 5; i++) {
                await next.click();
                await expect(banner.locator('[data-banner-active="true"]')).toHaveCount(1);

                await prev.click();
                await expect(banner.locator('[data-banner-active="true"]')).toHaveCount(1);
            }
        });

        test('Banner does not duplicate slides on reload', async ({page}) => {
            await expect(banner.locator('[data-banner-slide]')).toHaveCount(3);

            await page.reload();

            await expect(banner.locator('[data-banner-slide]')).toHaveCount(3);
            await expect(banner.locator('[data-banner-active="true"]')).toHaveCount(1);
        });

        test('Banner supports keyboard navigation on mobile', async ({page}) => {
            await banner.focus();

            const first = await banner
                .locator('[data-banner-active="true"]')
                .first();
            const firstImg = first.locator('img');
            const firstSrc = await firstImg.getAttribute('src');

            const next = page.locator('[data-banner-next]');
            await next.focus();
            await page.keyboard.press('ArrowRight');

            const second = await banner
                .locator('[data-banner-active="true"]')
                .first();
            const secondImg = second.locator('img');
            const seconSrc = await secondImg.getAttribute('src');

            expect(second).not.toEqual(first);
        });
    });


    test.describe('desktop behaviour', () => {

        test.use({ viewport: { width: 1280, height: 800 } });

        test('shows all slides statically', async ({ page }) => {
            const banner = page.locator('banner-widget');
            await expect(banner.locator('[data-banner-slide]')).toHaveCount(3);
        });


        test('Banner desktop mode ignores next and prev', async ({page}) => {
            const slides = banner.locator('[data-banner-slide]');
            await expect(slides).toHaveCount(3);

            // Either all active, or no active flags at all
            await expect(banner.locator('[data-banner-active="true"]')).toHaveCount(0);
        });
    });

    test('Banner does not make API requests', async ({ page }) => {
        page.on('request', request => {
            const type = request.resourceType();
            if (type === 'xhr' || type === 'fetch') {
                throw new Error(`Unexpected API request: ${request.url()}`);
            }
        });

        await page.goto('/fixtures/banner.html');
    });
});