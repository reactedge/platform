import { getFilename } from "../../util.ts";
import path from "path";
import https from 'https';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { getConfig } from "../../../config.ts"
import type { WidgetImageOptimisationConfig } from "../../types.ts";

const MAX_WIDTH = 700;


export class ImageOptimiser {
    canOptimise(
        src: string,
        config: WidgetImageOptimisationConfig
    ): boolean {

        const extension =
            src.split('?')[0]
                .split('.')
                .pop()
                ?.toLowerCase();

        return (
            extension !== undefined &&
            config.scanFormats.includes(extension)
        );
    }

    async optimise(url: string, widgetConfig: WidgetImageOptimisationConfig): Promise<string> {
        const name = getFilename(url);
        const config = getConfig()

        const relativePath = `${name}.webp`;

        const outputPath = path.join(
            config.assetTargetDir,
            config.assetStoreDir,
            'assets',
            relativePath
        );

        try {
            const agent = new https.Agent({
                rejectUnauthorized: false
            });

            const res = await fetch(url, {
                agent
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const buffer = Buffer.from(await res.arrayBuffer());

            const image = sharp(buffer);
            const metadata = await image.metadata();

            const width = metadata.width > MAX_WIDTH
                ? MAX_WIDTH
                : metadata.width;

            await image
                .resize({ width })
                .webp({ quality: widgetConfig.quality })
                .toFile(outputPath);

            console.log(`✓ ${name} (${metadata.width}px → ${width}px)`);

            return this.getPublicUrl(relativePath);

        } catch (err) {
            console.error(`✗ Failed: ${url}`);
            console.error(`   - ${err.message}`);
        }
    }

    private getPublicUrl(
        relativePath: string
    ): string {

        const config = getConfig();

        return `${config.targetSite}/media/${config.optimisedAssetsRelativePath}${relativePath}`;
    }
}