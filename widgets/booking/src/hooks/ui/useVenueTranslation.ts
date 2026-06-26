// src/hooks/useVenueTranslation.ts

import {useConfigState} from "../../state/Config/useConfigState.ts";
import {tr} from "../../lib/translate.ts";

export function useVenueTranslation() {
    const { config } = useConfigState();
    const venue = config.venue;

    return (key: string) => tr(key, venue);
}
