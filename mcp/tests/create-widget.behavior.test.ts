import test from "node:test";
import assert from "node:assert/strict";
import {
    readFile,
    readdir,
    rm,
    writeFile,
} from "node:fs/promises";
import { resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { McpServer } from "@modelcontextprotocol/server";

import { registerValidateStructureTool } from "../tools/validateStructure";

const execFileAsync = promisify(execFile);
const repositoryRoot = process.cwd();

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

function textPayload(result: unknown): string {
    assert.ok(result && typeof result === "object");

    const content = (result as {
        content?: Array<{ type?: string; text?: string }>;
    }).content;

    assert.ok(Array.isArray(content));
    assert.equal(content.length, 1);
    assert.equal(content[0]?.type, "text");
    assert.equal(typeof content[0]?.text, "string");

    return content[0]!.text!;
}

function jsonPayload(result: unknown): Record<string, unknown> {
    return JSON.parse(textPayload(result));
}

async function loadCreateWidgetTool(): Promise<(
    server: McpServer,
) => void> {
    const module = await import("../tools/createWidget");
    return module.registerCreateWidgetTool;
}

async function invokeCreateWidget(
    name: string,
    type: "standard" | "runtime" | "runtime-shadow",
): Promise<unknown> {
    const server = new RecordingServer();
    const registerCreateWidgetTool = await loadCreateWidgetTool();
    registerCreateWidgetTool(server.asMcpServer());

    const tool = server.tools.get("create_widget");
    assert.ok(tool, "Expected create_widget to be registered");

    return await tool.handler({ name, type });
}

async function validateGeneratedWidget(
    widget: string,
): Promise<Record<string, unknown>> {
    const originalRoot = process.env.REACTEDGE_ROOT;

    try {
        process.env.REACTEDGE_ROOT = repositoryRoot;

        const server = new RecordingServer();
        registerValidateStructureTool(server.asMcpServer());

        const tool = server.tools.get("validate_structure");
        assert.ok(tool);

        return jsonPayload(await tool.handler({ widget }));
    } finally {
        if (originalRoot === undefined) {
            delete process.env.REACTEDGE_ROOT;
        } else {
            process.env.REACTEDGE_ROOT = originalRoot;
        }
    }
}

async function assertNoTemplateTokens(root: string): Promise<void> {
    const entries = await readdir(root, {
        recursive: true,
        withFileTypes: true,
    });

    for (const entry of entries) {
        if (!entry.isFile()) {
            continue;
        }

        const path = resolve(entry.parentPath, entry.name);
        const content = await readFile(path, "utf8");

        assert.equal(
            content.includes("__WIDGET_NAME__"),
            false,
            `Unreplaced __WIDGET_NAME__ token in ${path}`,
        );
        assert.equal(
            content.includes("__WIDGET_PASCAL_NAME__"),
            false,
            `Unreplaced __WIDGET_PASCAL_NAME__ token in ${path}`,
        );
    }
}

async function snapshotPackageLock(): Promise<string | null> {
    try {
        return await readFile(resolve(repositoryRoot, "package-lock.json"), "utf8");
    } catch {
        return null;
    }
}

async function restorePackageLock(snapshot: string | null): Promise<void> {
    const path = resolve(repositoryRoot, "package-lock.json");

    if (snapshot === null) {
        await rm(path, { force: true });
        return;
    }

    await writeFile(path, snapshot, "utf8");
}

async function cleanupGeneratedWidget(name: string): Promise<void> {
    await rm(resolve(repositoryRoot, "widgets", name), {
        recursive: true,
        force: true,
    });

    await rm(resolve(repositoryRoot, "node_modules", `widget-${name}`), {
        recursive: true,
        force: true,
    });

    await rm(resolve(repositoryRoot, "workspace", "release", "source", name), {
        recursive: true,
        force: true,
    });
}

for (const variant of ["standard", "runtime", "runtime-shadow"] as const) {
    test(
        `create_widget produces a structurally valid and buildable ${variant} widget in the real workspace`,
        { timeout: 120_000 },
        async () => {
            const suffix = `${process.pid}${Date.now()}`;
            const name = `mcptest${variant.replaceAll("-", "")}${suffix}`;
            const packageLock = await snapshotPackageLock();

            await cleanupGeneratedWidget(name);

            try {
                const result = await invokeCreateWidget(name, variant);

                assert.equal(
                    textPayload(result),
                    `Created ${variant} widget "${name}" in widgets/${name}.`,
                );

                const widgetRoot = resolve(repositoryRoot, "widgets", name);
                const packageJson = JSON.parse(
                    await readFile(resolve(widgetRoot, "package.json"), "utf8"),
                ) as { name?: string };

                assert.equal(packageJson.name, `widget-${name}`);
                if (variant === "runtime-shadow") {
                    const runtimeManifest = JSON.parse(
                        await readFile(
                            resolve(widgetRoot, "public/reactedge-runtime.json"),
                            "utf8",
                        ),
                    ) as { integrations?: unknown };

                    assert.ok(runtimeManifest.integrations);
                }
                await assertNoTemplateTokens(widgetRoot);

                const validation = await validateGeneratedWidget(name);
                assert.equal(validation.variant, variant);
                assert.equal(validation.valid, true);
                assert.deepEqual(validation.missing, []);
                assert.deepEqual(validation.canonicalMissing, []);
                assert.deepEqual(validation.modified, []);

                // Build exactly as a developer does from the generated widget.
                await execFileAsync("npm", ["run", "build"], {
                    cwd: widgetRoot,
                    timeout: 60_000,
                    env: process.env,
                });
            } finally {
                await cleanupGeneratedWidget(name);
                await restorePackageLock(packageLock);
            }
        },
    );
}

test(
    "create_widget refuses to overwrite an existing widget",
    { timeout: 120_000 },
    async () => {
        const suffix = `${process.pid}${Date.now()}`;
        const name = `mcptestexisting${suffix}`;
        const packageLock = await snapshotPackageLock();

        await cleanupGeneratedWidget(name);

        try {
            const first = await invokeCreateWidget(name, "standard");
            assert.equal(
                textPayload(first),
                `Created standard widget "${name}" in widgets/${name}.`,
            );

            const second = await invokeCreateWidget(name, "standard") as {
                isError?: boolean;
            };

            assert.equal(second.isError, true);
            assert.equal(
                textPayload(second),
                `Widget "${name}" already exists.`,
            );
        } finally {
            await cleanupGeneratedWidget(name);
            await restorePackageLock(packageLock);
        }
    },
);
