import {readWidgetConfig} from "../config/Config.ts";
import {SelectionStateProvider} from "../../state/Selection/SelectionStateProvider.tsx";
import {SystemStateProvider} from "../../state/System/SystemStateProvider.tsx";
import {ProductGalleryWidget} from "../../components/ProductGalleryWidget.tsx";

type Props = {
    contract: unknown;
    bootstrap: unknown;
    runtime: unknown;
};

export const WidgetView = ({ contract, bootstrap, runtime }: Props) => {

    const config = readWidgetConfig(contract, bootstrap, runtime);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtime={config.runtime} >
        <SelectionStateProvider>
            <ProductGalleryWidget config={config} bootstrap={config.tiles} />
        </SelectionStateProvider>
    </SystemStateProvider>
};

