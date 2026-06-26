import {useEffect, useState} from "react";
import type {MinicartData} from "../components/Types.ts";
import {loadMagentoCart} from "../services/magentoCartService.ts";
import {loadContract} from "../widget-runtime/lib/contractLoader.ts";

export function useMagentoCart(hostElement: HTMLElement) {
    const [cart, setCart] = useState<MinicartData | null>(null);

    useEffect(() => {
        const reload = async () => {
            const contract = await loadCartFromContract(hostElement);
            setCart(contract);
        };

        window.addEventListener("cart:changed", reload);
        return () => window.removeEventListener("cart:changed", reload);

    }, []);

    useEffect(() => {
        const loadInitial = async () => {
            const contract = await loadCartFromContract(hostElement);
            setCart(contract);
        };

        loadInitial();
    }, []);

    return { cart };
}

async function loadCartFromContract(hostElement: HTMLElement) {
    const contract = await loadContract(hostElement);
    if (contract) {
        return contract.data;
    }

    const updated = await loadMagentoCart();
    return updated;
}