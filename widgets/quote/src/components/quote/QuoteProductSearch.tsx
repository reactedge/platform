import type { ProductData } from "../../Config.ts";

type Props = {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    products: ProductData[];
    loading: boolean;
    error: Error | null;
    onAddProduct: (product: ProductData) => void;
};

function formatPrice(value: number, currency: string): string {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

export const QuoteProductSearch = ({
    searchTerm,
    onSearchTermChange,
    products,
    loading,
    error,
    onAddProduct,
}: Props) => (
    <section className="quote__product-search" aria-label="Search products">
        <label htmlFor="quote-product-search">Find a product</label>
        <input
            id="quote-product-search"
            type="search"
            value={searchTerm}
            onChange={event => onSearchTermChange(event.target.value)}
            placeholder="Search by product name"
            autoComplete="off"
            data-quote-search
        />
        {searchTerm.trim().length === 1 && <p>Enter at least 2 characters to search.</p>}
        {loading && <p role="status">Searching products…</p>}
        {error && <p role="alert">Product search failed. Please try again.</p>}
        {!loading && !error && searchTerm.trim().length >= 2 && products.length === 0 && (
            <p role="status">No matching products found.</p>
        )}
        {products.length > 0 && (
            <ul className="quote__search-results" aria-label="Search results">
                {products.map(product => (
                    <li key={product.sku}>
                        <div className="quote__search-result-info">
                            <strong>{product.name}</strong>
                            <span>SKU: {product.sku}</span>
                            <span>{formatPrice(product.unitPrice, product.currency)}</span>
                        </div>
                        <button
                            type="button"
                            className="quote__add"
                            onClick={() => onAddProduct(product)}
                            aria-label={`Add ${product.name} to quote`}
                        >
                            Add
                        </button>
                    </li>
                ))}
            </ul>
        )}
    </section>
);