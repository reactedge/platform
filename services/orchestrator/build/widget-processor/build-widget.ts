import { execSync } from 'child_process';
import path from 'path';
import type {Report} from "../../deployment/report.ts";
import {getConfig} from "../../deployment/config.ts";

export class WidgetBuilder {
    private readonly buildCache = new Set<string>();

    build(
        widgetName: string,
        widgetPath: string,
        report: Report
    ): void {
        const config = getConfig()

        if (this.buildCache.has(widgetName)) {

            report.info(
                'Widget build skipped (cached)',
                {
                    widget: widgetName
                }
            );

            return;
        }

        const buildCommand = config.phpEnv
            ? "build"
            : "build:ssr";


        report.info(
            'Building widget',
            {
                widget: widgetName,
                buildCommand
            }
        );

        try {
            execSync(
                `npm run ${buildCommand} --prefix ${path.join(
                    widgetPath
                )}`,
                {
                    stdio: 'inherit'
                }
            );

            this.buildCache.add(
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
}