import {WIDGET_ID} from "../Config.ts";
const debugTargets = getDebugTargets();

function getDebugTargets(): string[] | null {
    if (typeof window === 'undefined') {
        return [];
    }

    const params = new URLSearchParams(window.location.search);
    const value = params.get('re-debug');

    if (!value) return null;

    if (value === "1" || value === "all") return ["all"];

    return value.split(",").map(v => v.trim().toLowerCase());
}

export const isActivityEnabled = () => debugTargets &&
    (debugTargets.includes("all") || debugTargets.includes(WIDGET_ID));