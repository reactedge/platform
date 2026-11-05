import { useCategory } from "../hooks/domain/useCategory.tsx";
import { IntentDiscoveryLoader } from "./IntentDiscovery/IntentDiscoveryLoader.tsx";
import { SpinnerOverlay } from "./global/SpinnerOverlay.tsx";
import type { WidgetConfig } from "../bootstrap/config/Config.ts";
import { useEffect } from "react";
import { useActivityContext } from "../activity/Context/useActivityContext.ts";

type Props = {
    config: WidgetConfig
    categoryUrlKey: string
};

export const IntentDiscoveryWidget = ({ config, categoryUrlKey }: Props) => {
    const activity = useActivityContext()
    const { categoryData, categoryError, categoryLoading } =
        useCategory(categoryUrlKey);

    useEffect(() => {
        if (!categoryData) return;

        activity.log('intent-discovery', 'Intent category data loaded',
            {
                categoryUrlKey,
                categoryData
            }
        );
    }, [activity, categoryUrlKey, categoryData]);

    if (categoryLoading) return <SpinnerOverlay />;
    if (categoryError) return null; // if the connection to Magento fails, we fail silently
    if (!categoryData) return null;

    return (
        <IntentDiscoveryLoader
            config={config.data}
            categoryData={categoryData}
        />
    );
};
