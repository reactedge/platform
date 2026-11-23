const reactGlobals = {
    "react": "ReactEdgeSharedReact.React",
    "react-dom": "ReactEdgeSharedReact.ReactDOM",
    "react-dom/client": "ReactEdgeSharedReact.ReactDOMClient",
    "react/jsx-runtime": "ReactEdgeSharedReact.JSXRuntime",
};

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

    return {
        outDir,
        cssCodeSplit: false,
        emptyOutDir: false,
        lib: {
            entry,
            name: `ReactEdge_${widgetName}`,
            fileName: () => `widget-${widgetName}@${version}.iife.js`,
            ...(emitCss && {
                cssFileName: `widget-${widgetName}`,
            }),
            formats: ["iife"],
        },
        rollupOptions: {
            external: Object.keys(reactGlobals),
            output: {
                assetFileNames: `widget-${widgetName}.[ext]`,
                globals: reactGlobals,
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
