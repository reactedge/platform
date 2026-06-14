import type {CategoryData, MagentoCategoryChild} from "../types/infra/magento/category.types.ts";
import type {ResolvedIntentDiscoveryConfig} from "../domain/intent-discovery.types.ts";

export const categoryLayereIds = (category?: CategoryData) => {
    let ids = category?.children.map((child: MagentoCategoryChild) => {
        return child.id
    })

    if (!ids) {
        ids = []
    }
    if (category?.id) ids.push(category?.id)

    return ids
}

export const isCategoryActive = (
    categoryUrlKey: string,
    config: ResolvedIntentDiscoveryConfig
): boolean => {
    const enabledCategories =
        config.data.enabledCategories;

    if (
        enabledCategories &&
        !enabledCategories.includes(categoryUrlKey)
    ) {
        return false;
    }

    return true;
};

export const resolveIntentCategory = (
    currentCategory: string | undefined,
    enabledCategories?: string[]
): string | null => {
    if (!currentCategory) {
        return null;
    }

    if (
        enabledCategories &&
        !enabledCategories.includes(currentCategory)
    ) {
        return null;
    }

    return currentCategory;
};