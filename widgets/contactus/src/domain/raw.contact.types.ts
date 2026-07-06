import type {TranslationsConfig} from "./contact.types.ts";

export interface RawWidgetConfig {
    readonly data: WidgetConfig;
    readonly integrations?: WidgetIntegrations;
    readonly translations: TranslationsConfig
}

export interface WidgetConfig {
    title: string;
    intro: string;
    endpoint: string;
    categories: ContactCategory[];
    fields: ContactField[];
}

export interface ContactCategory {
    value: string;
    label: string;
}

export interface ContactField {
    name: string;
    label: string;
    type?: "text" | "email" | "textarea";
    required: boolean;
}

export interface WidgetIntegrations {
    requires: IntegrationName[];
}

export type IntegrationName =
    | "cloudflare"
    | "googleMaps"
    | "magento"
    | "intentApi";