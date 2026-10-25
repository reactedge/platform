import { useState } from "react";
import type { BootstrapData } from "../../entrypoints/ssr.tsx";
import type { ProductData, WidgetConfig } from "../../Config.ts";
import { useProductData } from "./useProductData.tsx";
import { useQuoteLines } from "./useQuoteLines.ts";
import { useMagentoProductSearch } from "../infra/useMagentoProductSearch.tsx";

export function useQuoteDialogController(config: WidgetConfig, bootstrap?: BootstrapData) {
    const [isOpen, setIsOpen] = useState(false);
    const [candidateQuantity, setCandidateQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const search = useMagentoProductSearch(searchTerm);
    const product = useProductData(config.runtime.sku, bootstrap);
    const quote = useQuoteLines();

    return {
        openDialog: () => setIsOpen(true),
        dialog: {
            title: config.data.title,
            open: isOpen,
            onClose: () => setIsOpen(false),
            colour: config.settings.colour,
        },
        product: {
            product: product.productData,
            productLoading: product.productLoading,
            productError: product.productError,
            onRetry: product.refetch,
            candidateQuantity,
            onCandidateQuantityChange: setCandidateQuantity,
            onAddProduct: () => {
                if (product.productData) {
                    quote.add(product.productData, candidateQuantity);
                    setCandidateQuantity(1);
                }
            },
        },
        search: {
            searchTerm,
            onSearchTermChange: setSearchTerm,
            searchResults: search.products,
            searchLoading: search.loading,
            searchError: search.error,
            onAddSearchProduct: (item: ProductData) => quote.add(item, 1),
        },
        quote: {
            lines: quote.lines,
            subtotal: quote.subtotal,
            currency: product.productData?.currency ?? quote.currency,
            onIncrement: quote.increment,
            onDecrement: quote.decrement,
            onRemove: quote.remove,
        },
    };
}