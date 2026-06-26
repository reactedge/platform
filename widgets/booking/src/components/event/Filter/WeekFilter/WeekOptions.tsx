import {getWeeks} from "../../../../lib/date.ts";

type WeekOptionsProps = {
    weekSpan: number,
    selectedId: string;
    onSelect: (weekStart: string) => void;
};

export function WeekOptions({
    weekSpan,
    selectedId,
    onSelect
}: WeekOptionsProps) {
    return (
        <div className="booking-options" role="group" aria-label="Week selection">
            {getWeeks(weekSpan).map((week) => {
                const isSelected = selectedId === week.weekStart;

                return (
                    <button
                        key={week.weekStart}
                        type="button"
                        className={`booking-option ${isSelected ? 'is-selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => onSelect(week.weekStart)}
                    >
                            <span className="booking-option-label">
                              {week.weekLabel}
                            </span>
                    </button>
                );
            })}
        </div>
    );
}
