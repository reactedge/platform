import { z } from 'zod';
import type {WidgetActivity} from "./activity";
import {parseConfig, WidgetConfigSchema} from "./ConfigSchema.ts";

export type WidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export interface RawWidgetConfig {
    readonly data: SearchData;
    readonly runtime: RuntimeConfig;
    readonly integrations: IntegrationsConfig;
    readonly translations: TranslationsConfig;
}

export interface SearchData {
    readonly title: string;
    readonly placeholder: string;
}

export interface RuntimeConfig {
    readonly observability: {
        enabled: boolean;
    };

    readonly failureMode: {
        enabled: boolean;
        percentage: number;
    };
}

export interface IntegrationsConfig {
    readonly searchApi?: {
        endpoint: string;
    };
}

export interface TranslationsConfig {
    readonly searchButton: string;
    readonly loading: string;
    readonly error: string;
}

export const WIDGET_ID = 'widget-observable';

export function readWidgetConfig(
    rawConfig: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawConfig);

        activity?.log(
            'bootstrap',
            'Config resolved',
            contract
        );

        return Object.freeze(contract);

    } catch (e) {
        activity?.log(
            'bootstrap',
            'Invalid widget contract',
            e instanceof Error? e.message: e,
            'error'
        );

        throw e;
    }
}