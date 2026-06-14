import {WIDGET_ID} from "../mountWidget.tsx";

const debugTargets = getDebugTargets();

function getDebugTargets(): string[] | null {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('re-debug');

    if (!value) return null;

    if (value === "1" || value === "all") return ["all"];

    return value.split(",").map(v => v.trim().toLowerCase());
}

export const isActivityEnabled = () => debugTargets &&
    (debugTargets.includes("all") || debugTargets.includes(WIDGET_ID));