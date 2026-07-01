/**
 * Entry point. Orchestrates the rebuild process. Knows the overall workflow but performs no business logic itself.
 */

import { Report } from "./report.ts";
import { resolveWidgets } from './rebuild-registry/registry-loader.ts';
import { processWidget } from './widget-processor.ts';
import type { WidgetRegistry } from "./types.ts";
import { runCiVerification } from "../test/playwright-verification.ts";

export async function rebuildRegistry(
    selectedWidgets: string[],
    registry: WidgetRegistry,
    report: Report
) {
    const widgets =
        resolveWidgets(
            selectedWidgets,
            registry
        );

    report.info(
        'Widget selection resolved',
        {
            widgets: widgets.length
        }
    );

    const processedWidgets =
        await Promise.all(
            widgets.map(widget =>
                processWidget(
                    widget,
                    registry,
                    report
                )
            )
        );

    await runCiVerification(
        selectedWidgets,
        report
    );

    report.success(
        'Widget processing completed',
        {
            widgets: processedWidgets.length
        }
    );

    report.success(
        'Registry rebuild completed'
    );

    report.renderConsole()
    report.publishSummary();
}
