import {UspWidget} from "./components/UspWidget.tsx";
import {Spinner} from "./components/Spinner.tsx";
import {type RawWidgetConfig, readWidgetConfig} from "./Config.ts";
import {useActivityContext} from "./activity/Context/useActivityContext.ts";

type Props = {
    rawConfig: RawWidgetConfig;
};

export const WidgetWrapper = ({ rawConfig }: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(rawConfig, activity);

    if (!config) return null;

    if (config.data.slides.length === 0) return <Spinner />;

    return <UspWidget config={config} />
};

