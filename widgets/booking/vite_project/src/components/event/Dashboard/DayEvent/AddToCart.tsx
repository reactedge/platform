import {getEventCartQty} from "../../../../domain/cart/cart.ts";
import {ErrorState} from "../../../global/ErrorState.tsx";
import {useUserState} from "../../../../state/User/useUserState.ts";
import {useEventState} from "../../../../state/Event/useEventState.ts";
import {useVisitIntentState} from "../../../../state/Intent/useVisitIntentState.ts";
import {useAddToCart} from "../../../../hooks/domain/useAddToCart.tsx";
import {useDashboardState} from "../../../../state/Dashboard/useDashboardState.ts";
import {UserState} from "../../../user-authentication/UserState.tsx";

interface AddToCartProps {
    onRequireAuth: () => void
}

export function AddToCart({onRequireAuth}: AddToCartProps) {
    const { user } = useUserState();
    const { eventState } = useEventState();
    const { visitIntent } = useVisitIntentState();
    const { addToCart, loadingAddToCart, errorAddToCart } = useAddToCart();
    const { increaseVersionNumber, setLastBookedEventId } = useDashboardState();

    const refreshDashboard = () => {
        increaseVersionNumber()
        if (eventState.activeEventId) setLastBookedEventId(eventState.activeEventId)
    }

    const handleAdd = async () => {
        if (!eventState.activeEventId) {
            alert("Select an event host for your appointment");
            return;
        }

        try {
            await addToCart({
                eventId: eventState.activeEventId,
                eventTypeId: visitIntent.eventTypeId,
                shampoo: eventState.shampoo ? 1 : 0,
                userId: user?.id || ''
            });

            refreshDashboard();
        } catch (err) {
            console.error(err);
        }
    };

    const onAddClick = async () => {
        if (!user) {
            onRequireAuth();
            return;
        }

        await handleAdd();
    };

    const activeEventId = eventState.activeEventId;

    const eventAlreadyInCart =
        !!user &&
        !!activeEventId &&
        getEventCartQty(user.cartItems, [activeEventId]) > 0;

    const canAttemptAdd =
        !!activeEventId &&
        !eventAlreadyInCart &&
        !loadingAddToCart;

    if (errorAddToCart) return <ErrorState />

    return (
        <>
            {eventAlreadyInCart && (
                <div className="in-cart">
                    <p>You&apos;re in!</p>
                </div>
            )}
            <button className="drawer-primary"
                    disabled={!canAttemptAdd}
                    onClick={onAddClick}
            >
                Book{loadingAddToCart && 'ing'} appointment+-
            </button>
            <UserState />
        </>
    );
};
