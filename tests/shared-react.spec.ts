import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const requireFromRoot = createRequire(resolve("package.json"));
const version = (requireFromRoot("react/package.json") as { version: string }).version;
const vendor = `react-shared@${version}.iife.js`;
const root = resolve("workspace/release/pilot/shared-react");
const widgets = ["usp", "categoryfaq"] as const;

interface Manifest {
    filename: string;
    cssFilename: string;
    integrity: string;
}

const mountScript = `
    ReactEdge_usp.mount(document.querySelector("usp-widget"), {
        data: { slides: [{ text: "Free delivery" }, { text: "Easy returns" }] },
        settings: { timer: 60000 }
    });
    ReactEdge_categoryfaq.mount(document.querySelector("categoryfaq-widget"), {
        data: { title: "Frequently asked questions", faqs: [] },
        settings: { colour: "#1f2937" }
    }, [{ question: "How do I choose a size?", answer: "Use the size guide." }]);
`;

function widgetTags(widget: string, manifest: Manifest): string {
    return `
        <link rel="stylesheet" href="/${widget}/${manifest.cssFilename}">
        <script defer src="/${widget}/${manifest.filename}" integrity="${manifest.integrity}"></script>
    `;
}

test("the production widgets mount and interact with one shared React script", async ({ page }) => {
    const tags = await Promise.all(widgets.map(async (widget) => {
        const path = resolve(root, widget, `widget-${widget}.manifest.json`);
        const manifest = JSON.parse(await readFile(path, "utf8")) as Manifest;
        expect(manifest.filename).toMatch(/\.shared-react\.iife\.js$/);
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
    const usp = page.locator("usp-widget");
    await expect(usp.locator('[data-usp-active="true"]')).toContainText("Free delivery");
    await usp.getByRole("button", { name: "Next selling point" }).click();
    await expect(usp.locator('[data-usp-active="true"]')).toContainText("Easy returns");

    const faq = page.locator("categoryfaq-widget");
    await expect(faq.getByRole("heading")).toHaveText("Frequently asked questions");
    await faq.getByText("How do I choose a size?").click();
    await expect(faq.getByText("Use the size guide.")).toBeVisible();

    expect(vendorRequests).toHaveLength(1);
    expect(errors).toEqual([]);
});
