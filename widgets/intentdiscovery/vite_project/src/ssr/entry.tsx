import React from 'react';
import { renderToString } from 'react-dom/server';
import type {WidgetConfig} from "../IntentDiscoveryConfig.ts";
import {WidgetView} from "../WidgetView.tsx";
import {type ReactEdgeRuntimeConfig} from "../domain/intent-discovery.types.ts";
import type {CategoryData} from "../types/infra/magento/category.types.ts";
import type {MagentoLayeredNavigation} from "../hooks/domain/useLayeredNavigation.tsx";

export interface BootstrapData {
    categoryData: CategoryData
    layeredData: MagentoLayeredNavigation
}

export const renderHtml = (config: WidgetConfig, runtimeConfig: ReactEdgeRuntimeConfig, bootstrap: BootstrapData): string => {
    return renderToString(
        <div className="reactedge-usp">
            <WidgetView rawConfig={config} runtimeConfig={runtimeConfig} bootstrapData={bootstrap} />
        </div>
    );
};

export { buildBootstrap } from './bootstrap';