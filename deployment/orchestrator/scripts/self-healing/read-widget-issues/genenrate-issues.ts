import { loadRegistry, resolveWidgetEntry } from "../../build/rebuild-registry/registry-loader.ts";
import { loadWidgetContract } from "../load-widget-contract.ts";
import { validateContract } from "../../build/contract-loader/validator.ts";
import { getContractCdn } from "./contract-reader.ts";
import type { ValidationIssue } from "../../build/types.ts";

export async function readWidgetIssues(
    instanceId: string
): Promise<ValidationIssue[]> {

    const registry =
        loadRegistry();

    const resolved =
        resolveWidgetEntry(
            instanceId,
            registry
        );

    const widgetName =
        resolved.widget || instanceId;

    const contract =
        loadWidgetContract(
            instanceId,
            registry
        );

    return validateContract(
        widgetName,
        contract,
        getContractCdn(
            widgetName,
            instanceId
        )
    );
}