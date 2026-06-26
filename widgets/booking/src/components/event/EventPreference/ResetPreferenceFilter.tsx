import {useVisitIntentState} from "../../../state/Intent/useVisitIntentState.ts";

export function ResetPreferenceAction() {
    const { resetIntent } = useVisitIntentState();

    return (
        <button
            type="button"
            className="booking-reset"
            onClick={resetIntent}
        >
            Reset selection
        </button>
    );
}
