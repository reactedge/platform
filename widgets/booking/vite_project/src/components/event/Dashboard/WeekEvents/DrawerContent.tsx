import {useEventGroup} from "../../../../hooks/domain/useEventGroup.ts";
import {useVisitIntentState} from "../../../../state/Intent/useVisitIntentState.ts";
import {useEventType} from "../../../../hooks/domain/useEventType.tsx";
import {Spinner} from "../../../global/Spinner.tsx";
import {getGroupEvent} from "../../../../domain/booking/getGroupEvent.ts";
import {AddToCart} from "../DayEvent/AddToCart.tsx";
import {SignInOrRegister} from "../../../user-authentication/SignInOrRegister.tsx";
import {EventBookingForm} from "../DayEvent/EventBookingForm.tsx";
import {useEventState} from "../../../../state/Event/useEventState.ts";
import {SignUp} from "../../../user-authentication/SignUp.tsx";

interface ViewGroupEventProps {
    eventIds: string[]
}

export const DrawerContent: React.FC<ViewGroupEventProps> = ({ eventIds }) => {
    const { groupEvents, groupEventsLoading } = useEventGroup(eventIds)
    const {visitIntent} = useVisitIntentState();
    const { eventType, eventTypeLoading } = useEventType(visitIntent.eventTypeId)
    const { eventState, showSignIn, showBooking } = useEventState()

    if (groupEventsLoading || eventTypeLoading || groupEvents === undefined || eventType === undefined) return <Spinner/>;

    const groupEvent = getGroupEvent(eventType, groupEvents);

    return (
        <>
            <div className="drawer-content">
                {eventState.drawerContent === 'signin' && (
                    <div className="drawer-section">
                        <SignInOrRegister />
                    </div>
                )}

                {eventState.drawerContent === 'booking' &&
                    <EventBookingForm groupEvent={groupEvent} />
                }

                {eventState.drawerContent === 'signup' &&
                    <SignUp onSuccess={showBooking} onCancel={showSignIn} />
                }
            </div>
            {eventState.drawerContent === 'booking' && (<div className="drawer-actions">
                <AddToCart onRequireAuth={() => {
                    showSignIn()}
                }/>
            </div>)}
        </>
    );
}
