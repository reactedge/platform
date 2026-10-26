import type { QuoteLine } from "../../hooks/domain/useQuoteLines.ts";
import { useQuoteLineActions } from "./QuoteLineActionsContext.tsx";

type Props = {
    line: QuoteLine;
    formatPrice: (value: number, currency: string) => string;
    onSetOption: (lineId: string, attributeCode: string, valueUid: string) => void;
};

export const QuoteLineItem = ({ line, formatPrice, onSetOption }: Props) => {
    const { increment, decrement, remove } = useQuoteLineActions();

    return (
        <li className="quote__line" data-quote-line={line.sku} data-quote-line-id={line.lineId}>
            {line.imageUrl ? (
                <img className="quote__line-image" src={line.imageUrl} alt={line.name} />
            ) : (
                <span className="quote__line-image quote__line-image--empty" aria-hidden="true" />
            )}
            <div className="quote__line-details">
                <strong>{line.name}</strong>
                <span className="quote__line-sku">SKU: {line.sku}</span>
                <span>{formatPrice(line.unitPrice, line.currency)} each</span>
                {line.productType === "ConfigurableProduct" && (
                    <div className="quote__line-configurable-options" data-quote-configurable-options>
                        {line.configurableOptions.length > 0 ? line.configurableOptions.map(option => (
                            <label key={option.attributeCode}>
                                <span>{option.label}</span>
                                <select
                                    aria-label={`${option.label} for ${line.name}`}
                                    value={line.selectedOptionUids[option.attributeCode] ?? ""}
                                    onChange={event => onSetOption(line.lineId, option.attributeCode, event.target.value)}
                                    data-quote-configurable-option={option.attributeCode}
                                >
                                    <option value="">Choose {option.label}</option>
                                    {option.values.map(value => (
                                        <option key={value.uid} value={value.uid}>{value.label}</option>
                                    ))}
                                </select>
                            </label>
                        )) : (
                            <span role="status">Options are unavailable for this configurable product.</span>
                        )}
                    </div>
                )}
            </div>
            <div className="quote__line-actions">
                <div className="quote__stepper" aria-label={`Quantity for ${line.name}`}>
                    <button type="button" aria-label={`Decrease ${line.name} quantity`} onClick={() => decrement(line.lineId)}>
                        −
                    </button>
                    <output aria-live="polite" data-quote-quantity={line.lineId}>{line.quantity}</output>
                    <button type="button" aria-label={`Increase ${line.name} quantity`} onClick={() => increment(line.lineId)}>
                        +
                    </button>
                </div>
                <strong className="quote__line-total">
                    {formatPrice(line.unitPrice * line.quantity, line.currency)}
                </strong>
                <button className="quote__remove" type="button" onClick={() => remove(line.lineId)}>
                    Remove
                </button>
            </div>
        </li>
    );
};
