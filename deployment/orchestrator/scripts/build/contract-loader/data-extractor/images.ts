import type {WidgetImageOptimisationConfig} from "../../types.ts";
import path from 'path';

interface ImageReference {
    src: string;
}

export class ImageExtractor {
    extract(
        value: unknown,
        config: WidgetImageOptimisationConfig
    ): ImageReference[] {

        const imageReferences: ImageReference[] = [];

        const visit = (node: unknown): void => {

            if (Array.isArray(node)) {
                for (const item of node) {
                    visit(item);
                }
                return;
            }

            if (node && typeof node === 'object') {

                const obj = node as Record<string, unknown>;

                const image = obj.image;

                if (
                    image &&
                    typeof image === 'object' &&
                    'src' in image &&
                    typeof image.src === 'string' &&
                    this.canOptimise(image.src, config)
                ) {
                    imageReferences.push({
                        src: image.src
                    });
                }

                for (const value of Object.values(obj)) {
                    visit(value);
                }
            }
        }

        visit(value);

        return imageReferences;
    }

    private canOptimise(
        src: string,
        config: WidgetImageOptimisationConfig
    ): boolean {

        const extension = path.extname(src)
            .slice(1)
            .toLowerCase();

        return config.scanFormats.includes(extension);
    }
}

