import {useMemo} from "react";
import type {FilterParams} from "../../types/domain/types.ts";
import {buildEventFilter} from "../infra/filters/buildEventFilter.ts";

export const useFilter = (params: FilterParams | undefined) => {
    return useMemo(() => {
        if (!params
            || params.eventHostIds === undefined
            || params.venueId === undefined
        ) {
            return undefined;
        }

        return buildEventFilter({
            eventTypeId: params.eventTypeId,
            weekStart: params.weekStart,
            venueId: params.venueId,
            eventHostIds: params.eventHostIds,
        });
    }, [
        params?.eventTypeId,
        params?.weekStart,
        params?.venueId,
        params?.eventHostIds,
    ]);
};


