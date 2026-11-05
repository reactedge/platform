import {
    existsSync,
    readdirSync,
    readFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { getWidgetType } from "@reactedge/widget-preset/widgetType";

/**
 * Files required by each widget template.
 *
 * These files define the minimum internal structure expected from a widget
 * using the corresponding template.
 *
 * - standard:
 *   A regular widget with no runtime integration requirements.
 *
 * - runtime:
 *   A widget that consumes runtime integrations. Runtime widgets define
 *   their own ConfigSchemaRuntime.ts; the validator requires the schema
 *   to exist but does not prescribe its contents.
 *
 * - runtime-shadow:
 *   A runtime-integrated widget rendered inside a Shadow DOM host.
 *   Shadow widgets are not required to provide SSR support because their
 *   rendering model depends on a browser-owned ShadowRoot.
 */
const requiredFiles = {
    standard: [
        "src/bootstrap/config/Config.ts",
        "src/bootstrap/config/ConfigSchema.ts",
        "src/bootstrap/view/WidgetView.tsx",
        "src/bootstrap/WidgetWrapper.tsx",
        "src/bootstrap/ssr/render.tsx",
        "src/bootstrap/widget-ssr-component.tsx",
    ],
    runtime: [
        "src/bootstrap/config/Config.ts",
        "src/bootstrap/config/ConfigSchema.ts",
        "src/bootstrap/config/ConfigSchemaRuntime.ts",
        "src/bootstrap/view/WidgetView.tsx",
        "src/bootstrap/WidgetWrapper.tsx",
        "src/bootstrap/ssr/render.tsx",
        "src/bootstrap/widget-ssr-component.tsx",
    ],
    "runtime-shadow": [
        "src/bootstrap/config/Config.ts",
        "src/bootstrap/config/ConfigSchema.ts",
        "src/bootstrap/config/ConfigSchemaRuntime.ts",
        "src/bootstrap/WidgetWrapper.tsx",
    ],
} as const;

/**
 * Files required by every widget regardless of template.
 *
 * Only genuinely common infrastructure belongs here. Template-specific
 * concerns such as SSR, runtime configuration and host implementation
 * are declared separately.
 */
const sharedFiles = [
    "vite.npm.config.ts",
    "vite.config.ts",
    "tsconfig.node.json",
    "tsconfig.json",
    "tsconfig.app.json",

    "api/package.ts",

    "src/bootstrap/view/Widget.tsx",

    "src/bootstrap/widget-root.tsx",

    "src/activity/Context/ActivityContextProvider.tsx",
    "src/activity/Context/ActivityContext.tsx",
    "src/activity/Context/useActivityContext.ts",
] as const;

/**
 * Files that identify the public execution variant of a widget.
 *
 * A widget must contain exactly one API entrypoint matching its template.
 *
 * Generated runtime configuration is excluded: configuration creates it
 * locally, and it is not part of the canonical source structure.
 */
const variantFiles = {
    standard: [
        "api/widget.tsx",
    ],
    runtime: [
        "api/runtime-widget.tsx",
    ],
    "runtime-shadow": [
        "api/runtime-shadow-widget.tsx",
    ]
} as const;

const widgetSpecificFiles = new Set([
    "api/package.ts",
    "api/widget.tsx",
    "api/runtime-widget.tsx",
    "api/runtime-shadow-widget.tsx",
    "vite.npm.config.ts",
    "src/bootstrap/config/Config.ts",
    "src/bootstrap/config/ConfigSchema.ts",
    "src/bootstrap/config/ConfigSchemaRuntime.ts",
    "src/bootstrap/view/Widget.tsx",
    "src/bootstrap/view/WidgetView.tsx",
    "src/bootstrap/WidgetWrapper.tsx",
    "src/bootstrap/ssr/render.tsx",
    "src/bootstrap/widget-root.tsx",
    "src/bootstrap/widget-ssr-component.tsx",
    "src/activity/Context/ActivityContextProvider.tsx",
    "src/npm/main.tsx",
]);

export interface WidgetStructureValidationResult {
    widget: string;
    variant?: string;
    valid: boolean;
    error?: string;
    missing?: string[];
    canonicalMissing?: string[];
    modified?: string[];
    unexpected?: string[];
}

export class WidgetStructureValidator {
    private readonly repositoryRoot: string;

    constructor(repositoryRoot: string) {
        this.repositoryRoot = repositoryRoot;
    }

    validate(widget: string): WidgetStructureValidationResult {
        const widgetRoot = resolve(
            this.repositoryRoot,
            "widgets",
            widget,
        );

        if (!existsSync(widgetRoot)) {
            return {
                widget,
                valid: false,
                error: `Unknown widget: ${widget}`,
            };
        }

        const variant = getWidgetType(widgetRoot);

        const canonicalRoot = resolve(
            this.repositoryRoot,
            "packages",
            "widget-template",
            variant,
        );

        if (!existsSync(canonicalRoot)) {
            return {
                widget,
                variant,
                valid: false,
                error: `Canonical ${variant} template not found`,
            };
        }

        const missing = this.findMissingFiles(widgetRoot, [
            ...requiredFiles[variant],
            ...sharedFiles,
        ]);
        const unexpected = this.findUnexpectedFiles(widgetRoot, variant);

        const comparison = this.compareCanonicalFiles(
            widgetRoot,
            canonicalRoot,
            [...sharedFiles, ...variantFiles[variant]].filter(
                file => !widgetSpecificFiles.has(file),
            ),
        );

        return {
            widget,
            variant,
            valid:
                missing.length === 0 &&
                unexpected.length === 0 &&
                comparison.missing.length === 0 &&
                comparison.canonicalMissing.length === 0 &&
                comparison.modified.length === 0,

            missing: [...missing, ...comparison.missing],
            canonicalMissing: comparison.canonicalMissing,
            modified: comparison.modified,
            unexpected,
        };
    }

    private findUnexpectedFiles(
        widgetRoot: string,
        variant: keyof typeof variantFiles,
    ): string[] {
        const apiRoot = resolve(widgetRoot, "api");
        const expectedApiFiles = new Set([
            "package.ts",
            variantFiles[variant][0].replace("api/", ""),
        ]);
        const unexpected = readdirSync(apiRoot, { withFileTypes: true })
            .filter(entry => !entry.isFile() || !expectedApiFiles.has(entry.name))
            .map(entry => `api/${entry.name}`);

        const removedPaths = [
            "src/Config.ts",
            "src/ConfigSchema.ts",
            "src/ConfigSchemaRuntime.ts",
            "src/Widget.tsx",
            "src/WidgetView.tsx",
            "src/ssr/render.tsx",
        ];
        unexpected.push(
            ...removedPaths.filter(path => existsSync(resolve(widgetRoot, path))),
        );

        if (existsSync(resolve(widgetRoot, "src/entrypoints"))) {
            unexpected.push("src/entrypoints/");
        }

        return unexpected;
    }

    private findMissingFiles(
        root: string,
        files: readonly string[],
    ): string[] {
        return files.filter(
            file => !existsSync(resolve(root, file)),
        );
    }

    private compareCanonicalFiles(
        widgetRoot: string,
        canonicalRoot: string,
        files: readonly string[],
    ) {
        const missing: string[] = [];
        const canonicalMissing: string[] = [];
        const modified: string[] = [];

        for (const file of files) {
            const actual = resolve(widgetRoot, file);
            const canonical = resolve(canonicalRoot, file);

            if (!existsSync(actual)) {
                missing.push(file);
                continue;
            }

            if (!existsSync(canonical)) {
                canonicalMissing.push(file);
                continue;
            }

            if (!this.filesMatch(actual, canonical)) {
                modified.push(file);
            }
        }

        return {
            missing,
            canonicalMissing,
            modified,
        };
    }

    private filesMatch(
        actual: string,
        canonical: string,
    ): boolean {
        return readFileSync(actual)
            .equals(readFileSync(canonical));
    }
}
