export interface PreferenceOption {
    id: string
    label: string
}

export interface PreferenceProps {
    value?: string
    onSelect: (id: string) => void
}

export interface BookingWidgetConfig {
    selections?: {
        week?: string
        eventTypeGroup?: string
        eventType?: string
    }
    options?: {
        week: PreferenceOption[]
        eventTypeGroup: PreferenceOption[]
        eventType: PreferenceOption[]
    }
    labels?: {
        week?: string
        eventTypeGroup?: string
        eventType?: string
    }
    venueName?: string
}