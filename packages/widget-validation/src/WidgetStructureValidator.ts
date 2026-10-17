import {
    existsSync,
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
        "src/Config.ts",
        "src/ConfigSchema.ts",
        "src/WidgetView.tsx",
        "src/bootstrap/WidgetWrapper.tsx",
        "src/entrypoints/ssr.tsx",
        "src/bootstrap/widget-ssr-component.tsx",
    ],
    runtime: [
        "src/Config.ts",
        "src/ConfigSchema.ts",
        "src/ConfigSchemaRuntime.ts",
        "src/WidgetView.tsx",
        "src/bootstrap/WidgetWrapper.tsx",
        "src/entrypoints/ssr.tsx",
        "src/bootstrap/widget-ssr-component.tsx",
    ],
    "runtime-shadow": [
        "src/Config.ts",
        "src/ConfigSchema.ts",
        "src/ConfigSchemaRuntime.ts",
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

    "api/index.ts",

    "src/entrypoints/npm.tsx",

    "src/Widget.tsx",

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
 * Runtime schemas and runtime-shadow manifests are capability-owned
 * contracts. Their presence is validated, but their contents may differ
 * between widgets according to their runtime dependencies.
 */
const variantFiles = {
    standard: [
        "api/widget.tsx",
    ],
    runtime: [
        "api/runtime-widget.tsx",
        "public/reactedge-runtime.json",
    ],
    "runtime-shadow": [
        "api/runtime-shadow-widget.tsx",
        "public/reactedge-runtime.json",
    ]
} as const;

export interface WidgetStructureValidationResult {
    widget: string;
    variant?: string;
    valid: boolean;
    error?: string;
    missing?: string[];
    canonicalMissing?: string[];
    modified?: string[];
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

        const missing = this.findMissingFiles(
            widgetRoot,
            requiredFiles[variant],
        );

        const canonicalFiles = [
            ...sharedFiles,
            ...variantFiles[variant],
        ];

        const comparison = this.compareCanonicalFiles(
            widgetRoot,
            canonicalRoot,
            canonicalFiles,
            variant === "runtime-shadow"
                ? ["public/reactedge-runtime.json"]
                : [],
        );

        return {
            widget,
            variant,
            valid:
                missing.length === 0 &&
                comparison.missing.length === 0 &&
                comparison.canonicalMissing.length === 0 &&
                comparison.modified.length === 0,

            missing: [
                ...missing,
                ...comparison.missing,
            ],
            canonicalMissing: comparison.canonicalMissing,
            modified: comparison.modified,
        };
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
        skipContentComparison: readonly string[] = [],
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

            if (skipContentComparison.includes(file)) {
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
