import type {NavItem} from "../domain/megamenu.types.ts";

function normalisePath(
    input: string,
    origin?: string
): string {
    try {
        const base =
            origin ?? 'http://localhost';

        const url = new URL(input, base);

        if (origin && url.origin === origin) {
            return (
                (url.pathname.replace(/\/+$/, '') || '/') +
                url.search +
                url.hash
            );
        }

        if (!/^https?:/.test(input)) {
            return (
                (url.pathname.replace(/\/+$/, '') || '/') +
                url.search +
                url.hash
            );
        }

        return input;
    } catch {
        return input.replace(/\/+$/, '') || '/';
    }
}

function isActiveItem(itemUrl: string | null, origin?: string): boolean {
    if (!itemUrl) return false;

    if (itemUrl === "#" || itemUrl.startsWith("#")) {
        return false;
    }

    const base =
        origin ?? 'http://localhost';

    const currentPath = base;

    return normalisePath(itemUrl) === normalisePath(currentPath);
}

function hasActiveChild(item: NavItem): boolean {
    return item.children.some(
        child =>
            isActiveItem(child.url) ||
            hasActiveChild(child)
    );
}

export function isInBreadCrumb(item: NavItem): boolean {
    return isActiveItem(item.url) ||
        hasActiveChild(item);
}
