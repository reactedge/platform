/**
 * Coordinates all processing required for a single widget. Owns the "process one widget" workflow.
 */
import type { ProcessedWidget } from "./types.ts";
import { RegistryResolver } from "../deployment/RegistryResolver.ts";
import { WidgetBuilder } from "./widget-processor/build-widget.ts";
import type { Report } from "../deployment/report.ts";
import { ContractLoader } from "../contract/contract-loader.ts";
import { SsrLoader } from "./widget-processor/ssr-css-loader.ts";
import { ManifestWriter } from "./widget-processor/manifest-writer.ts";
import { BuildPaths } from "./paths.ts";
import { AssetRegistryUpdater } from "./asset-registry/registry-updater.ts";
import { ContractImageProcessor } from "../contract/optimiser/validate-images.ts";
import type { BuildWidgetRegistry } from "@reactedge/framework/contracts/buiild/BuildWidgetRegistry.ts";
import { getFilename } from "./util";
import { SsrGenerationCoordinator } from "./widget-processor/ssr-generation-coordinator.ts";

const widgetBuilder = new WidgetBuilder();

export class WidgetProcessor {
    private readonly registryResolver = new RegistryResolver();
    private readonly paths = new BuildPaths();
    private readonly contractLoader: ContractLoader;
    private readonly assetRegistry: AssetRegistryUpdater;
    private readonly ssrLoader: SsrLoader;
    private readonly ssrGeneration: SsrGenerationCoordinator;
    private readonly manifestWriter: ManifestWriter;

    constructor(
        private readonly registry: BuildWidgetRegistry,
        private readonly report: Report
    ) {
        this.contractLoader = new ContractLoader(
            report,
            this.paths
        );
        this.assetRegistry = new AssetRegistryUpdater(
            report,
            this.paths
        );
        this.ssrLoader = new SsrLoader(
            this.paths
        );
        this.ssrGeneration = new SsrGenerationCoordinator(
            report,
            this.paths
        );
        this.manifestWriter = new ManifestWriter(
            report,
            this.paths
        );
    }

    async process(
        instanceName: string
    ): Promise<ProcessedWidget> {
        let manifestResult: string | null = null;

        const resolved =
            this.registryResolver.resolveWidgetEntry(
                instanceName,
                this.registry
            );

        const widgetName =
            resolved.widget || instanceName;

        this.report.info(
            'Widget processing started',
            {
                widget: instanceName,
                buildTarget: widgetName
            }
        );

        try {
            const widgetPath = this.paths.getWidgetPath(widgetName);
            widgetBuilder.build(widgetName, widgetPath, this.report);

            const registryResult = this.assetRegistry.update(
                widgetName,
                instanceName
            );

            if (!registryResult.contract) {
                throw new Error(
                    `Missing contract for widget "${instanceName}"`
                );
            }

            let contractResult = await this.contractLoader.load(
                widgetName,
                registryResult.contract
            );

            if (contractResult === null) {
                this.report.error(
                    'Contract not found'
                );

                return {
                    name: instanceName,
                    manifestFile: ''
                };
            }

            if (resolved?.imageOptimisation) {
                const imageProcessor = new ContractImageProcessor(instanceName);
                contractResult = await imageProcessor.transform(
                    contractResult,
                    resolved.imageOptimisation,
                    this.report
                );
            }

            const contractFile = getFilename(registryResult.contract);
            const cssSsr = this.ssrLoader.load(
                widgetName,
                registryResult.cssFilename
            );
            const ssrStrategy =
                resolved?.ssr?.strategy ?? 'disabled';

            await this.ssrGeneration.generate({
                instanceName,
                widgetName,
                contractFile,
                contract: contractResult,
                strategy: ssrStrategy,
                variants: resolved?.ssr?.variants
            });

            const manifest = {
                id: instanceName,
                widget: widgetName,
                src: registryResult.src,
                css: registryResult.cssFilename,
                ssr: {
                    css: cssSsr,
                    strategy: resolved?.ssr?.strategy
                },
                integrity: registryResult.integrity,
                contract: contractResult,
                contractFile
            };

            manifestResult = this.manifestWriter.write(
                manifest,
                instanceName
            );

            this.report.info(
                'Widget Manifest',
                {
                    manifest
                }
            );

            this.report.success(
                'Widget processing completed',
                {
                    widget: instanceName
                }
            );
        }
        catch (error) {
            this.report.error(
                'Widget processing failed',
                {
                    widget: instanceName,
                    error
                }
            );
        }

        return {
            name: instanceName,
            manifestFile: manifestResult
        };
    }
}
