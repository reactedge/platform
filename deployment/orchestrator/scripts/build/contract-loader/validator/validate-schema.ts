import {ZodError} from "zod";
import {importParseConfig} from "../../util.ts";
import {getWidgetPath} from "../../paths.ts";
import type {ValidationIssue} from "../../types.ts";

export async function validateWidget(
    widgetName: string,
    contract: unknown
): Promise<ValidationIssue[]> {
    let parseConfig = null

    const issues: ValidationIssue[] = [];
    const schemaPath = `${getWidgetPath(widgetName)}/src/ConfigSchema.ts`;

    try {
        parseConfig = await importParseConfig(schemaPath)

    } catch (error) {

        issues.push({
            code: 'schema_load_failed',
            path: schemaPath,
            message: String(error)
        });

        return issues;
    }

    try {
        parseConfig(contract);

    } catch (error) {

        if (error instanceof ZodError) {

            for (const issue of error.issues) {

                issues.push({
                    code: issue.code,
                    path: issue.path.join('.'),
                    message: issue.message
                });
            }
        } else {

            issues.push({
                code: 'widget_validation_failed',
                path: '',
                message: String(error)
            });
        }
    }

    return issues;
}