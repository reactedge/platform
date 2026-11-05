import {UspWidget} from "../components/UspWidget.tsx";
import {Spinner} from "../components/Spinner.tsx";
import {readWidgetConfig} from "./config/Config.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

type Props = {
    contract?: unknown
    bootstrap?: unknown
};

export const WidgetWrapper = ({ contract }: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, activity);

    if (!config) return null;

    if (config.data.slides.length === 0) return <Spinner />;

    return <UspWidget config={config} />
};

