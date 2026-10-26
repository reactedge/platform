import { useState } from "react";
import type { ProductData, WidgetConfig } from "../../Config.ts";
import { useQuoteLines } from "./useQuoteLines.ts";
import { useMagentoProductSearch } from "../infra/useMagentoProductSearch.tsx";
import { useDeliveryEstimate } from "./useDeliveryEstimate.ts";
import type { QuoteProductFilter } from "../../services/magento/searchMagentoProducts.ts";

export function useQuoteDialogController(config: WidgetConfig) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<QuoteProductFilter>({});
    const search = useMagentoProductSearch(searchTerm, filters, setFilters);
    const quote = useQuoteLines();
    const delivery = useDeliveryEstimate(quote.lines, config.settings.countryCode);

    return {
        openDialog: () => setIsOpen(true),
        dialog: {
            title: config.data.title,
            open: isOpen,
            onClose: () => setIsOpen(false),
            colour: config.settings.colour,
        },
        search: {
            state: {
                searchTerm,
                products: search.products,
                facets: search.facets,
                filters,
                loading: search.loading,
                error: search.error,
            },
            actions: {
                onSearchTermChange: (value: string) => {
                    setFilters({});
                    setSearchTerm(value);
                },
                onToggleFilter: (attribute: string, value: string) => {
                    setFilters(current => {
                        const selected = current[attribute] ?? [];
                        const next = selected.includes(value)
                            ? selected.filter(item => item !== value)
                            : [...selected, value];
                        const updated = { ...current };
                        if (next.length) updated[attribute] = next;
                        else delete updated[attribute];
                        return updated;
                    });
                },
                onClearFilters: () => setFilters({}),
                onAddProduct: (item: ProductData) => quote.add(item, 1),
            },
        },
        quote: {
            lines: quote.lines,
            subtotal: quote.subtotal,
            currency: quote.currency,
            onIncrement: quote.increment,
            onDecrement: quote.decrement,
            onRemove: quote.remove,
            onSetOption: quote.setOption,
        },
        delivery: {
            state: {
                postcode: delivery.postcode,
                methods: delivery.methods,
                loading: delivery.loading,
                error: delivery.error,
                hasEstimate: delivery.hasEstimate,
                disabled: delivery.disabled,
                hasUnconfiguredItems: delivery.hasUnconfiguredItems,
            },
            actions: {
                onPostcodeChange: delivery.onPostcodeChange,
                onEstimate: delivery.onEstimate,
            },
        },
    };
}
