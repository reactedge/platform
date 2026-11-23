import { pilotReactGlobals } from "./pilotReactGlobals.ts";

export function createWidgetBuildDefaults<TBuild>(
    options: {
        widgetName: string;
        version: string;
        entry: string;
        outDir: string;
        emitCss?: boolean;
        sourcemap?: boolean
    }
): TBuild {
    const {widgetName, version, entry, outDir, emitCss, sourcemap } = options;
    const reactGlobals = pilotReactGlobals(widgetName);
    const bundleSuffix = reactGlobals ? ".shared-react.iife.js" : ".iife.js";

    return {
        outDir,
        cssCodeSplit: false,
        emptyOutDir: false,
        lib: {
            entry,
            name: `ReactEdge_${widgetName}`,
            fileName: () => `widget-${widgetName}@${version}${bundleSuffix}`,
            ...(emitCss && {
                cssFileName: `widget-${widgetName}`,
            }),
            formats: ["iife"],
        },
        rollupOptions: {
            ...(reactGlobals && { external: Object.keys(reactGlobals) }),
            output: {
                assetFileNames: `widget-${widgetName}.[ext]`,
                ...(reactGlobals && { globals: reactGlobals }),
            },
        },
        minify: true,
        sourcemap: sourcemap?? false
    } as TBuild
}

export function createNpmBuildDefaults<TBuild>({
   widgetName,
   entry = "api/package.ts",
}: {
    widgetName: string;
    entry?: string;
}): TBuild {
    return {
        outDir: `../../workspace/release/source/${widgetName}/`,
        emptyOutDir: false,
        lib: {
            entry,
            formats: ["es"],
            fileName: () => "index.js",
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "react-dom/client",
                "react-dom/server",
                "react/jsx-runtime",
            ],
        },
    } as TBuild
}
