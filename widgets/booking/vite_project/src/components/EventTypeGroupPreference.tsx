import {Spinner} from "./global/Spinner.tsx";
import {useConfigState} from "../state/Config/useConfigState.ts";
import type {PreferenceProps} from "../types/domain/preference.type.ts";
import {useMediaQuery} from "../hooks/ui/useMediaQuery.tsx";

export function EventTypeGroupPreference({
     value,
     onSelect
 }: PreferenceProps) {
    const { config } = useConfigState()
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (config.eventTypeGroups === undefined) return <Spinner />;
    if (config.eventTypeGroups.length <= 1) return null;

    return (
        <div className="booking-options booking-options--group"
             data-layout={isMobile ? 'mobile' : 'desktop'}>
            {config.eventTypeGroups.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    className={`booking-option ${value === option.id ? 'is-active' : ''}`}
                    onClick={() => onSelect(option.id)}
                >
                    <span className="booking-option-label">{option.label}</span>
                    {option.description && (
                        <span className="booking-option-desc">{option.description}</span>
                    )}
                </button>
            ))}
        </div>
    )
}
