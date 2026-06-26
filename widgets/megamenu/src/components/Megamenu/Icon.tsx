export function renderIcon(icon?: string) {
    if (!icon) return null;

    if (icon === "arrow") {
        return (
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        );
    }

    if (icon === "external") {
        return (
            <svg /* external icon */ />
        );
    }

    return null;
}
