import {ExplainerWidget} from "./components/ExplainerWidget.tsx";
import {activity} from "./activity";
import {readWidgetConfig, type WidgetConfig} from "./ExplainerConfig.ts";

type Props = {
    host: HTMLElement;
    rawConfig: WidgetConfig
};

export const ExplainerWidgetWrapper = ({ host, rawConfig }: Props) => {
    const config = readWidgetConfig(rawConfig);

    if (!config) {
        activity('failed-mount', 'Widget is not correctly configured', { host }, 'warn');
        return null;
    }

    activity('config', 'Widget config', { host, config });

    return <ExplainerWidget config={config} />
};

