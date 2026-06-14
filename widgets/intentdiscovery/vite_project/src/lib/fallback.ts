export function fallback(root: HTMLElement) {
    const container = root.parentNode;
    const fallback = container?.querySelector(".fallback");

    if (!fallback) return;

    try {
        fallback.setAttribute("style", "display: none");
    } catch {
        // fallback stays visible
    }
}
