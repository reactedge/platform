import type { QuoteLine } from "../../hooks/domain/useQuoteLines.ts";
import { QuoteLineItem } from "./QuoteLineItem.tsx";

type Props = {
    lines: QuoteLine[];
    formatPrice: (value: number, currency: string) => string;
};

export const QuoteItems = ({ lines, formatPrice }: Props) => (
    <section className="quote__items-section" aria-labelledby="quote-items-title">
        <div className="quote__section-heading">
            <h3 id="quote-items-title">Your quote</h3>
            <span>{lines.reduce((count, line) => count + line.quantity, 0)} items</span>
        </div>
        {lines.length === 0 ? (
            <p className="quote__empty">No products added yet.</p>
        ) : (
            <ul className="quote__lines">
                {lines.map(line => (
                    <QuoteLineItem
                        key={line.lineId}
                        line={line}
                        formatPrice={formatPrice}
                    />
                ))}
            </ul>
        )}
    </section>
);
