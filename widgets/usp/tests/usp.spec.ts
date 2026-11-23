import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

// Matches settings.timer in public/default.json.
const TIMER_MS = 5000;

const activeText = async (usp: Locator): Promise<string | null> =>
    usp.locator('[data-usp-active="true"]').first().textContent();

for (const viewport of [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1280, height: 800 },
]) test.describe(`USP Widget (${viewport.name})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    let usp: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        usp = page.locator('usp-widget');
        await expect(usp).toBeVisible();
    });

    test('USP widget renders its labelled panel', async () => {
        const panel = usp.locator('[data-usp-widget]');

        await expect(panel).toBeVisible();
        await expect(panel).toHaveAttribute(
            'aria-label',
            'Unique selling points'
        );
    });

    test('USP widget finds its slides in a list', async () => {
        const list = usp.locator('ul[data-usp-list]');

        await expect(list).toHaveCount(1);
        await expect(usp.locator('[data-usp-slide]')).toHaveCount(3);
        await expect(usp.locator('[data-usp-text]').first()).toHaveText(/\S+/);
    });

    test('USP displays exactly one slide at a time', async () => {
        const panel = usp.locator('[data-usp-widget]');
        const slides = usp.locator('[data-usp-slide]');

        await expect(usp.locator('[data-usp-active="true"]')).toHaveCount(1);

        const panelBox = (await panel.boundingBox())!;
        let inside = 0;

        for (let i = 0; i < 3; i++) {
            const box = (await slides.nth(i).boundingBox())!;
            const left = Math.max(box.x, panelBox.x);
            const right = Math.min(box.x + box.width, panelBox.x + panelBox.width);

            if (right - left > box.width / 2) {
                inside++;
            }
        }

        expect(inside).toBe(1);
    });

    test('USP timer advances the slides automatically', async () => {
        await expect(usp.locator('[data-usp-widget]'))
            .toHaveAttribute('data-usp-autoplay', 'on');

        const first = await activeText(usp);

        await expect
            .poll(() => activeText(usp), { timeout: TIMER_MS * 2 })
            .not.toEqual(first);

        await expect(usp.locator('[data-usp-active="true"]')).toHaveCount(1);
    });

    test('USP shows one arrow on the left and one on the right', async () => {
        const panelBox = (await usp.locator('[data-usp-widget]').boundingBox())!;
        const prev = usp.locator('[data-usp-prev]');
        const next = usp.locator('[data-usp-next]');

        await expect(prev).toBeVisible();
        await expect(next).toBeVisible();

        const prevBox = (await prev.boundingBox())!;
        const nextBox = (await next.boundingBox())!;
        const panelCentreX = panelBox.x + panelBox.width / 2;
        const panelCentreY = panelBox.y + panelBox.height / 2;

        expect(prevBox.x + prevBox.width).toBeLessThan(panelCentreX);
        expect(nextBox.x).toBeGreaterThan(panelCentreX);
        expect(prevBox.y + prevBox.height / 2).toBeCloseTo(panelCentreY, -1);
        expect(nextBox.y + nextBox.height / 2).toBeCloseTo(panelCentreY, -1);
    });

    test('USP next arrow activates the next slide', async () => {
        const first = await activeText(usp);

        await usp.locator('[data-usp-next]').click();

        expect(await activeText(usp)).not.toEqual(first);
    });

    test('USP previous arrow returns to the previous slide', async () => {
        const first = await activeText(usp);

        await usp.locator('[data-usp-next]').click();
        await usp.locator('[data-usp-prev]').click();

        expect(await activeText(usp)).toEqual(first);
    });

    test('USP arrow use stops the timer for manual navigation', async ({ page }) => {
        await usp.locator('[data-usp-next]').click();

        await expect(usp.locator('[data-usp-widget]'))
            .toHaveAttribute('data-usp-autoplay', 'off');

        const chosen = await activeText(usp);

        await page.waitForTimeout(TIMER_MS * 1.5);

        expect(await activeText(usp)).toEqual(chosen);
    });

    test('USP supports keyboard navigation on the arrows', async ({ page }) => {
        const first = await activeText(usp);

        await usp.locator('[data-usp-next]').focus();
        await page.keyboard.press('ArrowRight');

        expect(await activeText(usp)).not.toEqual(first);
        await expect(usp.locator('[data-usp-widget]'))
            .toHaveAttribute('data-usp-autoplay', 'off');
    });

    test('USP pauses the timer while focus is inside the widget', async ({ page }) => {
        const panel = usp.locator('[data-usp-widget]');

        await usp.locator('[data-usp-prev]').focus();
        await expect(panel).toHaveAttribute('data-usp-paused', 'true');

        const focused = await activeText(usp);

        // Moving focus between the two arrows keeps the widget paused.
        await page.keyboard.press('Tab');
        await expect(usp.locator('[data-usp-next]')).toBeFocused();
        await expect(panel).toHaveAttribute('data-usp-paused', 'true');

        await page.waitForTimeout(TIMER_MS * 1.5);

        expect(await activeText(usp)).toEqual(focused);
        // Focus alone pauses; it does not stop autoplay for good.
        await expect(panel).toHaveAttribute('data-usp-autoplay', 'on');
    });

    test('USP resumes the timer when focus leaves the widget', async () => {
        const panel = usp.locator('[data-usp-widget]');
        const prev = usp.locator('[data-usp-prev]');

        await prev.focus();
        await expect(panel).toHaveAttribute('data-usp-paused', 'true');

        await prev.blur();
        await expect(panel).toHaveAttribute('data-usp-paused', 'false');

        const resumed = await activeText(usp);

        await expect
            .poll(() => activeText(usp), { timeout: TIMER_MS * 2 })
            .not.toEqual(resumed);
    });

    test('USP does not duplicate slides on reload', async ({ page }) => {
        await expect(usp.locator('[data-usp-slide]')).toHaveCount(3);

        await page.reload();

        await expect(usp.locator('[data-usp-slide]')).toHaveCount(3);
        await expect(usp.locator('[data-usp-active="true"]')).toHaveCount(1);
    });
});

test.describe('USP contracts', () => {
    const mountContract = async (page: Page, id: string, contract: unknown) => {
        await page.evaluate(({ hostId, payload }) => {
            const host = document.createElement('usp-widget');
            host.id = hostId;
            document.body.appendChild(host);
            const api = (window as unknown as Record<string, { mount: (el: HTMLElement, c: unknown) => void }>)
                .ReactEdge_usp;
            api!.mount(host, payload);
        }, { hostId: id, payload: contract });

        const widget = page.locator(`#${id}`);
        await expect(widget.locator('[data-usp-widget]')).toBeVisible();
        return widget;
    };

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        await expect(page.locator('usp-widget').first()).toBeVisible();
    });

    test('USP uses English labels when the contract has no translations', async ({ page }) => {
        const usp = page.locator('usp-widget').first();

        await expect(usp.getByRole('region', { name: 'Unique selling points' })).toBeVisible();
        await expect(usp.getByRole('button', { name: 'Previous selling point' })).toBeVisible();
        await expect(usp.getByRole('button', { name: 'Next selling point' })).toBeVisible();
        await expect(usp.getByRole('listitem', { name: '1 of 3' })).toBeAttached();
    });

    test('USP uses the carousel with an existing per-device layout contract', async ({ page }) => {
        const usp = await mountContract(page, 'usp-legacy', {
            data: { slides: [{ text: 'Free delivery' }, { text: 'Easy returns' }] },
            settings: { mode: { desktop: 'static', tablet: 'slider', mobile: 'slider' } },
        });

        await expect(usp.locator('[data-usp-widget]')).toHaveAttribute('data-usp-theme', 'light');
        await expect(usp.locator('[data-usp-active="true"]')).toContainText('Free delivery');
        await usp.getByRole('button', { name: 'Next selling point' }).click();
        await expect(usp.locator('[data-usp-active="true"]')).toContainText('Easy returns');
    });

    test('USP applies the translations from the fr.json contract', async ({ page }) => {
        const contract = await (await page.request.get('/fr.json')).json();
        const usp = await mountContract(page, 'usp-fr', contract);

        await expect(usp.getByRole('region', { name: 'Nos engagements' })).toBeVisible();
        await expect(usp.getByRole('button', { name: 'Argument précédent' })).toBeVisible();
        await expect(usp.getByRole('button', { name: 'Argument suivant' })).toBeVisible();
        await expect(usp.getByRole('listitem', { name: '1 sur 3' })).toBeAttached();
        await expect(usp.locator('[data-usp-active="true"]')).toContainText('Livraison offerte');

        await usp.getByRole('button', { name: 'Argument suivant' }).click();
        await expect(usp.getByRole('listitem', { name: '2 sur 3' })).toHaveAttribute('data-usp-active', 'true');
    });

    test('USP falls back to English for keys missing from translations', async ({ page }) => {
        const usp = await mountContract(page, 'usp-partial', {
            data: { slides: [{ text: 'Un' }, { text: 'Deux' }] },
            settings: { timer: 60000, theme: 'light' },
            translations: { 'Next selling point': 'Argument suivant' },
        });

        await expect(usp.getByRole('button', { name: 'Argument suivant' })).toBeVisible();
        await expect(usp.getByRole('button', { name: 'Previous selling point' })).toBeVisible();
        await expect(usp.getByRole('listitem', { name: '1 of 2' })).toBeAttached();
    });
});
