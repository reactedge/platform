export interface VisitIntentInfoState {
    weekIntent: string;
    eventTypeId: string;
    eventTypeGroupId: string;
    hostId: string;
}

export interface VisitIntentState {
    visitIntent: VisitIntentInfoState;
    setWeekIntent: (value: string) => void;
    setEventType: (value: string) => void;
    setEventTypeGroup: (value: string) => void;
    setEventHost: (value: string) => void;
    resetIntent: () => void;
}