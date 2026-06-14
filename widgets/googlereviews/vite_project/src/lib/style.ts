export function ensureGlobalStyle(id: string, href: string) {
    if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

export function injectStyles(shadow: ShadowRoot, cssText: string) {
    const style = document.createElement("style");
    style.textContent = cssText;
    shadow.appendChild(style);
}