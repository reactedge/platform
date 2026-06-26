import {loadContract} from "./widget-runtime/lib/contractLoader.ts";
import {activity} from "./activity";
import type {MinicartWidgetConfig} from "./components/Types.ts";
import {normalizeCurrency} from "./lib/price.ts";
import type {ResolvedMinicartConfig} from "./hooks/useWidgetConfig.ts";

export async function readWidgetConfig(
    hostElement: HTMLElement
): Promise<ResolvedMinicartConfig> {

    const contract = await loadContract(hostElement);

    const resolved = resolveWidgetConfig(contract);

    activity('bootstrap', 'Config resolved', resolved);

    return Object.freeze(resolved);
}

export function resolveWidgetConfig(
    contract: MinicartWidgetConfig,
): ResolvedMinicartConfig {

    return {
        currency: normalizeCurrency(contract.runtime.currency),
        locale: contract.runtime.locale,
        primaryColor: contract.settings?.primaryColor,
        secondaryColour: contract.settings?.secondaryColour,
        maskedCartId: null,
        isReady: contract.settings?.primaryColor !== ''
    };;
}
