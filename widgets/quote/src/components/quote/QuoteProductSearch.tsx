import type { ProductData } from "../../Config.ts";
import type { QuoteProductFacet, QuoteProductFilter } from "../../services/magento/fetchMagentoProductData.tsx";

type Props = {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    products: ProductData[];
    facets: QuoteProductFacet[];
    filters: QuoteProductFilter;
    onToggleFilter: (attribute: string, value: string) => void;
    onClearFilters: () => void;
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
    facets,
    filters,
    onToggleFilter,
    onClearFilters,
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
        {searchTerm.trim().length >= 2 && facets.length > 0 && (
            <div className="quote__search-filters" aria-label="Product filters" data-quote-filters>
                <div className="quote__search-filters-heading">
                    <strong>Filter products</strong>
                    {Object.keys(filters).length > 0 && (
                        <button type="button" onClick={onClearFilters} data-quote-clear-filters>
                            Clear filters
                        </button>
                    )}
                </div>
                <div className="quote__search-facet-list">
                    {facets.map(facet => {
                        const selectedValues = filters[facet.code] ?? [];
                        const options = [...facet.options];
                        for (const value of selectedValues) {
                            if (!options.some(option => option.value === value)) {
                                options.push({ count: 0, label: value, value });
                            }
                        }

                        return (
                            <details className="quote__search-facet" key={facet.code}>
                                <summary>{facet.label}{selectedValues.length > 0 ? ` (${selectedValues.length})` : ""}</summary>
                                <div className="quote__search-facet-options">
                                    {options.map(option => (
                                        <label key={option.value}>
                                            <input
                                                type="checkbox"
                                                checked={selectedValues.includes(option.value)}
                                                disabled={option.count === 0 && !selectedValues.includes(option.value)}
                                                onChange={() => onToggleFilter(facet.code, option.value)}
                                            />
                                            <span>{option.label}</span>
                                            <small>{option.count}</small>
                                        </label>
                                    ))}
                                </div>
                            </details>
                        );
                    })}
                </div>
            </div>
        )}
        {loading && <p role="status">Searching products…</p>}
        {error && <p role="alert">Product search failed. Please try again.</p>}
        {!loading && !error && searchTerm.trim().length >= 2 && products.length === 0 && (
            <p role="status">No matching products found.</p>
        )}
        {products.length > 0 && (
            <ul className="quote__search-results" aria-label="Search results">
                {products.map(product => (
                    <li key={product.sku}>
                        {product.imageUrl
                            ? <img className="quote__search-result-image" src={product.imageUrl} alt={product.name} />
                            : <span className="quote__search-result-image quote__search-result-image--empty" aria-hidden="true" />}
                        <div className="quote__search-result-info">
                            <strong>{product.name}</strong>
                            <span>SKU: {product.sku}</span>
                            <span>{formatPrice(product.unitPrice, product.currency)}</span>
                            {product.matchPercentage !== undefined && (
                                <span data-quote-match>{Math.round(product.matchPercentage)}% match</span>
                            )}
                            {product.matchReason && <span data-quote-reason>{product.matchReason}</span>}
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
