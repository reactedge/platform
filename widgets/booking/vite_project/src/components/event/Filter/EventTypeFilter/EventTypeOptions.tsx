import type {EventType} from "../../../../types/domain/types.ts";

type EventTypeOptionsProps = {
    eventTypes: EventType[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

export function EventTypeOptions({
     eventTypes,
     selectedId,
     onSelect,
 }: EventTypeOptionsProps) {
    return (
        <div className="booking-options" role="group">
            {eventTypes.map(type => {
                const isSelected = selectedId === type.id;

                return (
                    <button
                        key={type.id}
                        type="button"
                        className={`booking-option ${isSelected ? "is-selected" : ""}`}
                        aria-pressed={isSelected}
                        onClick={() => onSelect(type.id)}
                    >
                        <span className="booking-option-label">
                            {type.label}
                        </span>
                    </button>
            );
            })}
            </div>
    );
}
