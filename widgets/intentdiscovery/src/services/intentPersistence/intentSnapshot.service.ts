import type {IntentSnapshot} from "../../integration/intent/types.ts";

const STORAGE_KEY = "reactedge:suggestions";

export const intentSnapshotService = {
    load(): IntentSnapshot | null {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    merge(partial: Partial<IntentSnapshot>): IntentSnapshot {
        const current = this.load();

        const base: IntentSnapshot = current ?? {
            intentText: "",
            filtersHash: "",
            recommendations: []
        };

        const next = {
            ...base,
            ...partial
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));

        return next;
    },

    save(snapshot: IntentSnapshot) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    },

    clear() {
        sessionStorage.removeItem(STORAGE_KEY);
    }
};