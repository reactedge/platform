export interface GroupEventInfoState {
    activeGroupEventHash: string | undefined
}

export interface GroupEventState {
    groupEventState: GroupEventInfoState,
    resetActiveGroupEvent: () => void
    toggleActiveGroupEvent: (eventIds: string[]) => void
}