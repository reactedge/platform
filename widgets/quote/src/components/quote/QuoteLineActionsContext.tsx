import { createContext, useContext, type ReactNode } from "react";

type QuoteLineActions = {
    increment: (sku: string) => void;
    decrement: (sku: string) => void;
    remove: (sku: string) => void;
};

const QuoteLineActionsContext = createContext<QuoteLineActions | null>(null);

type ProviderProps = {
    actions: QuoteLineActions;
    children: ReactNode;
};

export const QuoteLineActionsProvider = ({ actions, children }: ProviderProps) => (
    <QuoteLineActionsContext.Provider value={actions}>
        {children}
    </QuoteLineActionsContext.Provider>
);

export function useQuoteLineActions(): QuoteLineActions {
    const actions = useContext(QuoteLineActionsContext);
    if (!actions) {
        throw new Error("useQuoteLineActions must be used within QuoteLineActionsProvider");
    }
    return actions;
}