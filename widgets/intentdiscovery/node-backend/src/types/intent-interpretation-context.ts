export type AiInterpretationRequest = {
    intent: Intent
    attributes: Attribute[]
}

export type Intent = {
    text: string
    signals: Record<string, Record<string, number>>
}

export type Attribute = {
    code: string
    label: string
    options: AttributeOption[]
}

export type AttributeOption = {
    label: string
    value: string
    count: number
}

export type AiInterpretationResponse = {
    filters: Record<string, string>
}

export type AttributeRole = 'filter' | 'intent' | 'derived'

export interface AttributeConfig {
    role?: AttributeRole // default = 'filter'
}

export type AttributesConfig = Record<string, AttributeConfig>

export interface InterpretationConfig {
    attributes?: AttributesConfig
    instructions?: string[]
}