import { useEffect, useRef } from "react";
import {activity} from "../activity";
import {ensureTurnstileLoaded} from "./turnstileService.ts";
import {verifyUser} from "../domain/user/authentication.ts";
import {useUserState} from "../state/User/useUserState.ts";

type TurnstileProps = {
    siteKey: string;
    onToken: (token: string | null) => void;
    containerId: string; // 👈 REQUIRED
};

export function Turnstile({ siteKey, onToken, containerId }: TurnstileProps) {
    const widgetId = useRef<string | null>(null);
    const { config } = useUserState()

    useEffect(() => {
        let cancelled = false;

        ensureTurnstileLoaded().then(() => {
            if (cancelled || !window.turnstile) return;

            const container = document.getElementById(containerId);

            if (!container) {
                activity('turnstile-load', `[turnstile] container #${containerId} not found`,{
                    containerId,
                    siteKey
                });
                return;
            }

            widgetId.current = window.turnstile.render(container, {
                sitekey: siteKey,
                callback: (token: string) => {
                    verifyUser(config, token)
                    onToken(token)
                },
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
