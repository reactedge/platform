import { useCallback, useState } from "react";
import type { ProductData } from "../../Config.ts";

export type QuoteLine = ProductData & {
    quantity: number;
};

function calculateSubtotal(lines: QuoteLine[]): number {
    return lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
}

export function useQuoteLines() {
    const [lines, setLines] = useState<QuoteLine[]>([]);

    const add = useCallback((product: ProductData, quantity: number) => {
        const amount = Math.max(1, Math.min(99, Math.floor(quantity)));
        setLines(current => {
            const existing = current.find(line => line.sku === product.sku);
            if (existing) {
                return current.map(line => line.sku === product.sku
                    ? { ...line, quantity: Math.min(99, line.quantity + amount) }
                    : line);
            }
            return [...current, { ...product, quantity: amount }];
        });
    }, []);

    const increment = useCallback((sku: string) => {
        setLines(current => current.map(line => line.sku === sku
            ? { ...line, quantity: Math.min(99, line.quantity + 1) }
            : line));
    }, []);

    const decrement = useCallback((sku: string) => {
        setLines(current => current.flatMap(line => {
            if (line.sku !== sku) return [line];
            return line.quantity > 1 ? [{ ...line, quantity: line.quantity - 1 }] : [];
        }));
    }, []);

    const remove = useCallback((sku: string) => {
        setLines(current => current.filter(line => line.sku !== sku));
    }, []);

    return {
        lines,
        subtotal: calculateSubtotal(lines),
        currency: lines[0]?.currency ?? "USD",
        add,
        increment,
        decrement,
        remove,
    };
}