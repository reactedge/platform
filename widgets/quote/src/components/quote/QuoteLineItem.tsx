import type { QuoteLine } from "../../hooks/domain/useQuoteLines.ts";
import { useQuoteLineActions } from "./QuoteLineActionsContext.tsx";

type Props = {
    line: QuoteLine;
    formatPrice: (value: number, currency: string) => string;
};

export const QuoteLineItem = ({ line, formatPrice }: Props) => {
    const { increment, decrement, remove } = useQuoteLineActions();

    return (
        <li className="quote__line" data-quote-line={line.sku}>
            {line.imageUrl ? (
                <img className="quote__line-image" src={line.imageUrl} alt={line.name} />
            ) : (
                <span className="quote__line-image quote__line-image--empty" aria-hidden="true" />
            )}
            <div className="quote__line-details">
                <strong>{line.name}</strong>
                <span className="quote__line-sku">SKU: {line.sku}</span>
                <span>{formatPrice(line.unitPrice, line.currency)} each</span>
            </div>
            <div className="quote__line-actions">
                <div className="quote__stepper" aria-label={`Quantity for ${line.name}`}>
                    <button type="button" aria-label={`Decrease ${line.name} quantity`} onClick={() => decrement(line.sku)}>
                        −
                    </button>
                    <output aria-live="polite" data-quote-quantity={line.sku}>{line.quantity}</output>
                    <button type="button" aria-label={`Increase ${line.name} quantity`} onClick={() => increment(line.sku)}>
                        +
                    </button>
                </div>
                <strong className="quote__line-total">
                    {formatPrice(line.unitPrice * line.quantity, line.currency)}
                </strong>
                <button className="quote__remove" type="button" onClick={() => remove(line.sku)}>
                    Remove
                </button>
            </div>
        </li>
    );
};