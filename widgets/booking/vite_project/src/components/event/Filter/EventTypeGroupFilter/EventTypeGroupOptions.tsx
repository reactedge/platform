import type {EventTypeGroup} from "../../../../types/domain/types.ts";

type EventTypeGroupOptionsProps = {
    eventTypeGroups: EventTypeGroup[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

export function EventTypeGroupOptions({
     eventTypeGroups,
     selectedId,
     onSelect,
 }: EventTypeGroupOptionsProps) {
    return (
        <div className="booking-options" role="group">
            {eventTypeGroups.map(type => {
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
