export {};

declare global {
    interface Window {
        turnstile?: {
            render(
                container: HTMLElement,
                options: {
                    sitekey: string;
                    callback: (token: string) => void;
                }
            ): void;
            reset: (widgetId: string) => void;
        };
    }
}
/*
declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
        };
    }
}*/
