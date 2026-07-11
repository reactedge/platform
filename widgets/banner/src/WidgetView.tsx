import {readWidgetConfig} from "./Config.ts";
import {BannerStatic} from "./components/BannerStatic.tsx";
import {Spinner} from "./components/Spinner.tsx";

type Props = {
    rawConfig: unknown;
};

export const WidgetView = ({ rawConfig }: Props) => {
    const config = readWidgetConfig(rawConfig);

    if (!config) return null;

    if (config.slides.length === 0) return <Spinner />;

    return <BannerStatic slides={config.slides} config={config.settings} />;
};

