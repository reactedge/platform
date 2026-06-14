export interface EventTypeOption {
    description?: string;
    duration?: number;
}


export function formatEventTypeDescription(
    option: EventTypeOption
): string {
    if (!option.description && !option.duration) {
        return "";
    }

    if (option.description && option.duration) {
        return `${option.description} Typically lasts around ${option.duration} minutes, depending on the host.`;
    }

    if (option.description) {
        return option.description;
    }

    return `Typically lasts around ${option.duration} minutes, depending on the host.`;
}