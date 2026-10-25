import { useState } from "react";
import type { BootstrapData } from "../entrypoints/ssr.tsx";
import type { WidgetConfig } from "../Config";
import { useProductData } from "../hooks/domain/useProductData";
import { QuoteDialog } from "./quote/QuoteDialog.tsx";
import { QuoteTrigger } from "./quote/QuoteTrigger.tsx";
import { useQuoteLines } from "../hooks/domain/useQuoteLines.ts";

type Props = {
    config: WidgetConfig;
    bootstrap?: BootstrapData;
};

export const WidgetQuote = ({
     config,
     bootstrap
 }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [candidateQuantity, setCandidateQuantity] = useState(1);
    const {
        productData,
        productError,
        productLoading,
        refetch,
    } = useProductData(config.runtime.sku, bootstrap);
    const quote = useQuoteLines();

    return (
        <section className="quote" aria-label={config.data.title}>
            <QuoteTrigger title={config.data.title} onOpen={() => setIsOpen(true)} />
            <QuoteDialog
                title={config.data.title}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                product={productData}
                productLoading={productLoading}
                productError={productError}
                onRetry={refetch}
                candidateQuantity={candidateQuantity}
                onCandidateQuantityChange={setCandidateQuantity}
                onAddProduct={() => {
                    if (productData) {
                        quote.add(productData, candidateQuantity);
                        setCandidateQuantity(1);
                    }
                }}
                lines={quote.lines}
                subtotal={quote.subtotal}
                currency={productData?.currency ?? quote.currency}
                onIncrement={quote.increment}
                onDecrement={quote.decrement}
                onRemove={quote.remove}
                colour={config.settings.colour}
            />
        </section>
    );
};