import { createContext, useContext, type ReactNode } from "react";

type QuoteLineActions = {
    increment: (lineId: string) => void;
    decrement: (lineId: string) => void;
    remove: (lineId: string) => void;
    setOption: (lineId: string, attributeCode: string, valueUid: string) => void;
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
