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

export interface ContactUsRawConfig {
    data: ContactUsConfig
}

export interface ContactUsConfig {
    title?: string;
    intro?: string;
    endpoint: string | null;
    fields: ContactField[];
    categories?: ContactCategory[];
    cloudflareKey?: string;
}

export const defaultContactUsConfig: ContactUsConfig = {
    title: undefined,
    intro: undefined,
    endpoint: null,
    categories: [],
    fields: [],
    cloudflareKey: ''
};


export interface IntegrationConfig {
    integrations: {
        cloudflare: {
            siteKey: string;
        }
    }
}