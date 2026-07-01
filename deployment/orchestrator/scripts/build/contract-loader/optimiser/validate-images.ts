import type {WidgetImageOptimisationConfig} from "../../types.ts";
import {ReportScope} from "../../report.ts";
import {ImageExtractor} from "../data-extractor/images.ts";
import {ImageOptimiser} from "../data-processor/image-optimiser.ts";
import {ContractImageTransformer} from "../data-processor/contract-image-transformer.ts";


export class ContractImageProcessor {
    private imageExtractor: ImageExtractor;

    private imageOptimiser: ImageOptimiser;

    private contractImageTransformer: ContractImageTransformer;

    private widgetInstanceName: string;

    constructor(widgetInstanceName: string) {
        this.imageExtractor = new ImageExtractor;
        this.imageOptimiser = new ImageOptimiser;
        this.contractImageTransformer = new ContractImageTransformer();
        this.widgetInstanceName = widgetInstanceName
    }

    async transform<T>(
        contract: T,
        config: WidgetImageOptimisationConfig,
        report: ReportScope
    ): Promise<T> {

        const replacements = new Map<string, string>();

        const images = this.imageExtractor.extract(contract, config);

        if (images.length === 0) {
            report.info(
                'No Image optimisation identified',
                {
                    widgetInstanceName: this.widgetInstanceName
                }
            );
            return contract;
        }

        console.log(`Widget Instance "${this.widgetInstanceName}" has ${images.length} to optimise`)
        report.info(
            'Image optimisation Urls extracted',
            {
                widgetInstanceName: this.widgetInstanceName,
                imageCount: images.length
            }
        );

        for (const image of images) {

            if (!this.imageOptimiser.canOptimise(image.src, config)) {
                continue;
            }

            const original = image.src;

            const publicUrl = await this.imageOptimiser.optimise(
                original,
                config
            );

            replacements.set(
                original,
                publicUrl
            );

            report.info(
                'Image optimised',
                {
                    original,
                    optimised: publicUrl
                }
            );
        }

        if (images.length > 0) {
            report.success(
                'Image optimisation completed',
                {
                    optimised: replacements.size,
                    skipped: images.length - replacements.size
                }
            );

            return await this.contractImageTransformer.transform(contract, replacements)
        }
    }
}

