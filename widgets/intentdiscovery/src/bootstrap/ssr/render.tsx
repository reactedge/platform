import { renderToString } from 'react-dom/server';
import { WIDGET_ID } from "../../Config.ts";
import { WidgetView } from "../../WidgetView.tsx";
import type { MagentoLayeredNavigation } from "../../types/domain/layered-data.types.ts"
import type { CategoryData } from "../../types/infra/magento/category.types.ts";

export interface BootstrapData {
    categoryData: CategoryData | null
    layeredData: MagentoLayeredNavigation | null
}

export const renderHtml = (config: unknown, runtime: unknown, bootstrap: BootstrapData): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={config} runtime={runtime} bootstrap={bootstrap} />
        </div>
    );
};

export { buildBootstrap } from '../../ssr/bootstrap';

export { loadRuntime } from '../../ssr/bootstrap';