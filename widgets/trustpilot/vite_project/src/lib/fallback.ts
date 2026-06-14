import {activity} from "../activity";
import {WIDGET_ID} from "../mountWidget.tsx";

export function fallback() {
    const fallbackId = `.${WIDGET_ID}-fallback`
    const fallback = document?.querySelector(fallbackId);

    if (!fallback) {
        activity('fallback', 'Fallback not found', fallbackId, 'error');
        return;
    }

    try {
        fallback.setAttribute("style", "display: none");
        activity('fallback', 'Fallback disabled', fallback);
    } catch {
        // fallback stays visible
    }
}
