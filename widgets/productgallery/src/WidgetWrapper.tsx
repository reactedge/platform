import {useActivityContext} from "./activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./Config.ts";
import {ProductGalleryWidget} from "./components/ProductGalleryWidget.tsx";

type Props = {
    rawConfig: unknown
}

export default function WidgetWrapper({rawConfig}: Props) {
    const activity = useActivityContext()
    const config = readWidgetConfig(rawConfig, activity);

    if (!config) return null;

    return <ProductGalleryWidget config={config} />
}
