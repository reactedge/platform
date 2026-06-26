import type {MegaMenuSettingsConfig, MenuType, NavItem} from "../domain/megamenu.types.ts";

export function resolveDropdownLayout(
    categoryUrl: string | undefined,
    config: MegaMenuSettingsConfig | undefined
): "list" | "tiles" {
    if (!categoryUrl || config === undefined) return "list";

    try {
        // 1. Parse URL (handles absolute URLs)
        const url = new URL(categoryUrl);

        // 2. Extract last segment
        const segments = url.pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1] || "";

        // 3. Remove suffix (e.g. ".html")
        const suffix = config?.urlSuffix ?? ".html";
        const normalized = lastSegment.endsWith(suffix)
            ? lastSegment.slice(0, -suffix.length)
            : lastSegment;

        // 4. Build lookup key
        const key = `/${normalized}`;

        return config?.dropdownLayouts?.[key] ?? "list";
    } catch {
        // fallback if URL parsing fails (e.g. already a path)
        return "list";
    }
}

export function getMenuType(
    level1: NavItem,
    layout: "list" | "tiles"
): MenuType {
    const hasChildren = !!level1.children?.length;
    if (!hasChildren) return "none";

    const hasGrandChildren = level1.children!.some(
        child => child.children && child.children.length > 0
    );

    if (!hasGrandChildren) {
        return layout === "tiles" ? "simple-tiles" : "simple-list";
    }

    return "complex";
}

