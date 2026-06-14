import type {EventHost} from "../../../../types/domain/event.type.ts";

type PresenterOptionsProps = {
    hosts: EventHost[];
    selectedId: string;
    onSelect: (hostId: string) => void;
};

export function PresenterOptions({
     hosts,
     selectedId,
     onSelect,
 }: PresenterOptionsProps) {
    return (
        <div className="booking-options" role="group">
            {hosts.map((host) => {
                const isSelected = selectedId === host.id;

                return (
                    <button
                        key={host.id}
                        type="button"
                        className={`booking-option ${isSelected ? 'is-selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => onSelect(host.id)}
                    >
                        <span className="booking-option-label">
                            {host.name}
                        </span>
                    </button>
            );
            })}
            </div>
    );
}

