// src/security/turnstileService.ts
declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, options: any) => string;
            remove: (id: string) => void;
        };
    }
}

let loadingPromise: Promise<void> | null = null;

export function ensureTurnstileLoaded(): Promise<void> {
    if (window.turnstile) {
        return Promise.resolve();
    }

    if (loadingPromise) {
        return loadingPromise;
    }

    loadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (!window.turnstile) {
                reject(new Error("Turnstile loaded but API missing"));
                return;
            }
            resolve();
        };

        script.onerror = () =>
            reject(new Error("Failed to load Cloudflare Turnstile"));

        document.head.appendChild(script);
    });

    return loadingPromise;
}

