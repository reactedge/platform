import test from "node:test";
import assert from "node:assert/strict";
import {
    cp,
    mkdtemp,
    mkdir,
    readFile,
    rm,
    unlink,
    writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/server";

import { registerValidateStructureTool } from "../tools/validateStructure";

type ToolHandler = (input: Record<string, unknown>) => Promise<unknown>;

type ToolRegistration = {
    name: string;
    handler: ToolHandler;
};

class RecordingServer {
    readonly tools = new Map<string, ToolRegistration>();

    registerTool(
        name: string,
        _config: unknown,
        handler: ToolHandler,
    ): void {
        this.tools.set(name, { name, handler });
    }

    asMcpServer(): McpServer {
        return this as unknown as McpServer;
    }
}

function textPayload(result: unknown): Record<string, unknown> {
    assert.ok(result && typeof result === "object");

    const content = (result as {
        content?: Array<{ type?: string; text?: string }>;
    }).content;

    assert.ok(Array.isArray(content));
    assert.equal(content.length, 1);
    assert.equal(content[0]?.type, "text");
    assert.equal(typeof content[0]?.text, "string");

    return JSON.parse(content[0]!.text!);
}

async function withTemporaryReactEdgeRoot<T>(
    callback: (root: string) => Promise<T>,
): Promise<T> {
    const root = await mkdtemp(join(tmpdir(), "reactedge-mcp-structure-"));
    const originalRoot = process.env.REACTEDGE_ROOT;

    try {
        process.env.REACTEDGE_ROOT = root;

        await mkdir(resolve(root, "packages"), { recursive: true });
        await mkdir(resolve(root, "widgets"), { recursive: true });

        await cp(
            resolve(process.cwd(), "packages/widget-template"),
            resolve(root, "packages/widget-template"),
            { recursive: true },
        );

        return await callback(root);
    } finally {
        if (originalRoot === undefined) {
            delete process.env.REACTEDGE_ROOT;
        } else {
            process.env.REACTEDGE_ROOT = originalRoot;
        }

        await rm(root, { recursive: true, force: true });
    }
}

async function createWidgetFixture(
    root: string,
    variant: "standard" | "runtime" | "runtime-shadow",
    widget: string,
): Promise<string> {
    const widgetRoot = resolve(root, "widgets", widget);

    await cp(
        resolve(root, "packages/widget-template", variant),
        widgetRoot,
        { recursive: true },
    );

    return widgetRoot;
}

async function validate(widget: string): Promise<Record<string, unknown>> {
    const server = new RecordingServer();
    registerValidateStructureTool(server.asMcpServer());

    const tool = server.tools.get("validate_structure");
    assert.ok(tool);

    return textPayload(await tool.handler({ widget }));
}

for (const variant of ["standard", "runtime", "runtime-shadow"] as const) {
    test(`validate_structure accepts an untouched ${variant} widget`, async () => {
        await withTemporaryReactEdgeRoot(async root => {
            const widget = `fixture-${variant}`;
            await createWidgetFixture(root, variant, widget);

            const result = await validate(widget);

            assert.equal(result.widget, widget);
            assert.equal(result.variant, variant);
            assert.equal(result.valid, true);
            assert.deepEqual(result.missing, []);
            assert.deepEqual(result.canonicalMissing, []);
            assert.deepEqual(result.modified, []);
        });
    });
}

test("validate_structure flags a modified canonical shared file", async () => {
    await withTemporaryReactEdgeRoot(async root => {
        const widget = "fixture-standard-modified";
        const widgetRoot = await createWidgetFixture(root, "standard", widget);
        const file = resolve(widgetRoot, "vite.config.ts");

        const current = await readFile(file, "utf8");
        await writeFile(file, `${current}\n// deliberate test mutation\n`, "utf8");

        const result = await validate(widget);

        assert.equal(result.valid, false);
        assert.ok(Array.isArray(result.modified));
        assert.ok((result.modified as string[]).includes("vite.config.ts"));
    });
});

test("validate_structure flags a missing canonical shared file", async () => {
    await withTemporaryReactEdgeRoot(async root => {
        const widget = "fixture-standard-missing-shared";
        const widgetRoot = await createWidgetFixture(root, "standard", widget);

        await unlink(resolve(widgetRoot, "src/Widget.tsx"));

        const result = await validate(widget);

        assert.equal(result.valid, false);
        assert.ok(Array.isArray(result.missing));
        assert.ok((result.missing as string[]).includes("src/Widget.tsx"));
    });
});

test("validate_structure flags a missing standard-specific required file", async () => {
    await withTemporaryReactEdgeRoot(async root => {
        const widget = "fixture-standard-missing-required";
        const widgetRoot = await createWidgetFixture(root, "standard", widget);

        await unlink(resolve(widgetRoot, "src/entrypoints/ssr.tsx"));

        const result = await validate(widget);

        assert.equal(result.valid, false);
        assert.ok(Array.isArray(result.missing));
        assert.ok((result.missing as string[]).includes("src/entrypoints/ssr.tsx"));
    });
});

test("validate_structure flags a missing runtime-specific schema", async () => {
    await withTemporaryReactEdgeRoot(async root => {
        const widget = "fixture-runtime-missing-schema";
        const widgetRoot = await createWidgetFixture(root, "runtime", widget);

        await unlink(resolve(widgetRoot, "src/ConfigSchemaRuntime.ts"));

        const result = await validate(widget);

        assert.equal(result.valid, false);
        assert.ok(Array.isArray(result.missing));
        assert.ok((result.missing as string[]).includes("src/ConfigSchemaRuntime.ts"));
    });
});

test("validate_structure flags a missing runtime-shadow runtime manifest", async () => {
    await withTemporaryReactEdgeRoot(async root => {
        const widget = "fixture-shadow-missing-runtime-manifest";
        const widgetRoot = await createWidgetFixture(root, "runtime-shadow", widget);

        await unlink(resolve(widgetRoot, "public/reactedge-runtime.json"));

        const result = await validate(widget);

        assert.equal(result.valid, false);
        assert.equal(result.variant, "runtime-shadow");
        assert.ok(Array.isArray(result.missing));
        assert.ok((result.missing as string[]).includes("public/reactedge-runtime.json"));
    });
});

test("validate_structure accepts a widget-specific runtime manifest", async () => {
    await withTemporaryReactEdgeRoot(async root => {
        const widget = "fixture-shadow-custom-runtime-manifest";
        const widgetRoot = await createWidgetFixture(root, "runtime-shadow", widget);

        await writeFile(
            resolve(widgetRoot, "public/reactedge-runtime.json"),
            JSON.stringify({ integrations: { beachfinderApi: { api: "http://127.0.0.1:4185" } } }),
            "utf8",
        );

        const result = await validate(widget);

        assert.equal(result.valid, true);
        assert.deepEqual(result.missing, []);
        assert.deepEqual(result.canonicalMissing, []);
        assert.deepEqual(result.modified, []);
    });
});

test("validate_structure currently rejects a widget when its API entrypoint no longer identifies a variant", async () => {
    await withTemporaryReactEdgeRoot(async root => {
        const widget = "fixture-shadow-missing-entrypoint";
        const widgetRoot = await createWidgetFixture(root, "runtime-shadow", widget);

        await unlink(resolve(widgetRoot, "api/runtime-shadow-widget.tsx"));

        await assert.rejects(
            () => validate(widget),
            /Widget contains no recognised API entrypoint/,
        );
    });
});
