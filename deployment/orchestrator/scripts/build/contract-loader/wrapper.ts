import {getConfig} from "../../config.ts";
import type {ContractWrapper} from "../types.ts";

export function wrapContract(
    contract: ContractWrapper
): ContractWrapper {

    const resolved =
        resolveContractTags(contract);

    return resolved
    // return {
    //     ...resolved,
    //     _meta: {
    //         ...(resolved._meta ?? {}),
    //         site: getConfig().targetSite
    //     }
    // };
}

export function resolveContractTags<T>(
    value: T
): T {

    if (typeof value === 'string') {

        return value
            .replaceAll(
                '{{TARGET_URL}}',
                getConfig().targetSite
            )
            .replaceAll(
                '{{WP_CDN_URL}}',
                getConfig().cdnUrl
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