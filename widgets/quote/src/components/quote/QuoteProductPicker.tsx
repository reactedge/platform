import type { ProductData } from "../../Config.ts";

type ProductState = {
    product: ProductData | null;
    loading: boolean;
    error: Error | null;
    onRetry: () => void;
};

type CandidateQuantity = {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
};

type Props = {
    product: ProductState;
    candidate: CandidateQuantity;
    onAdd: () => void;
};

function formatPrice(value: number, currency: string): string {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

export const QuoteProductPicker = ({
    product,
    candidate,
    onAdd,
}: Props) => (
    <section className="quote__product-picker" aria-labelledby="quote-product-title">
        <h3 id="quote-product-title">Add this product</h3>
        {product.loading && <p role="status">Loading product details…</p>}
        {product.error && (
            <div className="quote__error" role="alert">
                <p>Product details could not be loaded.</p>
                <button type="button" onClick={product.onRetry}>Try again</button>
            </div>
        )}
        {!product.loading && !product.error && !product.product && <p role="status">No product is available for this quote.</p>}
        {product.product && (
            <div className="quote__product">
                {product.product.imageUrl
                    ? <img src={product.product.imageUrl} alt={product.product.name} />
                    : <span className="quote__product-image-empty" aria-hidden="true" />}
                <div className="quote__product-info">
                    <strong data-quote-product-name>{product.product.name}</strong>
                    <span>SKU: {product.product.sku}</span>
                    <strong data-quote-product-price>{formatPrice(product.product.unitPrice, product.product.currency)}</strong>
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
