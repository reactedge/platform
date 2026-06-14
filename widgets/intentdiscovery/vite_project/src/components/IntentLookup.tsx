import React from "react";
import type {ResolvedIntentDiscoveryConfig} from "../domain/intent-discovery.types.ts";
import {IntentDiscoveryWidget} from "./IntentDiscoveryWidget.tsx";
import {useLayoutEffect} from "react";
import {resolveIntentCategory} from "../lib/category.ts";

export interface Props {
    config: ResolvedIntentDiscoveryConfig
}
export const IntentLookup = ({ config }: Props) => {
    const category = resolveIntentCategory(config.runtime.category, config.data.enabledCategories);

    useLayoutEffect(() => {
        if (!category) return

        window.dispatchEvent(
            new CustomEvent('reactedge:widget-rendered', {
                detail: { widget: 'intentdiscovery' }
            })
        );
    }, [category]);

    if (!category) return null;

    return (
        <IntentDiscoveryWidget config={config} categoryUrlKey={category} />
    )
}