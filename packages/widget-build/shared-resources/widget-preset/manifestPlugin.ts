import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import type {
    OutputBundle,
    OutputOptions,
} from "rollup";
import type { Plugin } from "vite";

type Options = {
    widgetName: string,
    version: string
}

export type TPlugin = {
    name: string;
    apply?: "build" | "serve";

    generateBundle?: (
        options: OutputOptions,
        bundle: OutputBundle
    ) => void;
};

export function manifestPlugin({
   widgetName,
   version
}: Options): Plugin {
    if (!widgetName) {
        throw new Error('manifestPlugin requires widgetName')
    }

    const plugin: Plugin = {
        name: 'reactedge-manifest-plugin',
        apply: 'build',

        generateBundle(options, bundle) {
            const entries = Object.entries(bundle).filter(
                ([fileName, output]) =>
                    output.type === "chunk" &&
                    fileName.endsWith(".iife.js")
            );

            if (entries.length !== 1) {
                throw new Error(
                    `Expected exactly one IIFE bundle, found ${entries.length}`
                );
            }

            const cssFilename = `widget-${widgetName}.css`;

            const [fileName, output] = entries[0];

            if (output.type !== "chunk") {
                throw new Error(`Expected ${fileName} to be a chunk`);
            }

            const hash = createHash('sha256')
                .update(output.code)
                .digest('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            const newFileName =
                `widget-${widgetName}@${hash}.iife.js`;

            output.fileName = newFileName;

            const sourceMap = bundle[`${fileName}.map`];

            if (sourceMap) {
                const newSourceMapFileName = `${newFileName}.map`;

                sourceMap.fileName = newSourceMapFileName;

                output.code = output.code.replace(
                    /\/\/# sourceMappingURL=.*$/m,
                    `//# sourceMappingURL=${newSourceMapFileName}`
                );
            }

            const manifest = {
                widget: widgetName,
                version,
                hash,
                ...(cssFilename && { cssFilename }),
                filename: newFileName,
                built_at: new Date().toISOString()
            };

            const outDir = options.dir || 'www';

            const manifestPath = path.join(
                outDir,
                `widget-${widgetName}.manifest.json`
            );

            fs.writeFileSync(
                manifestPath,
                JSON.stringify(manifest, null, 2)
            );

            // eslint-disable-next-line no-console
            console.log(`✔ Manifest generated: ${manifestPath}`);
        }
    };

    return plugin;
}