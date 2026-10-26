import type { DeliveryMethodEstimate } from "../../services/magento/MagentoDeliveryEstimator.ts";

type Props = {
    postcode: string;
    onPostcodeChange: (value: string) => void;
    methods: DeliveryMethodEstimate[];
    loading: boolean;
    error: Error | null;
    hasEstimate: boolean;
    disabled: boolean;
    hasUnconfiguredItems: boolean;
    onEstimate: () => void;
};

function formatPrice(value: number, currency: string): string {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

export const QuoteDeliveryEstimator = ({
    postcode,
    onPostcodeChange,
    methods,
    loading,
    error,
    hasEstimate,
    disabled,
    hasUnconfiguredItems,
    onEstimate,
}: Props) => (
    <section className="quote__delivery-estimator" aria-labelledby="quote-delivery-title">
        <h3 id="quote-delivery-title">Estimate delivery</h3>
        <form onSubmit={event => { event.preventDefault(); void onEstimate(); }}>
            <label htmlFor="quote-delivery-postcode">Postcode</label>
            <div className="quote__delivery-controls">
                <input
                    id="quote-delivery-postcode"
                    type="text"
                    autoComplete="postal-code"
                    value={postcode}
                    onChange={event => onPostcodeChange(event.target.value)}
                    placeholder="Enter your postcode"
                    required
                    data-quote-delivery-postcode
                />
                <button type="submit" className="quote__add" disabled={disabled || loading} data-quote-estimate-delivery>
                    {loading ? "Checking…" : "Check delivery"}
                </button>
            </div>
        </form>
        {hasUnconfiguredItems && (
            <p role="status">Choose every required option for configurable products before checking delivery.</p>
        )}
        {loading && <p role="status">Checking delivery options…</p>}
        {error && <p className="quote__delivery-error" role="alert">{error.message}</p>}
        {hasEstimate && methods.length === 0 && !error && (
            <p role="status">No delivery methods are available for this postcode.</p>
        )}
        {methods.length > 0 && (
            <ul className="quote__delivery-methods" aria-label="Estimated delivery methods">
                {methods.map(method => (
                    <li key={`${method.carrierCode}:${method.methodCode}`}>
                        <span>{method.title}</span>
                        <strong>{formatPrice(method.amount, method.currency)}</strong>
                    </li>
                ))}
            </ul>
        )}
    </section>
);
