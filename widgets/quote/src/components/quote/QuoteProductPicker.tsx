import type { ProductData } from "../../Config.ts";

type Props = {
    product: ProductData | null;
    loading: boolean;
    error: Error | null;
    onRetry: () => void;
    candidate: {
        quantity: number;
        onQuantityChange: (quantity: number) => void;
    };
    onAdd: () => void;
};

function formatPrice(value: number, currency: string): string {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

export const QuoteProductPicker = ({
    product,
    loading,
    error,
    onRetry,
    candidate,
    onAdd,
}: Props) => (
    <section className="quote__product-picker" aria-labelledby="quote-product-title">
        <h3 id="quote-product-title">Add this product</h3>
        {loading && <p role="status">Loading product details…</p>}
        {error && (
            <div className="quote__error" role="alert">
                <p>Product details could not be loaded.</p>
                <button type="button" onClick={onRetry}>Try again</button>
            </div>
        )}
        {!loading && !error && !product && <p role="status">No product is available for this quote.</p>}
        {product && (
            <div className="quote__product">
                {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.name} />
                    : <span className="quote__product-image-empty" aria-hidden="true" />}
                <div className="quote__product-info">
                    <strong data-quote-product-name>{product.name}</strong>
                    <span>SKU: {product.sku}</span>
                    <strong data-quote-product-price>{formatPrice(product.unitPrice, product.currency)}</strong>
                </div>
                <label className="quote__candidate-quantity">
                    <span>Qty</span>
                    <input
                        type="number"
                        min="1"
                        max="99"
                        value={candidate.quantity}
                        onChange={event => candidate.onQuantityChange(Math.max(1, Math.min(99, Number(event.target.value) || 1)))}
                        data-quote-candidate-quantity
                    />
                </label>
                <button type="button" className="quote__add" onClick={onAdd} data-quote-add>
                    Add to quote
                </button>
            </div>
        )}
    </section>
);