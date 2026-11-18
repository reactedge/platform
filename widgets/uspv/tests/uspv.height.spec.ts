import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Slide height regression check.
 *
 * Measures, for every slide, how many pixels of its heading/text fall
 * outside the slide box (i.e. are clipped by the panel), across viewport
 * widths, text sizes (WCAG 1.4.4 resize text) and contracts.
 *
 * Used on its own it guards against clipping. Used through
 * `height-before-after.sh` it also records a labelled summary and a
 * screenshot per scenario so a "before" and an "after" run can be
 * compared side by side.
 */

const LABEL = process.env.USPV_HEIGHT_LABEL ?? "current";
const OUT_DIR = process.env.USPV_HEIGHT_OUT ?? join(tmpdir(), "uspv-height");

// Contract at the schema maximums: 30-char heading, 80-char text.
const MAX_LENGTH_CONTRACT = {
    data: {
        slides: [
            {
                heading: "Free delivery on every order!",
                text: "On all orders over fifty pounds, delivered to your door in two working days max.",
            },
            { heading: "Secure Payment", text: "100% secure checkout" },
            { text: "30-day returns" },
        ],
    },
    settings: { timer: 60000, theme: "light" },
};

const SCENARIOS = [
    { name: "320px", width: 320, textScale: 1 },
    { name: "375px", width: 375, textScale: 1 },
    { name: "1280px", width: 1280, textScale: 1 },
    { name: "375px-text-200pct", width: 375, textScale: 2 },
    { name: "1280px-text-200pct", width: 1280, textScale: 2 },
];

const CONTRACTS = ["default", "max-length"] as const;

interface SlideMeasurement {
    slideHeight: number;
    clippedPx: number;
}

async function mountContract(page: Page, contract: (typeof CONTRACTS)[number]): Promise<string> {
    if (contract === "default") {
        return "uspv-widget";
    }

    await page.evaluate((payload) => {
        const host = document.createElement("uspv-widget");
        host.id = "uspv-height-max";
        document.body.appendChild(host);
        const api = (window as unknown as Record<string, { mount: (el: HTMLElement, c: unknown) => void }>)
            .ReactEdge_uspv;
        api!.mount(host, payload);
    }, MAX_LENGTH_CONTRACT);

    return "#uspv-height-max";
}

async function measureSlides(page: Page, root: string): Promise<SlideMeasurement[]> {
    return page.locator(root).evaluate((host) =>
        [...host.querySelectorAll<HTMLElement>("[data-uspv-slide]")].map((slide) => {
            const box = slide.getBoundingClientRect();
            const parts = [...slide.children].map((child) => child.getBoundingClientRect());
            const overflowBottom = Math.max(0, ...parts.map((part) => part.bottom - box.bottom));
            const overflowTop = Math.max(0, ...parts.map((part) => box.top - part.top));

            return {
                slideHeight: Math.round(box.height),
                clippedPx: Math.round(overflowTop + overflowBottom),
            };
        })
    );
}

for (const contract of CONTRACTS) {
    for (const scenario of SCENARIOS) {
        test(`USPV slides are not clipped: ${contract} contract @ ${scenario.name}`, async ({ page }) => {
            await page.setViewportSize({ width: scenario.width, height: 800 });
            await page.goto("/?reactedge_debug=eager");
            await expect(page.locator("uspv-widget").first()).toBeVisible();

            const root = await mountContract(page, contract);
            const panel = page.locator(`${root} [data-uspv-widget]`);
            await expect(panel).toBeVisible();

            if (scenario.textScale !== 1) {
                await page.addStyleTag({ content: `html { font-size: ${scenario.textScale * 100}%; }` });
            }

            const slides = await measureSlides(page, root);
            const id = `${LABEL}-${contract}-${scenario.name}`;

            mkdirSync(OUT_DIR, { recursive: true });
            const box = (await panel.boundingBox())!;
            await page.screenshot({
                path: join(OUT_DIR, `${id}.png`),
                clip: { x: 0, y: Math.max(0, box.y - 8), width: scenario.width, height: box.height + 16 },
            });
            writeFileSync(
                join(OUT_DIR, `${id}.json`),
                JSON.stringify({ label: LABEL, contract, scenario: scenario.name, panelHeight: Math.round(box.height), slides })
            );

            expect(slides.map((slide) => slide.clippedPx)).toEqual(slides.map(() => 0));
        });
    }
}
