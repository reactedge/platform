/**
 * Coordinates all processing required for a single widget. Owns the "process one widget" workflow.
 */
import type { ProcessedWidget, SsrViewMap, WidgetRegistry } from "./types.ts";
import { resolveWidgetEntry } from "./rebuild-registry/registry-loader.ts";
import { buildWidget } from "./widget-processor/build-widget.ts";
import { Report } from "./report.ts";
import { updateAssetRegistry } from "./widget-processor/asset-registry.ts";
import { loadContract } from "./widget-processor/contract-loader.ts";
import { loadSsrCss } from "./widget-processor/ssr-css-loadeer.ts";
import { generateSsr } from "./widget-processor/ssr-generator.ts";
import { writeManifest } from "./widget-processor/manifest-writer.ts";
import { getWidgetPath } from "./paths.ts";
import { getFilename } from "./util.ts";
import {ContractImageProcessor} from "./contract-loader/optimiser/validate-images.ts";

export async function processWidget(
    instanceName: string,
    registry: WidgetRegistry,
    report: Report
): Promise<ProcessedWidget> {
    let manifestResult: string | null = null;
    let ssrViews: SsrViewMap = {};

    const resolved =
        resolveWidgetEntry(
            instanceName,
            registry
        );

    const widgetName =
        resolved.widget || instanceName;

    const widgetReport =
        report.createScope(
            `widget.${instanceName}`
        );

    widgetReport.info(
        'Widget processing started',
        {
            widget: instanceName,
            buildTarget: widgetName
        }
    );

    try {
        const widgetPath = getWidgetPath(widgetName);
        buildWidget(widgetName, widgetPath, widgetReport);

        const registryResult = updateAssetRegistry(widgetName, instanceName, widgetReport);
        let contractResult = await loadContract(widgetName, registryResult.cdn, widgetReport);
        if (contractResult === null) {

            widgetReport.error(
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
                widgetReport
            );
        }

        const contractFile = getFilename(registryResult.cdn)

        const cssSsr = loadSsrCss(widgetName, registryResult.cssFilename)
        if (resolved?.ssr?.strategy === 'static') {
            const variants =
                resolved.ssr.variants ?? ['desktop'];

            for (const variant of variants) {
                widgetReport.info(
                    `SSR variant ${variant} started`,
                    {
                        widget: instanceName,
                        contractFile
                    }
                );
                ssrViews[variant] =
                    await generateSsr(
                        widgetName,
                        contractFile,
                        variant,
                        widgetReport
                    );
            }
        }

        const manifest = {
            id: instanceName,
            widget: widgetName,
            src: registryResult.src,
            css: registryResult.cssBundle,
            ssr: {
                views: ssrViews,
                css: cssSsr,
                strategy: resolved?.ssr?.strategy
            },
            integrity: registryResult.integrity,
            contract: contractResult,
            contractFile
        };

        manifestResult = writeManifest(manifest, instanceName, widgetReport);

        widgetReport.complete(
            'Widget Manifest',
            {
                manifest
            }
        );

        widgetReport.success(
            'Widget processing completed',
            {
                widget: instanceName
            }
        );
    }
    catch (error) {
        widgetReport.error(
            'Widget processing failed',
            {
                widget: instanceName,
                error
            }
        );
    } finally {
        widgetReport.end();
    }

    return {
        name: instanceName,
        manifestFile: manifestResult
    };
}