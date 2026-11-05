import {test, expect} from '@playwright/test';
import type { Locator } from "@playwright/test";
import {WIDGET_ID} from "../src/bootstrap/config/Config.ts";

test.describe('Banner Widget', () => {
    let widget;

    test.beforeEach(async ({page}) => {
        await page.goto('/?reactedge_debug=eager');
        widget = page.locator(`${WIDGET_ID}-widget`);
        await expect(widget).toBeVisible();
    });

    test('Banner widget finds its slides', async () => {
        await expectSlidesToBeVisible(widget);
    });

    test.describe('mobile behaviour', () => {

        test.use({ viewport: { width: 375, height: 667 } });

        test('Banner next button activates next image on mobile', async () => {
            const activeBefore = widget.locator('[data-banner-active="true"]');
            await expect(activeBefore).toHaveCount(1);

            const imgBefore = activeBefore.locator('img');
            const srcBefore = await imgBefore.getAttribute('src');

            const nextButton = widget.locator('[data-banner-next]');
            await expect(nextButton).toBeVisible();
            await nextButton.click();

            const activeAfter = widget.locator('[data-banner-active="true"]');
            await expect(activeAfter).toHaveCount(1);

            const imgAfter = activeAfter.locator('img');
            const srcAfter = await imgAfter.getAttribute('src');

            expect(srcAfter).not.toBe(srcBefore);
        });



        test('Banner previous button activates the previous slide on mobile', async () => {
            const nextButton = widget.locator('[data-banner-next]');
            const prevButton = widget.locator('[data-banner-prev]');

            await expect(nextButton).toBeVisible();
            await expect(prevButton).toBeVisible();

            // Capture initial active slide
            const initialActive = widget.locator('[data-banner-active="true"]');
            await expect(initialActive).toHaveCount(1);
            const initialImg = initialActive.locator('img');
            const initialSrc = await initialImg.getAttribute('src');

            // Go forward once
            await nextButton.click();

            const afterNext = widget.locator('[data-banner-active="true"]');
            await expect(afterNext).toHaveCount(1);
            const nextImg = afterNext.locator('img');
            const nextSrc = await nextImg.getAttribute('src');

            expect(nextSrc).not.toEqual(initialSrc);

            // Go back
            await prevButton.click();

            const afterPrev = widget.locator('[data-banner-active="true"]');
            await expect(afterPrev).toHaveCount(1);
            const prevImg = afterPrev.locator('img');
            const prevSrc = await prevImg.getAttribute('src');

            // We must be back on the original slide
            expect(initialSrc).toEqual(prevSrc);
        });


        test('Banner never has more than one active slide', async () => {
            await page.setViewportSize({width: 375, height: 667});

            const next = widget.locator('[data-banner-next]');
            const prev = widget.locator('[data-banner-prev]');

            for (let i = 0; i < 5; i++) {
                await next.click();
                await expect(widget.locator('[data-banner-active="true"]')).toHaveCount(1);

                await prev.click();
                await expect(widget.locator('[data-banner-active="true"]')).toHaveCount(1);
            }
        });

        test('Banner does not duplicate slides on reload', async ({page}) => {
            await expectSlidesToBeVisible(widget);

            await page.reload();

            await expectSlidesToBeVisible(widget);
            await expect(widget.locator('[data-banner-active="true"]')).toHaveCount(1);
        });

        test('Banner supports keyboard navigation on mobile', async () => {
            await widget.focus();

            const first = await widget
                .locator('[data-banner-active="true"]')
                .first();

            const next = page.locator('[data-banner-next]');
            await next.focus();
            await page.keyboard.press('ArrowRight');

            const second = await widget
                .locator('[data-banner-active="true"]')
                .first();

            expect(second).not.toEqual(first);
        });
    });


    test.describe('desktop behaviour', () => {

        test.use({ viewport: { width: 1280, height: 800 } });

        test('shows all slides statically', async ({ page }) => {
            const banner = page.locator('banner-widget');
            await expectSlidesToBeVisible(banner);
        });


        test('Banner desktop mode ignores next and prev', async () => {
            await expectSlidesToBeVisible(widget);

            // Either all active, or no active flags at all
            await expect(widget.locator('[data-banner-active="true"]')).toHaveCount(0);
        });
    });
});

async function expectSlidesToBeVisible(
    banner: Locator
): Promise<void> {
    const slides = banner.locator('[data-banner-slide]');
    await expect(slides.first()).toBeVisible();
}