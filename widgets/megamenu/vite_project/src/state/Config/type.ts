import type {MegaMenuSettingsConfig} from "../../domain/megamenu.types.ts";


export interface ConfigState {
    settings: MegaMenuSettingsConfig | undefined;
}