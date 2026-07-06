import { useEffect, useRef } from "react";
import { ensureTurnstileLoaded } from "../security/turnstileService";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

type TurnstileProps = {
    siteKey: string;
    onToken: (token: string | null) => void;
    containerId: string; // 👈 REQUIRED
};

export function Turnstile({ siteKey, onToken, containerId }: TurnstileProps) {
    const widgetId = useRef<string | null>(null);
    const activity = useActivityContext()

    useEffect(() => {
        let cancelled = false;

        ensureTurnstileLoaded().then(() => {
            if (cancelled || !window.turnstile) return;

            const container = document.getElementById(containerId);

            if (!container) {
                activity.log('turnstile-load', `[turnstile] container #${containerId} not found`,{
                    containerId,
                    siteKey
                });
                return;
            }

            widgetId.current = window.turnstile.render(container, {
                sitekey: siteKey,
                callback: onToken,
                "expired-callback": () => onToken(null),
            });
        });

        return () => {
            cancelled = true;
            if (widgetId.current && window.turnstile) {
                window.turnstile.remove(widgetId.current);
            }
        };
    }, [siteKey, containerId]);

    return null;
}
