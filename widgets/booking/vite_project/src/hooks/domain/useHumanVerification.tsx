import {useEffect, useMemo, useState} from "react";
import {activity} from "../../activity";
import {useSystemState} from "../../state/System/useSystemState.ts";

const WINDOW_MS = 1000 * 90;

export function useHumanVerification() {
    const [token, setToken] = useState<string | null>(null);
    const [verifiedAt, setVerifiedAt] = useState<number | null>(null);
    const { cloudflareKey, isTurnstileEnabled } = useSystemState()

    const onToken = (newToken: string | null) => {
        setToken(newToken);
        setVerifiedAt(newToken ? Date.now() : null);
    };

    const isHumanVerified = useMemo(() => {
        if (!token || !verifiedAt) return false;
        return Date.now() - verifiedAt < WINDOW_MS;
    }, [token, verifiedAt]);

    activity('add-to-cart', 'Add To Cart Data',{
        cloudflareKey,
        token,
        turnstileEnabled: isTurnstileEnabled(),
        isHumanVerified
    });

    useEffect(() => {
        const onSuccess = (e: CustomEvent) => {
            onToken(e.detail.token);
        };

        const onExpired = () => {
            onToken(null);
        };

        window.addEventListener("booking:security-success", onSuccess as EventListener);
        window.addEventListener("booking:security-expired", onExpired);

        return () => {
            window.removeEventListener("booking:security-success", onSuccess as EventListener);
            window.removeEventListener("booking:security-expired", onExpired);
        };
    }, []);

    const requireVerification = () => {
        window.dispatchEvent(new CustomEvent("booking:security-required"));
    };

    const expireVerification = () => {
        onToken(null);
        window.dispatchEvent(new CustomEvent("booking:security-expired"));
    };

    return {
        token,
        onToken,
        isHumanVerified,
        requireVerification,
        expireVerification
    };
}

