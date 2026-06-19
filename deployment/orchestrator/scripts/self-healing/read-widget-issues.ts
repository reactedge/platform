import {loadConfig} from "../config.ts";
import {readWidgetIssues} from "./read-widget-issues/genenrate-issues.ts";

//const target = await selectTarget()
const target =
    '.env.mageosuk-dev';
loadConfig(target);

const instanceId =
    process.argv[2];

if (!instanceId) {
    throw new Error(
        `Widget instance "${instanceId}" not found`
    );
}

const issues = await readWidgetIssues(instanceId)
console.log(issues)