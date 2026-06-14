import {useEffect, useState} from "react";
import {activity} from "../activity";
import {readWidgetConfig} from "../TrustpilotConfig.ts";
import type {ResolvedTrustpilotConfig} from "../domain/trustpilot.types.ts";

export function useWidgetConfig(
    host: HTMLElement
): {
    config: ResolvedTrustpilotConfig | null;
    error: Error | null;
    loading: boolean;
} {

    const [config, setConfig] = useState<ResolvedTrustpilotConfig | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            try {
                setLoading(true);
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
        }

        bootstrap();

        return () => {
            cancelled = true;
        };

    }, [host]);

    return { config, error, loading };
}






