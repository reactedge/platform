import {unescapeHtml} from "../../../../lib/string.ts";
import {formatPrice} from "../../../../lib/price.ts";
import type {EnrichedSuggestion} from "../../../../types/infra/magento/product.types.ts";

export const SuggestionCard: React.FC<{ suggestion: EnrichedSuggestion }> = ({ suggestion }) => {
    const content = (
        <div data-role="recommendation">
            {suggestion.product.imageUrl && (
                <img
                    src={suggestion.product.imageUrl}
                    alt={suggestion.product.title}
                    loading="lazy"
                    className="re-intent-image"
                />
            )}

            <div className="re-intent-card-body">
                <div className="re-intent-product-title">
                    {suggestion.product.title}
                </div>
                <div className="rec-attributes">
                    {Object.entries(suggestion.product?.attributes || {})
                        .flatMap(([attr, values]) =>
                            values?.map(value => ({attr, value}))
                        )
                        .slice(0, 4)
                        .map(({attr, value}) => (
                            <span key={`${attr}-${value}`}>
                                {unescapeHtml(value)}
                              </span>
                        ))}
                </div>

                <div className="re-intent-meta-row">
                    <span className="re-intent-pill">
                      {suggestion.match}% match
                    </span>

                    {suggestion.product.price && (
                        <span className="re-intent-price">
                        {formatPrice(suggestion.product.price.value, suggestion.product.price.currency)}
                      </span>
                    )}
                </div>

                <div className="re-intent-reason">
                    {suggestion.reason}
                </div>
            </div>
        </div>
    )

    return suggestion.product.url ? (
        <a
            href={suggestion.product.url}
            className="re-intent-card-item"
            aria-label={suggestion.product.title}
        >
            {content}
        </a>
    ) : (
        <div className="re-intent-card-item">
            {content}
        </div>
    )
}