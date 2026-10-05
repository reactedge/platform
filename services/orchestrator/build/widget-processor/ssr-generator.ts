/**
 * Generates SSR HTML for a widget given a contract. Owns render-page execution.
 */
import fs from "fs";
import path from "path";
import type {Report} from "../../deployment/report.ts";
import {getContractPath} from "../paths.ts";
import {exec} from "node:child_process";
import {resolveContractTags} from "../../contract/wrapper.ts";
import type {SsrVariant} from "@reactedge/framework/contracts/WidgetSsrConfig.ts";
import {ReactEdgeRoot} from "@reactedge/filesystem/reactedgeRoot.ts";

export async function generateSsr(
    widgetName: string,
    contractFile: string,
    variant: SsrVariant,
    report: Report
): Promise<string | null> {
    const contractPath = getContractPath(widgetName, contractFile)

    const rendererPath = path.join(
        ReactEdgeRoot.get(),
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
                `NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx --tsconfig "widgets/${widgetName}/tsconfig.app.json" ${rendererPath} ${widgetName} "${contractPath}" ${variant}`,
                {
                    cwd: ReactEdgeRoot.get(),
                    encoding: 'utf8'
                },
                (error, stdout) => {

                    if (error ||  stdout.length === 0) {
                        console.log('SSR Generation error', {
                            error
                        })
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
