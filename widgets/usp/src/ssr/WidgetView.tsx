import {readWidgetConfig, type RuntimeConfig} from "../Config.ts";
import {Spinner} from "../components/Spinner.tsx";
import {UspMobileWidget} from "../components/UspMobileWidget.tsx";
import {UspWidget} from "../components/UspWidget.tsx";

type Props = {
    rawConfig: unknown;
    runtimeConfig: RuntimeConfig
};

export const WidgetView = ({ rawConfig, runtimeConfig }: Props) => {
    const config = readWidgetConfig(rawConfig);

    if (!config) return null;

    if (config.data.slides.length === 0) return <Spinner />;

    if (runtimeConfig.rendering.userAgent === 'mobile') {
        return <UspMobileWidget config={config} slides={config.data.slides} />
    }

    return <UspWidget config={config}  />
};

