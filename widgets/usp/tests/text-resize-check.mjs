/* global console, process, document, window */

/**
 * USP slide-height verification.
 *
 * Measures how much slide content is cut off by the panel at several
 * viewport widths, text sizes and contract lengths, so that the
 * `height: 45px` -> `min-height: 45px` change can be compared before
 * and after.
 *
 * Usage (from the repository root, with the widget dev server running
 * through `mise run widget-dev -- usp`):
 *
 *   node widgets/usp/tests/text-resize-check.mjs --label before
 *   # apply or revert the change, restart nothing, then:
 *   node widgets/usp/tests/text-resize-check.mjs --label after
 *   node widgets/usp/tests/text-resize-check.mjs --compare
 *
 * Results and screenshots are written to widgets/usp/tests/.measurements/.
 * Options: --label <name> --base-url <url> --browser <executable path>
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const OUTPUT_DIR = resolve(
    dirname(fileURLToPath(import.meta.url)),
    ".measurements"
);

const LONG_SLIDES = [
    {
        heading: "HHHHHHHHHH Free Delivery Now",
        text: "On all orders over fifty pounds, delivered to your door in two working days max.",
    },
    { heading: "Secure Payment", text: "100% secure checkout" },
    { text: "30-day returns" },
];

const CASES = [
    { name: "default contract, 320px", width: 320, textScale: 1, long: false },
    { name: "default contract, 375px", width: 375, textScale: 1, long: false },
    { name: "default contract, 375px, 200% text", width: 375, textScale: 2, long: false },
    { name: "default contract, 1280px", width: 1280, textScale: 1, long: false },
    { name: "max-length contract, 320px", width: 320, textScale: 1, long: true },
    { name: "max-length contract, 375px", width: 375, textScale: 1, long: true },
    { name: "max-length contract, 375px, 200% text", width: 375, textScale: 2, long: true },
    { name: "max-length contract, 1280px", width: 1280, textScale: 1, long: true },
];

function readOptions(argv) {
    const value = flag => {
        const index = argv.indexOf(flag);
        return index === -1 ? undefined : argv[index + 1];
    };

    return {
        label: value("--label") ?? "run",
        baseUrl: value("--base-url") ?? "http://localhost:5173",
        browser: value("--browser"),
        compare: argv.includes("--compare"),
    };
}

/** Measures clipped pixels and arrow overlap for the active slide. */
function measureSlide() {
    const panel = document.querySelector("[data-usp-widget]");
    const slide = document.querySelector('[data-usp-active="true"]');
    const panelBox = panel.getBoundingClientRect();
    const slideBox = slide.getBoundingClientRect();
    const parts = [...slide.children].map(child => child.getBoundingClientRect());

    const clipped = Math.max(
        0,
        ...parts.map(part => part.bottom - panelBox.bottom),
        ...parts.map(part => panelBox.top - part.top)
    );

    const arrows = [
        document.querySelector("[data-usp-prev]"),
        document.querySelector("[data-usp-next]"),
    ].filter(Boolean).map(arrow => arrow.getBoundingClientRect());

    const overlaps = parts.some(part =>
        arrows.some(arrow =>
            part.left < arrow.right && part.right > arrow.left &&
            part.top < arrow.bottom && part.bottom > arrow.top
        )
    );

    return {
        panelHeight: Math.round(panelBox.height),
        slideHeight: Math.round(slideBox.height),
        contentHeight: slide.scrollHeight,
        clippedPx: Math.round(clipped),
        textUnderArrow: overlaps,
        horizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
    };
}

async function runCase(browser, options, testCase) {
    const page = await browser.newPage({
        viewport: { width: testCase.width, height: 700 },
    });

    await page.goto(`${options.baseUrl}/?reactedge_debug=eager`);
    await page.waitForSelector("[data-usp-widget]");

    if (testCase.long) {
        await page.evaluate(slides => {
            const host = document.querySelector("usp-widget");
            host.replaceChildren();
            window.ReactEdge_usp.mount(host, {
                data: { slides },
                settings: { timer: 60000, theme: "light" },
            });
        }, LONG_SLIDES);
        await page.waitForSelector('[data-usp-active="true"]');
    }

    if (testCase.textScale !== 1) {
        await page.addStyleTag({
            content: `html { font-size: ${testCase.textScale * 100}% }`,
        });
    }

    await page.waitForTimeout(150);
    const measured = await page.evaluate(measureSlide);
    const box = await page.locator("[data-usp-widget]").boundingBox();

    await page.screenshot({
        path: resolve(
            OUTPUT_DIR,
            `${options.label}-${testCase.name.replace(/[^\w]+/g, "-")}.png`
        ),
        clip: {
            x: 0,
            y: Math.max(0, box.y - 8),
            width: Math.min(testCase.width, 900),
            height: box.height + 16,
        },
    });

    await page.close();
    return { case: testCase.name, ...measured };
}

function print(rows, title) {
    console.log(`\n${title}`);
    console.table(rows);
}

function compare() {
    const load = label => {
        const path = resolve(OUTPUT_DIR, `${label}.json`);
        if (!existsSync(path)) {
            throw new Error(`Missing measurements: run with --label ${label} first`);
        }
        return JSON.parse(readFileSync(path, "utf8"));
    };

    const before = load("before");
    const after = load("after");

    print(before.map((row, index) => ({
        case: row.case,
        "clipped before": row.clippedPx,
        "clipped after": after[index]?.clippedPx,
        "panel before": row.panelHeight,
        "panel after": after[index]?.panelHeight,
        "under arrow before": row.textUnderArrow,
        "under arrow after": after[index]?.textUnderArrow,
    })), "USP slide height: before vs after");
}

async function main() {
    const options = readOptions(process.argv.slice(2));
    mkdirSync(OUTPUT_DIR, { recursive: true });

    if (options.compare) {
        compare();
        return;
    }

    const browser = await chromium.launch(
        options.browser ? { executablePath: options.browser } : {}
    );
    const rows = [];

    for (const testCase of CASES) {
        rows.push(await runCase(browser, options, testCase));
    }

    await browser.close();
    writeFileSync(
        resolve(OUTPUT_DIR, `${options.label}.json`),
        JSON.stringify(rows, null, 2)
    );
    print(rows, `USP slide height measurements (${options.label})`);
}

await main();
