import {useKeystoneEventDuration} from "../infra/useKeystoneEventDuration.tsx";

export const useEventDuration = (
     eventTypeId: string,
     eventId?: string
) => {
    const {
        duration,
        loadingDuration,
        errorDuration,
        refetch,
    } = useKeystoneEventDuration({eventId, eventTypeId});

    return {
        duration,
        loadingDuration,
        errorDuration,
        refetch,
    };
}