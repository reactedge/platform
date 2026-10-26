import { useCallback, useRef, useState } from "react";
import type { ProductData } from "../../Config.ts";

export type QuoteLine = ProductData & {
    lineId: string;
    quantity: number;
    selectedOptionUids: Record<string, string>;
};

function calculateSubtotal(lines: QuoteLine[]): number {
    return lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
}

export function useQuoteLines() {
    const [lines, setLines] = useState<QuoteLine[]>([]);
    const nextLineId = useRef(0);

    const add = useCallback((product: ProductData, quantity: number) => {
        const amount = Math.max(1, Math.min(99, Math.floor(quantity)));
        setLines(current => {
            const isConfigurable = product.productType === "ConfigurableProduct";
            const existing = isConfigurable
                ? undefined
                : current.find(line => line.sku === product.sku && line.productType !== "ConfigurableProduct");
            if (existing) {
                return current.map(line => line.lineId === existing.lineId
                    ? { ...line, quantity: Math.min(99, line.quantity + amount) }
                    : line);
            }
            nextLineId.current += 1;
            return [...current, {
                ...product,
                lineId: `${product.sku}-${nextLineId.current}`,
                quantity: amount,
                selectedOptionUids: {},
            }];
        });
    }, []);

    const increment = useCallback((lineId: string) => {
        setLines(current => current.map(line => line.lineId === lineId
            ? { ...line, quantity: Math.min(99, line.quantity + 1) }
            : line));
    }, []);

    const decrement = useCallback((lineId: string) => {
        setLines(current => current.flatMap(line => {
            if (line.lineId !== lineId) return [line];
            return line.quantity > 1 ? [{ ...line, quantity: line.quantity - 1 }] : [];
        }));
    }, []);

    const remove = useCallback((lineId: string) => {
        setLines(current => current.filter(line => line.lineId !== lineId));
    }, []);

    const setOption = useCallback((lineId: string, attributeCode: string, valueUid: string) => {
        setLines(current => current.map(line => line.lineId === lineId
            ? { ...line, selectedOptionUids: { ...line.selectedOptionUids, [attributeCode]: valueUid } }
            : line));
    }, []);

    return {
        lines,
        subtotal: calculateSubtotal(lines),
        currency: lines[0]?.currency ?? "USD",
        add,
        increment,
        decrement,
        remove,
        setOption,
    };
}
