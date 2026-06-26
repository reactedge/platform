export function injectStyles(shadow: ShadowRoot, cssText: string) {
    const style = document.createElement("style");
    style.textContent = cssText;
    shadow.appendChild(style);
}
