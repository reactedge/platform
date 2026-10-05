/**
 * Entry point. Orchestrates the rebuild process. Knows the overall workflow but performs no business logic itself.
 */

import type { Report } from "../deployment/report.ts";
import { RegistryResolver } from "../deployment/RegistryResolver.ts";
import { WidgetProcessor } from "./widget-processor.ts";
import type { BuildWidgetRegistry } from "@reactedge/framework/contracts/buiild/BuildWidgetRegistry.ts";

export class RegistryRebuilder {
    private readonly registryResolver = new RegistryResolver();
    private readonly widgetProcessor: WidgetProcessor;

    constructor(
        private readonly registry: BuildWidgetRegistry,
        private readonly report: Report
    ) {
        this.widgetProcessor = new WidgetProcessor(
            registry,
            report
        );
    }

    async rebuild(selectedWidgets: string[]): Promise<void> {
        const widgets =
            this.registryResolver.resolveWidgets(
                selectedWidgets,
                this.registry
            );

        this.report.info(
            'Widget selection resolved',
            {
                widgets: widgets.length
            }
        );

        const processedWidgets =
            await Promise.all(
                widgets.map(widget =>
                    this.widgetProcessor.process(widget)
                )
            );

        this.report.success(
            'Widget processing completed',
            {
                widgets: processedWidgets.length
            }
        );

        this.report.success(
            'Registry rebuild completed'
        );

        this.report.renderConsole();
    }
}
