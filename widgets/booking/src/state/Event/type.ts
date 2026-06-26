type DrawerContent =
    | 'booking'
    | 'signin'
    | 'signup';

export interface EventInfoState {
    activeEventId: string | undefined,
    shampoo: boolean,
    drawerContent: DrawerContent
}

export interface EventState {
    eventState: EventInfoState,
    resetActiveEvent: () => void
    toggleActiveEvent: (id: string) => void
    toggleShampooEvent: () => void,
    showBooking: () => void,
    showSignIn: () => void,
    showSignUp: () => void,
}