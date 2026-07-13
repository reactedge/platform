import type { IntentEngineState, IntentSignal } from "./types.ts";
import type { IntentApiClient } from "./intentApiClient.ts";

type Listener = (state: IntentEngineState) => void;

export class IntentEngine {
    private state: IntentEngineState = {
        intentText: '',
        categoryScore: {},
        attributeScore: {},
        productScore: {},
        priceAffinity: {},
        recommendations: [],
        resultCount: 0,
        status: 'idle',
        intentInterpreted: false,
        intentInterpretationReady: false,
        searchReady: false,
    };

    private intentApiClient

    private listeners = new Set<Listener>();

    constructor(intentApiClient: IntentApiClient) {
        this.intentApiClient = intentApiClient
        this.resolveUrl()
    }

    private resolveUrl() {
        if (typeof window === 'undefined') {
            return;
        }

        const path = window.location.pathname;
        const segments = path.split("/").filter(Boolean);
        let lastSegment = segments[segments.length - 1];
        if (lastSegment?.endsWith(".html")) {
            lastSegment = lastSegment.replace(".html", "");
        }
        this.state.currentUrl = lastSegment
    }

    applySignals(signals: Record<string, Record<string, number>>) {
        // 1. reset relevant parts of state
        this.state.attributeScore = {}
        this.state.categoryScore = {}
        this.state.productScore = {}

        // 2. replay signals as events
        for (const attribute in signals) {
            for (const value in signals[attribute]) {
                this.handle({
                    type: "filter_select",
                    attribute,
                    value
                })
            }
        }
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        const snapshot: IntentEngineState = structuredClone(this.state);
        for (const listener of this.listeners) listener(snapshot);
    }

    handle(signal: IntentSignal) {
        switch (signal.type) {
            case "status_updated":
                this.state.status = signal.status;
                break;

            case "text_updated":
                this.state.intentText = signal.text;
                break;

            case "category_view":
                this.bump(this.state.categoryScore, signal.id)
                break;

            case "filter_toggle": {
                const { attribute, value } = signal;

                const isSelected =
                    this.state.attributeScore?.[attribute]?.[value];

                if (isSelected) {
                    this.handle({
                        type: "filter_deselect",
                        attribute,
                        value
                    });
                } else {
                    this.handle({
                        type: "filter_select",
                        attribute,
                        value
                    });
                }

                break;
            }

            case "filter_select":
                this.state.attributeScore[signal.attribute] = {};
                this.bump(
                    this.state.attributeScore[signal.attribute] as Record<string, number>,
                    signal.value
                );
                break;

            case "filter_deselect":
                if (!this.state.attributeScore[signal.attribute]) {
                    this.state.attributeScore[signal.attribute] = {};
                }
                this.lower(
                    this.state.attributeScore[signal.attribute] as Record<string, number>,
                    signal.value
                );
                break;

            case "product_view":
                this.bump(this.state.productScore, signal.sku);
                break;

            case "add_to_cart":
                this.bump(this.state.productScore, signal.sku);
                this.updatePriceAffinity(signal.price);
                break;
        }
        this.notify();
    }

    hydrateFromFilters(filters: Record<string, Record<string, number>>) {
        this.state.attributeScore = filters;
        this.notify();
    }

    registerUrl() {
        const path = window.location.pathname;
        const segments = path.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];

        return {
            path,
            lastSegment
        };
    }

    getState() {
        return this.state;
    }

    getApiClient() {
        return this.intentApiClient;
    }

    private bump(map: Record<string, number>, key: string) {
        map[key] = (map[key] || 0) + 1;
    }

    private lower(map: Record<string, number>, key: string) {
        const next = (map[key] || 0) - 1;
        if (next <= 0) {
            delete map[key];
        } else {
            map[key] = next;
        }
    }

    private updatePriceAffinity(price: number) {
        const { min, max, avg } = this.state.priceAffinity as any;

        (this.state.priceAffinity as any).min =
            min === undefined ? price : Math.min(min, price);

        (this.state.priceAffinity as any).max =
            max === undefined ? price : Math.max(max, price);

        (this.state.priceAffinity as any).avg =
            avg === undefined ? price : (avg + price) / 2;
    }
}

type EngineParams = {
    intentApiClient: IntentApiClient
}

export const createIntentEngine = ({ intentApiClient }: EngineParams) => new IntentEngine(intentApiClient);