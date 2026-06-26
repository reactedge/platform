export interface DashboardInfoState {
    versionNumber: number,
    lastBookedEventId: string | null
}

export interface DashboardState {
    dashboardState: DashboardInfoState
    setLastBookedEventId: (eventId: string) => void
    resetLastBookedEventId: () => void,
    increaseVersionNumber: () => void
}