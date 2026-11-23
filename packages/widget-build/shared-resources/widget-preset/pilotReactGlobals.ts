const pilotWidgets = new Set(["usp", "categoryfaq"]);

const globals = {
    "react": "ReactEdgeSharedReact.React",
    "react-dom": "ReactEdgeSharedReact.ReactDOM",
    "react-dom/client": "ReactEdgeSharedReact.ReactDOMClient",
    "react/jsx-runtime": "ReactEdgeSharedReact.JSXRuntime",
};

export function pilotReactGlobals(widgetName: string): typeof globals | undefined {
    if (process.env.REACTEDGE_SHARED_REACT === "1" && pilotWidgets.has(widgetName)) {
        return globals;
    }

    return undefined;
}
