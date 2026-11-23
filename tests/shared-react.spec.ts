import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const requireFromRoot = createRequire(resolve("package.json"));
const version = (requireFromRoot("react/package.json") as { version: string }).version;
const vendor = `react-shared@${version}.iife.js`;
const root = resolve(process.env.REACTEDGE_RELEASE_SOURCE ?? "workspace/release/source");
const widgets = readdirSync("widgets").filter(hasBrowserBuild);

interface Manifest {
    version: string;
    filename: string;
    cssFilename: string;
    integrity: string;
}

function hasBrowserBuild(widget: string): boolean {
    const directory = resolve("widgets", widget);
    return existsSync(resolve(directory, "vite.config.ts")) ||
        existsSync(resolve(directory, "vite_project/vite.config.ts"));
}

const mountScripts = new Map([
    ["usp", `
    ReactEdge_usp.mount(document.querySelector("usp-widget"), {
        data: { slides: [{ text: "Free delivery" }, { text: "Easy returns" }] },
        settings: { timer: 60000 }
    });
    `],
    ["categoryfaq", `
    ReactEdge_categoryfaq.mount(document.querySelector("categoryfaq-widget"), {
        data: { title: "Frequently asked questions", faqs: [] },
        settings: { colour: "#1f2937" }
    }, [{ question: "How do I choose a size?", answer: "Use the size guide." }]);
    `],
]);

function widgetTags(widget: string, manifest: Manifest): string {
    const stylesheet = mountScripts.has(widget)
        ? `<link rel="stylesheet" href="/${widget}/${manifest.cssFilename}">`
        : "";
    return `
        ${stylesheet}
        <script defer src="/${widget}/${manifest.filename}" integrity="${manifest.integrity}"></script>
    `;
}

test("the production bundles use one shared React runtime", async ({ page }) => {
    const mountScript = widgets.map((widget) => mountScripts.get(widget)).join("\n");
    const tags = await Promise.all(widgets.map(async (widget) => {
        const path = resolve(root, widget, `widget-${widget}.manifest.json`);
        const manifest = JSON.parse(await readFile(path, "utf8")) as Manifest;
        expect(manifest.filename).toBe(`widget-${widget}@${manifest.version}.iife.js`);
        const bundle = await readFile(resolve(root, widget, manifest.filename), "utf8");
        expect(bundle).toContain("ReactEdgeSharedReact");
        return widgetTags(widget, manifest);
    }));
    const html = `<!doctype html>
        <script defer src="/${vendor}"></script>
        ${tags.join("\n")}
        <script defer src="/mount.js"></script>
        <usp-widget></usp-widget>
        <categoryfaq-widget></categoryfaq-widget>`;
    const errors: Error[] = [];
    const vendorRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error));
    page.on("request", (request) => {
        if (new URL(request.url()).pathname === `/${vendor}`) vendorRequests.push(request.url());
    });
    await page.route("https://reactedge.test/**", async (route) => {
        const pathname = new URL(route.request().url()).pathname;
        if (pathname === "/") {
            return route.fulfill({
                contentType: "text/html",
                headers: { "Content-Security-Policy": "script-src 'self'; style-src 'self' 'unsafe-inline'" },
                body: html,
            });
        }
        if (pathname === "/mount.js") {
            return route.fulfill({ contentType: "application/javascript", body: mountScript });
        }
        return route.fulfill({ path: resolve(root, pathname.slice(1)) });
    });

    await page.goto("https://reactedge.test/");
    const registered = await page.evaluate((widgetNames) => {
        const globals = window as unknown as Record<string, { mount?: unknown }>;
        return widgetNames.filter((name) => typeof globals[`ReactEdge_${name}`]?.mount === "function");
    }, widgets);
    expect(registered).toEqual(widgets);
    if (widgets.includes("usp")) {
        const usp = page.locator("usp-widget");
        await expect(usp.locator('[data-usp-active="true"]')).toContainText("Free delivery");
        await usp.getByRole("button", { name: "Next selling point" }).click();
        await expect(usp.locator('[data-usp-active="true"]')).toContainText("Easy returns");
    }

    if (widgets.includes("categoryfaq")) {
        const faq = page.locator("categoryfaq-widget");
        await expect(faq.getByRole("heading")).toHaveText("Frequently asked questions");
        await faq.getByText("How do I choose a size?").click();
        await expect(faq.getByText("Use the size guide.")).toBeVisible();
    }

    expect(vendorRequests).toHaveLength(1);
    expect(errors).toEqual([]);
});
