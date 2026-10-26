import { useEffect, useMemo, useRef } from "react";
import type { ProductData } from "../../Config.ts";
import type { QuoteLine } from "../../hooks/domain/useQuoteLines.ts";
import { QuoteProductPicker } from "./QuoteProductPicker.tsx";
import { QuoteItems } from "./QuoteItems.tsx";
import { QuoteProductSearch } from "./QuoteProductSearch.tsx";
import { QuoteLineActionsProvider } from "./QuoteLineActionsContext.tsx";
import { QuoteDeliveryEstimator } from "./QuoteDeliveryEstimator.tsx";
import type { QuoteProductSearchState, QuoteProductSearchActions } from "./QuoteProductSearch.tsx";
import type { QuoteDeliveryEstimatorState, QuoteDeliveryEstimatorActions } from "./QuoteDeliveryEstimator.tsx";

type DialogOptions = {
    title: string;
    open: boolean;
    onClose: () => void;
    colour: string;
};

type ProductOptions = {
    product: ProductData | null;
    productLoading: boolean;
    productError: Error | null;
    onRetry: () => void;
    candidateQuantity: number;
    onCandidateQuantityChange: (quantity: number) => void;
    onAddProduct: () => void;
};

type QuoteOptions = {
    lines: QuoteLine[];
    subtotal: number;
    currency: string;
    onIncrement: (lineId: string) => void;
    onDecrement: (lineId: string) => void;
    onRemove: (lineId: string) => void;
    onSetOption: (lineId: string, attributeCode: string, valueUid: string) => void;
};

type Props = {
    dialog: DialogOptions;
    product: ProductOptions;
    search: {
        state: QuoteProductSearchState;
        actions: QuoteProductSearchActions;
    };
    quote: QuoteOptions;
    delivery: {
        state: QuoteDeliveryEstimatorState;
        actions: QuoteDeliveryEstimatorActions;
    };
};

function formatPrice(value: number, currency: string): string {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
    }).format(value);
}

export const QuoteDialog = ({ dialog, product, search, quote, delivery }: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const lineActions = useMemo(
        () => ({
            increment: quote.onIncrement,
            decrement: quote.onDecrement,
            remove: quote.onRemove,
            setOption: quote.onSetOption,
        }),
        [quote.onDecrement, quote.onIncrement, quote.onRemove, quote.onSetOption]
    );

    useEffect(() => {
        const dialogElement = dialogRef.current;
        if (!dialogElement) return;
        if (dialog.open && !dialogElement.open) dialogElement.showModal();
        if (!dialog.open && dialogElement.open) dialogElement.close();
    }, [dialog.open]);

    if (!dialog.open) return null;

    return (
        <dialog
            className="quote__dialog"
            ref={dialogRef}
            aria-labelledby="quote-dialog-title"
            onClose={dialog.onClose}
            onClick={event => {
                if (event.target === event.currentTarget) dialogRef.current?.close();
            }}
            data-quote-dialog
        >
            <div className="quote__panel">
                <header className="quote__header">
                    <div>
                        <p className="quote__eyebrow">Product enquiry</p>
                        <h2 id="quote-dialog-title" style={{ color: dialog.colour }}>{dialog.title}</h2>
                    </div>
                    <button className="quote__close" type="button" aria-label="Close quote" onClick={() => dialogRef.current?.close()}>
                        <span aria-hidden="true">×</span>
                    </button>
                </header>

                <div className="quote__content">
                    <QuoteProductSearch
                        state={search.state}
                        actions={search.actions}
                    />
                    <QuoteProductPicker
                        product={{
                            product: product.product,
                            loading: product.productLoading,
                            error: product.productError,
                            onRetry: product.onRetry,
                        }}
                        candidate={{
                            quantity: product.candidateQuantity,
                            onQuantityChange: product.onCandidateQuantityChange,
                        }}
                        onAdd={product.onAddProduct}
                    />
                    <QuoteLineActionsProvider actions={lineActions}>
                        <QuoteItems lines={quote.lines} formatPrice={formatPrice} />
                    </QuoteLineActionsProvider>
                    <QuoteDeliveryEstimator state={delivery.state} actions={delivery.actions} />
                </div>

                <footer className="quote__footer">
                    <div className="quote__subtotal">
                        <span>Estimated subtotal</span>
                        <strong data-quote-subtotal>{formatPrice(quote.subtotal, quote.currency)}</strong>
                    </div>
                    <p>Taxes are not included. Delivery estimates are shown separately. This quote does not modify your cart.</p>
                </footer>
            </div>
        </dialog>
    );
};
