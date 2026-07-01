import { execSync } from 'child_process';
import path from 'path';
import {ReportScope} from "../report.ts";

const buildCache = new Set<string>();

export function buildWidget(
    widgetName: string,
    widgetPath: string,
    report: ReportScope
): void {

    if (buildCache.has(widgetName)) {

        report.info(
            'Widget build skipped (cached)',
            {
                widget: widgetName
            }
        );

        return;
    }

    report.info(
        'Building widget',
        {
            widget: widgetName
        }
    );

    try {

        execSync(
            `npm run build --prefix ${path.join(
                widgetPath
            )}`,
            {
                stdio: 'inherit'
            }
        );

        buildCache.add(
            widgetName
        );

        report.success(
            'Widget build completed',
            {
                widget: widgetName
            }
        );

    } catch (error) {

        report.error(
            'Widget build failed',
            {
                widget: widgetName
            }
        );

        throw error;
    }
}