import type { DeliveryMethodEstimate } from "../../services/magento/MagentoDeliveryEstimator.ts";

export type QuoteDeliveryEstimatorState = {
    postcode: string;
    methods: DeliveryMethodEstimate[];
    loading: boolean;
    error: Error | null;
    hasEstimate: boolean;
    disabled: boolean;
    hasUnconfiguredItems: boolean;
};

export type QuoteDeliveryEstimatorActions = {
    onPostcodeChange: (value: string) => void;
    onEstimate: () => Promise<void>;
};

export type QuoteDeliveryEstimatorProps = {
    state: QuoteDeliveryEstimatorState;
    actions: QuoteDeliveryEstimatorActions;
};

function formatPrice(value: number, currency: string): string {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

export const QuoteDeliveryEstimator = ({ state, actions }: QuoteDeliveryEstimatorProps) => (
    <section className="quote__delivery-estimator" aria-labelledby="quote-delivery-title">
        <h3 id="quote-delivery-title">Estimate delivery</h3>
        <form onSubmit={event => { event.preventDefault(); void actions.onEstimate(); }}>
            <label htmlFor="quote-delivery-postcode">Postcode</label>
            <div className="quote__delivery-controls">
                <input
                    id="quote-delivery-postcode"
                    type="text"
                    autoComplete="postal-code"
                    value={state.postcode}
                    onChange={event => actions.onPostcodeChange(event.target.value)}
                    placeholder="Enter your postcode"
                    required
                    data-quote-delivery-postcode
                />
                <button type="submit" className="quote__add" disabled={state.disabled || state.loading} data-quote-estimate-delivery>
                    {state.loading ? "Checking…" : "Check delivery"}
                </button>
            </div>
        </form>
        {state.hasUnconfiguredItems && (
            <p role="status">Choose every required option for configurable products before checking delivery.</p>
        )}
        {state.loading && <p role="status">Checking delivery options…</p>}
        {state.error && <p className="quote__delivery-error" role="alert">{state.error.message}</p>}
        {state.hasEstimate && state.methods.length === 0 && !state.error && (
            <p role="status">No delivery methods are available for this postcode.</p>
        )}
        {state.methods.length > 0 && (
            <ul className="quote__delivery-methods" aria-label="Estimated delivery methods">
                {state.methods.map(method => (
                    <li key={`${method.carrierCode}:${method.methodCode}`}>
                        <span>{method.title}</span>
                        <strong>{formatPrice(method.amount, method.currency)}</strong>
                    </li>
                ))}
            </ul>
        )}
    </section>
);
