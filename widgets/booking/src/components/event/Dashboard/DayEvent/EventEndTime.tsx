import {getTime} from "../../../../lib/date.ts";
import {useEventDuration} from "../../../../hooks/domain/useEventDuration.tsx";
import {useEventState} from "../../../../state/Event/useEventState.ts";
import {useVisitIntentState} from "../../../../state/Intent/useVisitIntentState.ts";
import {Spinner} from "../../../global/Spinner.tsx";
import {ErrorState} from "../../../global/ErrorState.tsx";

export const EventEndTime: React.FC = () => {
    const { eventState} = useEventState()
    const { visitIntent } = useVisitIntentState()
    const {duration, loadingDuration, errorDuration} = useEventDuration(
        visitIntent.eventTypeId,
        eventState.activeEventId
    )

    if (loadingDuration) return <Spinner />
    if (duration === undefined) return null;
    if (errorDuration) return  <ErrorState />

    return (
        <span className="title">{getTime(duration)}</span>
    )
}