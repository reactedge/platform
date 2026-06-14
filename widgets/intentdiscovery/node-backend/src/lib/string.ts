export const escapeHtml = (unsafe: unknown): string => {
    if (unsafe === undefined || unsafe === null || typeof unsafe !== "string") {
        return '';
    }

    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
