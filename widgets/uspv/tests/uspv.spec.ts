import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

// Matches settings.timer in public/default.json.
const TIMER_MS = 5000;

const activeText = async (uspv: Locator): Promise<string | null> =>
    uspv.locator('[data-uspv-active="true"]').first().textContent();

for (const viewport of [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1280, height: 800 },
]) test.describe(`USPV Widget (${viewport.name})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    let uspv: Locator;

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        uspv = page.locator('uspv-widget');
        await expect(uspv).toBeVisible();
    });

    test('USPV widget renders its labelled panel', async () => {
        const panel = uspv.locator('[data-uspv-widget]');

        await expect(panel).toBeVisible();
        await expect(panel).toHaveAttribute(
            'aria-label',
            'Unique selling points'
        );
    });

    test('USPV widget finds its slides in a list', async () => {
        const list = uspv.locator('ul[data-uspv-list]');

        await expect(list).toHaveCount(1);
        await expect(uspv.locator('[data-uspv-slide]')).toHaveCount(3);
        await expect(uspv.locator('[data-uspv-text]').first()).toHaveText(/\S+/);
    });

    test('USPV displays exactly one slide at a time', async () => {
        const panel = uspv.locator('[data-uspv-widget]');
        const slides = uspv.locator('[data-uspv-slide]');

        await expect(uspv.locator('[data-uspv-active="true"]')).toHaveCount(1);

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

    test('USPV timer advances the slides automatically', async () => {
        await expect(uspv.locator('[data-uspv-widget]'))
            .toHaveAttribute('data-uspv-autoplay', 'on');

        const first = await activeText(uspv);

        await expect
            .poll(() => activeText(uspv), { timeout: TIMER_MS * 2 })
            .not.toEqual(first);

        await expect(uspv.locator('[data-uspv-active="true"]')).toHaveCount(1);
    });

    test('USPV shows one arrow on the left and one on the right', async () => {
        const panelBox = (await uspv.locator('[data-uspv-widget]').boundingBox())!;
        const prev = uspv.locator('[data-uspv-prev]');
        const next = uspv.locator('[data-uspv-next]');

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

    test('USPV next arrow activates the next slide', async () => {
        const first = await activeText(uspv);

        await uspv.locator('[data-uspv-next]').click();

        expect(await activeText(uspv)).not.toEqual(first);
    });

    test('USPV previous arrow returns to the previous slide', async () => {
        const first = await activeText(uspv);

        await uspv.locator('[data-uspv-next]').click();
        await uspv.locator('[data-uspv-prev]').click();

        expect(await activeText(uspv)).toEqual(first);
    });

    test('USPV arrow use stops the timer for manual navigation', async ({ page }) => {
        await uspv.locator('[data-uspv-next]').click();

        await expect(uspv.locator('[data-uspv-widget]'))
            .toHaveAttribute('data-uspv-autoplay', 'off');

        const chosen = await activeText(uspv);

        await page.waitForTimeout(TIMER_MS * 1.5);

        expect(await activeText(uspv)).toEqual(chosen);
    });

    test('USPV supports keyboard navigation on the arrows', async ({ page }) => {
        const first = await activeText(uspv);

        await uspv.locator('[data-uspv-next]').focus();
        await page.keyboard.press('ArrowRight');

        expect(await activeText(uspv)).not.toEqual(first);
        await expect(uspv.locator('[data-uspv-widget]'))
            .toHaveAttribute('data-uspv-autoplay', 'off');
    });

    test('USPV pauses the timer while focus is inside the widget', async ({ page }) => {
        const panel = uspv.locator('[data-uspv-widget]');

        await uspv.locator('[data-uspv-prev]').focus();
        await expect(panel).toHaveAttribute('data-uspv-paused', 'true');

        const focused = await activeText(uspv);

        // Moving focus between the two arrows keeps the widget paused.
        await page.keyboard.press('Tab');
        await expect(uspv.locator('[data-uspv-next]')).toBeFocused();
        await expect(panel).toHaveAttribute('data-uspv-paused', 'true');

        await page.waitForTimeout(TIMER_MS * 1.5);

        expect(await activeText(uspv)).toEqual(focused);
        // Focus alone pauses; it does not stop autoplay for good.
        await expect(panel).toHaveAttribute('data-uspv-autoplay', 'on');
    });

    test('USPV resumes the timer when focus leaves the widget', async () => {
        const panel = uspv.locator('[data-uspv-widget]');
        const prev = uspv.locator('[data-uspv-prev]');

        await prev.focus();
        await expect(panel).toHaveAttribute('data-uspv-paused', 'true');

        await prev.blur();
        await expect(panel).toHaveAttribute('data-uspv-paused', 'false');

        const resumed = await activeText(uspv);

        await expect
            .poll(() => activeText(uspv), { timeout: TIMER_MS * 2 })
            .not.toEqual(resumed);
    });

    test('USPV does not duplicate slides on reload', async ({ page }) => {
        await expect(uspv.locator('[data-uspv-slide]')).toHaveCount(3);

        await page.reload();

        await expect(uspv.locator('[data-uspv-slide]')).toHaveCount(3);
        await expect(uspv.locator('[data-uspv-active="true"]')).toHaveCount(1);
    });
});

test.describe('USPV translations', () => {
    const mountContract = async (page: Page, id: string, contract: unknown) => {
        await page.evaluate(({ hostId, payload }) => {
            const host = document.createElement('uspv-widget');
            host.id = hostId;
            document.body.appendChild(host);
            const api = (window as unknown as Record<string, { mount: (el: HTMLElement, c: unknown) => void }>)
                .ReactEdge_uspv;
            api!.mount(host, payload);
        }, { hostId: id, payload: contract });

        const widget = page.locator(`#${id}`);
        await expect(widget.locator('[data-uspv-widget]')).toBeVisible();
        return widget;
    };

    test.beforeEach(async ({ page }) => {
        await page.goto('/?reactedge_debug=eager');
        await expect(page.locator('uspv-widget').first()).toBeVisible();
    });

    test('USPV uses English labels when the contract has no translations', async ({ page }) => {
        const uspv = page.locator('uspv-widget').first();

        await expect(uspv.getByRole('region', { name: 'Unique selling points' })).toBeVisible();
        await expect(uspv.getByRole('button', { name: 'Previous selling point' })).toBeVisible();
        await expect(uspv.getByRole('button', { name: 'Next selling point' })).toBeVisible();
        await expect(uspv.getByRole('listitem', { name: '1 of 3' })).toBeAttached();
    });

    test('USPV applies the translations from the fr.json contract', async ({ page }) => {
        const contract = await (await page.request.get('/fr.json')).json();
        const uspv = await mountContract(page, 'uspv-fr', contract);

        await expect(uspv.getByRole('region', { name: 'Nos engagements' })).toBeVisible();
        await expect(uspv.getByRole('button', { name: 'Argument précédent' })).toBeVisible();
        await expect(uspv.getByRole('button', { name: 'Argument suivant' })).toBeVisible();
        await expect(uspv.getByRole('listitem', { name: '1 sur 3' })).toBeAttached();
        await expect(uspv.locator('[data-uspv-active="true"]')).toContainText('Livraison offerte');

        await uspv.getByRole('button', { name: 'Argument suivant' }).click();
        await expect(uspv.getByRole('listitem', { name: '2 sur 3' })).toHaveAttribute('data-uspv-active', 'true');
    });

    test('USPV falls back to English for keys missing from translations', async ({ page }) => {
        const uspv = await mountContract(page, 'uspv-partial', {
            data: { slides: [{ text: 'Un' }, { text: 'Deux' }] },
            settings: { timer: 60000, theme: 'light' },
            translations: { 'Next selling point': 'Argument suivant' },
        });

        await expect(uspv.getByRole('button', { name: 'Argument suivant' })).toBeVisible();
        await expect(uspv.getByRole('button', { name: 'Previous selling point' })).toBeVisible();
        await expect(uspv.getByRole('listitem', { name: '1 of 2' })).toBeAttached();
    });
});
