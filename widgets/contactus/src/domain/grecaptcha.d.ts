export {};

declare global {
    interface Window {
        gcloudflare: {
            // Common
            ready(cb: () => void): void;

            // v2 (checkbox)
            render(
                container: string | HTMLElement,
                parameters: {
                    sitekey: string;
                    callback?: (token: string) => void;
                    "expired-callback"?: () => void;
                    "error-callback"?: () => void;
                }
            ): number;

            reset(opt_widget_id?: number): void;

            // v3 (invisible)
            execute(
                siteKey: string,
                options: { action: string }
            ): Promise<string>;
        };
    }
}
