import { useEffect, useRef } from "react";
import type { ProductData } from "../../Config.ts";
import type { QuoteLine } from "../../hooks/domain/useQuoteLines.ts";
import { QuoteProductPicker } from "./QuoteProductPicker.tsx";
import { QuoteItems } from "./QuoteItems.tsx";

type Props = {
    title: string;
    open: boolean;
    onClose: () => void;
    product: ProductData | null;
    productLoading: boolean;
    productError: Error | null;
    onRetry: () => void;
    candidateQuantity: number;
    onCandidateQuantityChange: (quantity: number) => void;
    onAddProduct: () => void;
    lines: QuoteLine[];
    subtotal: number;
    currency: string;
    onIncrement: (sku: string) => void;
    onDecrement: (sku: string) => void;
    onRemove: (sku: string) => void;
    colour: string;
};

function formatPrice(value: number, currency: string): string {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
    }).format(value);
}

export const QuoteDialog = ({
    title,
    open,
    onClose,
    product,
    productLoading,
    productError,
    onRetry,
    candidateQuantity,
    onCandidateQuantityChange,
    onAddProduct,
    lines,
    subtotal,
    currency,
    onIncrement,
    onDecrement,
    onRemove,
    colour,
}: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    if (!open) return null;

    return (
        <dialog
            className="quote__dialog"
            ref={dialogRef}
            aria-labelledby="quote-dialog-title"
            onClose={onClose}
            onClick={event => {
                if (event.target === event.currentTarget) dialogRef.current?.close();
            }}
            data-quote-dialog
        >
            <div className="quote__panel">
                <header className="quote__header">
                    <div>
                        <p className="quote__eyebrow">Product enquiry</p>
                        <h2 id="quote-dialog-title" style={{ color: colour }}>{title}</h2>
                    </div>
                    <button className="quote__close" type="button" aria-label="Close quote" onClick={() => dialogRef.current?.close()}>
                        <span aria-hidden="true">×</span>
                    </button>
                </header>

                <div className="quote__content">
                    <QuoteProductPicker
                        product={product}
                        loading={productLoading}
                        error={productError}
                        onRetry={onRetry}
                        quantity={candidateQuantity}
                        onQuantityChange={onCandidateQuantityChange}
                        onAdd={onAddProduct}
                    />
                    <QuoteItems
                        lines={lines}
                        formatPrice={formatPrice}
                        onIncrement={onIncrement}
                        onDecrement={onDecrement}
                        onRemove={onRemove}
                    />
                </div>

                <footer className="quote__footer">
                    <div className="quote__subtotal">
                        <span>Estimated subtotal</span>
                        <strong data-quote-subtotal>{formatPrice(subtotal, currency)}</strong>
                    </div>
                    <p>Taxes and shipping are not included. This quote does not modify your cart.</p>
                </footer>
            </div>
        </dialog>
    );
};