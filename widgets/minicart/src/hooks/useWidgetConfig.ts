import { useEffect, useState } from "react";
import {activity} from "../activity";
import {readWidgetConfig} from "../MinicartConfig.ts";

export interface ResolvedMinicartConfig {
    currency: string;
    locale: string;
    primaryColor?: string;
    secondaryColour?: string
    maskedCartId?: string | null;
    isReady: boolean
}

export function useWidgetConfig(
    host: HTMLElement
): {
    config: ResolvedMinicartConfig | null;
    error: Error | null;
    loading: boolean;
} {
    const [config, setConfig] = useState<ResolvedMinicartConfig | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const bootstrap = async () => {
            try {
                setLoading(true);
                // const ctx = {
                //     currency: undefined,
                //     locale: undefined,
                //     masked_cart_id: undefined
                // } //await fetchWidgetContext();

                const resolved = await readWidgetConfig(host);

                if (!cancelled) {
                    setConfig(resolved);
                    setError(null);
                }
            } catch (err) {
                activity('bootstrap', 'Config error', {
                    error: (err as Error).message
                });

                if (!cancelled) {
                    setError(err as Error);
                    setConfig(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        bootstrap();

        return () => {
            cancelled = true;
        };

    }, [host]);

    return { config, error, loading };
}
