export type FieldType = "text" | "email" | "textarea";

export interface ContactField {
    name: string;
    label: string;
    type?: FieldType;
    required?: boolean;
}

export interface ContactCategory {
    value: string;
    label: string;
}

export interface WidgetConfig {
    title?: string;
    intro?: string;
    endpoint: string | null;
    fields: ContactField[];
    categories?: ContactCategory[];
    integrations: {
        cloudflareKey?: string;
    }
    readonly translations?: TranslationsConfig
}

export type TranslationsConfig = Record<string, string> | undefined;

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
}

export interface ReactEdgeRuntimeIntegrations {
    readonly cloudflare: {
        readonly siteKey: string;
    };
}