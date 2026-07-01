/**
 * Generates SSR HTML for a widget given a contract. Owns render-page execution.
 */
import fs from "fs";
import path from "path";
import {ReportScope} from "../report.ts";
import {getContractPath, getWidgetPath} from "../paths.ts";
import {exec} from "node:child_process";
import {resolveContractTags} from "../contract-loader/wrapper.ts";
import type {SsrVariant} from "../types.ts";
import {getConfig} from "../../config.ts";

export async function generateSsr(
    widgetName: string,
    contractFile: string,
    variant: SsrVariant,
    report: ReportScope
): Promise<string | null> {

    const config = getConfig()

    const contractPath = getContractPath(widgetName, contractFile)
debugger
    const rendererPath = path.join(
        config.projectRoot,
        'packages',
        'widget-build',
        'ssr-generation',
        'render-page.ts'
    );

    if (!fs.existsSync(rendererPath)) {

        report.info(
            'SSR skipped',
            {
                widget: widgetName,
                reason: 'missing-renderer'
            }
        );

        return null;
    }

    return new Promise(
        (resolve, reject) => {
            exec(
                `NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx ${rendererPath} ${widgetName} "${contractPath}" ${variant}`,
                {
                    cwd: config.projectRoot,
                    encoding: 'utf8'
                },
                (error, stdout) => {

                    if (error ||  stdout.length === 0) {
                        reject(error);
                        return;
                    }

                    report.success(
                        'SSR generated',
                        {
                            widget: widgetName,
                            variant,
                            contractPath,
                            ssrLength: stdout.length
                        }
                    );

                    resolve(
                        resolveContractTags(stdout)
                    );
                }
            );
        }
    );
}
