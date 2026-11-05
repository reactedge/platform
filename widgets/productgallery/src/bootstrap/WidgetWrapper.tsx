import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./config/Config.ts";
import {SystemStateProvider} from "../state/System/SystemStateProvider.tsx";
import {ProductGalleryWidget} from "../components/ProductGalleryWidget.tsx";
import {SelectionStateProvider} from "../state/Selection/SelectionStateProvider.tsx";

type Props = {
    contract: unknown,
    bootstrap: unknown,
    runtime: unknown;
}

export default function WidgetWrapper({contract, bootstrap, runtime}: Props) {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, bootstrap, runtime, activity);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtime={config.runtime} activity={activity}>
            <SelectionStateProvider activity={activity}>
                <ProductGalleryWidget
                    config={config}
                    bootstrap={config.tiles}
                />
            </SelectionStateProvider>
    </SystemStateProvider>
}