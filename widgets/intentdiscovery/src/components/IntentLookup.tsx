import { IntentDiscoveryWidget } from "./IntentDiscoveryWidget.tsx";
import { useLayoutEffect } from "react";
import { resolveIntentCategory } from "../lib/category.ts";
import type { WidgetConfig } from "../bootstrap/config/Config.ts";
import { useActivityContext } from "../activity/Context/useActivityContext.ts";

export interface Props {
    config: WidgetConfig
}
export const IntentLookup = ({ config }: Props) => {
    const activity = useActivityContext()
    const category = resolveIntentCategory(config.runtime.category, config.data.enabledCategories);

    activity.log('intent-discovery', 'Intent category resolved',
        {
            runtimeCategory: config.runtime.category,
            enabledCategories: config.data.enabledCategories,
            resolvedCategory: category
        }
    );

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