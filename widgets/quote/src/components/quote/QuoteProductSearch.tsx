import type { ProductData } from "../../Config.ts";
import type { QuoteProductFacet, QuoteProductFilter } from "../../services/magento/searchMagentoProducts.ts";

export type QuoteProductSearchState = {
    searchTerm: string;
    products: ProductData[];
    facets: QuoteProductFacet[];
    filters: QuoteProductFilter;
    loading: boolean;
    error: Error | null;
};

export type QuoteProductSearchActions = {
    onSearchTermChange: (value: string) => void;
    onToggleFilter: (attribute: string, value: string) => void;
    onClearFilters: () => void;
    onAddProduct: (product: ProductData) => void;
};

export type QuoteProductSearchProps = {
    state: QuoteProductSearchState;
    actions: QuoteProductSearchActions;
};

function formatPrice(value: number, currency: string): string {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

function mergeSelectedValues(facet: QuoteProductFacet, selectedValues: string[]) {
    const selectedOptions = selectedValues.map(value => ({ count: 0, label: value, value }));
    const availableValues = new Set(facet.options.map(option => option.value));
    return [...facet.options, ...selectedOptions.filter(option => !availableValues.has(option.value))];
}

type FacetProps = {
    facet: QuoteProductFacet;
    selectedValues: string[];
    onToggle: (attribute: string, value: string) => void;
};

const QuoteProductSearchFacet = ({ facet, selectedValues, onToggle }: FacetProps) => (
    <details className="quote__search-facet">
        <summary>{facet.label}{selectedValues.length > 0 ? ` (${selectedValues.length})` : ""}</summary>
        <div className="quote__search-facet-options">
            {mergeSelectedValues(facet, selectedValues).map(option => {
                const selected = selectedValues.includes(option.value);
                return (
                    <label key={option.value}>
                        <input
                            type="checkbox"
                            checked={selected}
                            disabled={option.count === 0 && !selected}
                            onChange={() => onToggle(facet.code, option.value)}
                        />
                        <span>{option.label}</span>
                        <small>{option.count}</small>
                    </label>
                );
            })}
        </div>
    </details>
);

type FiltersProps = {
    state: QuoteProductSearchState;
    actions: QuoteProductSearchActions;
};

const QuoteProductSearchFilters = ({ state, actions }: FiltersProps) => {
    if (state.searchTerm.trim().length < 2 || state.facets.length === 0) return null;

    return (
        <div className="quote__search-filters" aria-label="Product filters" data-quote-filters>
            <div className="quote__search-filters-heading">
                <strong>Filter products</strong>
                {Object.keys(state.filters).length > 0 && (
                    <button type="button" onClick={actions.onClearFilters} data-quote-clear-filters>
                        Clear filters
                    </button>
                )}
            </div>
            <div className="quote__search-facet-list">
                {state.facets.map(facet => (
                    <QuoteProductSearchFacet
                        key={facet.code}
                        facet={facet}
                        selectedValues={state.filters[facet.code] ?? []}
                        onToggle={actions.onToggleFilter}
                    />
                ))}
            </div>
        </div>
    );
};

type FeedbackProps = {
    state: QuoteProductSearchState;
};

const QuoteProductSearchFeedback = ({ state }: FeedbackProps) => (
    <>
        {state.searchTerm.trim().length === 1 && <p>Enter at least 2 characters to search.</p>}
        {state.loading && <p role="status">Searching products…</p>}
        {state.error && <p role="alert">Product search failed. Please try again.</p>}
        {!state.loading && !state.error && state.searchTerm.trim().length >= 2 && state.products.length === 0 && (
            <p role="status">No matching products found.</p>
        )}
    </>
);

type ResultProps = {
    product: ProductData;
    onAdd: (product: ProductData) => void;
};

const QuoteProductSearchResult = ({ product, onAdd }: ResultProps) => (
    <li>
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
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to quote`}
        >
            Add
        </button>
    </li>
);

type ResultsProps = {
    products: ProductData[];
    onAdd: (product: ProductData) => void;
};

const QuoteProductSearchResults = ({ products, onAdd }: ResultsProps) => {
    if (products.length === 0) return null;

    return (
        <ul className="quote__search-results" aria-label="Search results">
            {products.map(product => (
                <QuoteProductSearchResult key={product.sku} product={product} onAdd={onAdd} />
            ))}
        </ul>
    );
};

export const QuoteProductSearch = ({ state, actions }: QuoteProductSearchProps) => (
    <section className="quote__product-search" aria-label="Search products">
        <label htmlFor="quote-product-search">Find a product</label>
        <input
            id="quote-product-search"
            type="search"
            value={state.searchTerm}
            onChange={event => actions.onSearchTermChange(event.target.value)}
            placeholder="Search by product name"
            autoComplete="off"
            data-quote-search
        />
        <QuoteProductSearchFeedback state={state} />
        <QuoteProductSearchFilters state={state} actions={actions} />
        <QuoteProductSearchResults products={state.products} onAdd={actions.onAddProduct} />
    </section>
);
