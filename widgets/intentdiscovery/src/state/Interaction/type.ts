export interface OptionSelection {
    code: string
    value: string
}

export interface InteractionInfoState {
    navigation: {
        activeAttribute: string | null
    },
    selection: {
        selectedOptions: OptionSelection[]
        focusedOptionCode?: string
    }
}

export interface InteractionState {
    interactionState: InteractionInfoState
    setActiveAttribute: (attributeCode: string) => void
    setFocusedOption: (value: string) => void
}
