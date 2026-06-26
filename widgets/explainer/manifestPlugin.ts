// build/manifestPlugin.ts

import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

type Options = {
    widgetName: string
}

export function manifestPlugin({ widgetName }: Options): Plugin {
    if (!widgetName) {
        throw new Error('manifestPlugin requires widgetName')
    }

    return {
        name: 'reactedge-manifest-plugin',
        apply: 'build',

        generateBundle(options: any, bundle: any) {
            const version = require('./package.json').version

            const entries = Object.entries(bundle).filter(
                ([fileName, chunk]: any) =>
                    chunk.type === 'chunk' && fileName.endsWith('.iife.js')
            )

            if (entries.length !== 1) {
                throw new Error(
                    `Expected exactly one IIFE bundle, found ${entries.length}`
                )
            }

            const [fileName, chunk]: any = entries[0]

            const hash = createHash('sha256')
                .update(chunk.code)
                .digest('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '')

            const newFileName = `widget-${widgetName}@${hash}.iife.js`

            bundle[newFileName] = {
                ...chunk,
                fileName: newFileName
            }
            delete bundle[fileName]

            const manifest = {
                widget: widgetName,
                version,
                hash,
                filename: newFileName,
                built_at: new Date().toISOString()
            }

            const outDir = options.dir || 'www'

            const manifestPath = path.join(
                outDir,
                `widget-${widgetName}.manifest.json`
            )

            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

            console.log(`✔ Manifest generated: ${manifestPath}`)
        }
    }
}