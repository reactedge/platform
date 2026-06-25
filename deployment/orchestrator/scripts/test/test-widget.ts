import { execSync } from 'child_process';
import path from 'path';
import {getConfig} from "../config.ts";
import {Report} from "../build/report.ts";

export function testWidget(
    widgetName: string,
    report: Report
): void {
    const widgetReport =
        report.createScope(
            `test-widget-${widgetName}`
        );

    widgetReport.info(
        'Testing widget',
        {
            widget: widgetName
        }
    );

    const config = getConfig()

    try {
        const playwright = path.join(
            config.projectRoot,
            'node_modules',
            '.bin',
            'playwright'
        );

        execSync(
            `${playwright} test --config=tests/playwright.stage.config.ts widgets/${widgetName}/vite_project/tests`,
            {
                cwd: config.projectRoot,
                stdio: 'inherit'
            }
        );

        widgetReport.success(
            'Widget test completed',
            {
                widget: widgetName
            }
        );

    } catch (error) {

        widgetReport.error(
            'Widget test failed',
            {
                widget: widgetName
            }
        );

        throw error;
    }
}