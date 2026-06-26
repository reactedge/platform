import type {AttributeFilters} from "../../integration/intent/types.ts";

export type PersistedIntentV1 = {
    v: 1;
    categoryScore: Record<string, number>
    attributeScore: AttributeFilters
    ts: number;
};

const STORAGE_KEY = "intent:v1";
const TTL = 24 * 60 * 60 * 1000; // 24h

export const intentPersistence = {
    save(state: {
        categoryScore: Record<string, number>
        attributeScore: AttributeFilters
    }) {
        const payload: PersistedIntentV1 = {
            v: 1,
            attributeScore: state.attributeScore,
            categoryScore: state.categoryScore,
            ts: Date.now(),
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            // fail silently — persistence is non-critical
        }
    },

    isEmpty(): boolean {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return true;

            const parsed = JSON.parse(raw) as PersistedIntentV1;

            if (parsed.v !== 1) return true;

            const isExpired = Date.now() - parsed.ts > TTL;
            if (isExpired) return true;

            return false;
        } catch {
            return true;
        }
    },
    load(): PersistedIntentV1 | null {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;

            const parsed = JSON.parse(raw) as PersistedIntentV1;

            if (parsed.v !== 1) return null;

            const isExpired = Date.now() - parsed.ts > TTL;
            if (isExpired) return null;

            return parsed;
        } catch {
            return null;
        }
    },

    clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // ignore
        }
    },
};