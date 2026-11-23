import { renderToString } from 'react-dom/server';
import { WidgetComponent } from "../widget-ssr-component.tsx";

export const renderHtml = (config: unknown): string => {
    return renderToString(<WidgetComponent contract={config} />);
};
