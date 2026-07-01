import {getConfig} from "../../../config.ts";
import type {ValidationIssue} from "../../types.ts";
import {extractUrls} from "../data-extractor/url.ts";

export function validateUrls(
    contract: unknown,
    cdn: string
): ValidationIssue[] {

    const issues: ValidationIssue[] = [];

    const config =
        getConfig();

    const urls =
        extractUrls(contract);

    for (const url of urls) {

        const hostname =
            new URL(url).hostname;

        if (
            !config.allowedHosts.includes(
                hostname
            )
        ) {
            issues.push({
                code: 'invalid_host',
                path: url,
                message:
                    `ContractFile ${cdn} contains disallowed host "${hostname}"`
            });
        }
    }

    return issues;
}