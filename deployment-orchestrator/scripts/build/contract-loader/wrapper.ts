import {getConfig} from "../../config.ts";
import type {ContractWrapper} from "../types.ts";

/**
 * Produces the final deployable contract consumed by ReactEdge.
 *
 * Before a contract is published, it passes through a series of
 * framework-level transformations to ensure it is suitable for
 * deployment regardless of the widget implementation.
 *
 * Current responsibilities:
 *
 * - Resolve placeholder tags (e.g. {{TARGET_URL}}, {{WP_CDN_URL}}).
 * - Remove runtime-only data from dynamic widgets.
 *
 * Widget authors should provide contracts that are convenient for
 * local development. The deployment pipeline is responsible for
 * transforming those contracts into deployment-ready artifacts.
 *
 * This keeps widget development friction low while ensuring runtime
 * integrations (such as Magento) remain responsible for supplying
 * dynamic data.
 */
export function wrapContract(
    contract: ContractWrapper
): ContractWrapper {

    let resolved =
        resolveContractTags(contract);

    resolved =
        prepareForDeployment(resolved);

    return resolved
}

/**
 * Recursively replaces template tags throughout the contract.
 *
 * This allows contracts to remain environment-agnostic while the
 * deployment pipeline injects environment-specific values.
 */
export function resolveContractTags<T>(
    value: T
): T {

    if (typeof value === 'string') {

        return value
            .replaceAll(
                '{{TARGET_URL}}',
                getConfig().targetSiteUrl
            )
            .replaceAll(
                '{{WP_CDN_URL}}',
                getConfig().reactedgeBaseUrl
            ) as T;
    }

    if (Array.isArray(value)) {

        return value.map(
            child =>
                resolveContractTags(child)
        ) as T;
    }

    if (
        value &&
        typeof value === 'object'
    ) {

        return Object.fromEntries(
            Object.entries(value)
                .map(([key, child]) => [
                    key,
                    resolveContractTags(child)
                ])
        ) as T;
    }

    return value;
}

/**
 * Removes runtime-managed data before the contract is deployed.
 *
 * Dynamic widgets often contain representative data to simplify local
 * development. This data must not be published because it will be
 * supplied by the host platform (e.g. Magento) at runtime.
 *
 * Today this applies to the `items` collection. Additional deployment
 * transformations may be introduced here as ReactEdge evolves.
 */
function prepareForDeployment(
    contract: ContractWrapper
): ContractWrapper {
    if (Array.isArray(contract.data.items)) {
        contract.data.items = [];
    }

    return contract
}