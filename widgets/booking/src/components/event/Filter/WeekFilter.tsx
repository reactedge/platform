import {useVisitIntentState} from "../../../state/Intent/useVisitIntentState.ts";
import {getWeeks} from "../../../lib/date.ts";
import {FilterSection} from "../FilterSection.tsx";
import {WeekOptions} from "./WeekFilter/WeekOptions.tsx";
import {useState} from "react";

export function WeekFilter({ weekSpan }: { weekSpan: number }) {
    const { visitIntent, setWeekIntent } = useVisitIntentState();
    const [isEditing, setIsEditing] = useState(false);

    function formatWeekLabel(intent: string | null, weekSpan: number): string {
        if (!intent) return "";

        const week = getWeeks(weekSpan).find(
            (week) => week.weekStart === intent
        );

        return week ? week.weekLabel : "";
    }

    if (!visitIntent.eventTypeId) return null;

    return (
        <FilterSection
            title="Week"
            isResolved={!!visitIntent.weekIntent && !isEditing}
            summary={formatWeekLabel(visitIntent.weekIntent, weekSpan)}
            onEdit={() => setIsEditing(true)}
        >
            {isEditing && (<WeekOptions
                weekSpan={weekSpan}
                selectedId={visitIntent.weekIntent}
                onSelect={(id) => {
                    setWeekIntent(id);
                    setIsEditing(false);
                }}
            />)}
        </FilterSection>
    )
}
