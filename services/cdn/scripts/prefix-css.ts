import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import postcss from 'postcss';
import prefixer from 'postcss-prefix-selector';

const ROOT = './www';

function shouldSkip(file: string, content: string): boolean {
    return (
        file.endsWith('.bundle.css') ||
        content.trim().startsWith('@import')
    );
}

function buildPrefix(widget: string): string {
    return `${widget}-widget`;
}

async function processFile(file: string) {
    const content = await fs.readFile(file, 'utf8');

    if (shouldSkip(file, content)) {
        console.log('SKIP', file);
        return;
    }

    const parts = file.split(path.sep);

    const widgetIndex = parts.indexOf('www') + 1;
    const widget = parts[widgetIndex];

    const prefix = buildPrefix(widget);

    const result = await postcss([
        prefixer({
            prefix,

            transform(prefix, selector, prefixedSelector) {
                if (
                    selector.startsWith(prefix) ||
                    selector.startsWith('html') ||
                    selector.startsWith('body') ||
                    selector.startsWith(':root')
                ) {
                    return selector;
                }

                return prefixedSelector;
            }
        })
    ]).process(content, { from: file });

    await fs.writeFile(file, result.css);

    console.log('PREFIXED', file);
}

async function main() {
    const files = await fg(`${ROOT}/**/*.css`);

    for (const file of files) {
        await processFile(file);
    }
}

main();