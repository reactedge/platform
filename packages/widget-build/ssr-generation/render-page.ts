import fs from 'fs/promises';
import 'dotenv/config';
import {getReactEdgeRoot} from "../shared-resources/filesystem/reactedgeRoot";

function resolveEntry(widget: string): string {
    return `${getReactEdgeRoot()}/widgets/${widget}/src/ssr/entry.tsx`;
}

const run = async () => {
    const widgetName = process.argv[2];
    const contractPath = process.argv[3];

    if (!widgetName) {
        throw new Error('Missing widget name');
    }

    if (!contractPath) {
        throw new Error('Missing contract path');
    }

    let config = JSON.parse(
        await fs.readFile(contractPath, 'utf8')
    );

    let runtime = {
        rendering: {
            userAgent: process.argv[4] ?? ''
        }
    };

    const entry = resolveEntry(widgetName);

    try {
        await fs.access(entry);
    } catch {
        console.log(`Widget '${widgetName}' does not implement SSR.`);
        return;
    }

    const { renderHtml, buildBootstrap, loadRuntime } = await import(entry);

    if (loadRuntime) runtime = await loadRuntime()
    const bootstrap =
        buildBootstrap
            ? await buildBootstrap(runtime)
            : undefined;


    const finalHtml = renderHtml(config, runtime, bootstrap)

    process.stdout.write(finalHtml);
};

run();