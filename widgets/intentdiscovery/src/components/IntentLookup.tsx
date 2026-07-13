import {IntentDiscoveryWidget} from "./IntentDiscoveryWidget.tsx";
import {useLayoutEffect} from "react";
import {resolveIntentCategory} from "../lib/category.ts";
import type {WidgetConfig} from "../Config.ts";

export interface Props {
    config: WidgetConfig
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