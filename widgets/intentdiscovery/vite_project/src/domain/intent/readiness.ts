import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";

export function computeAiReadiness(
    attributeLayerData: MagentoLayeredNavigation,
    threshold: number
): number {
    const base = attributeLayerData.baseTotalCount ?? 0;
    const filtered = attributeLayerData.totalCount ?? 0;

    if (!base || !filtered || base === filtered) {
        return 0;
    }

    const fullCoverage = base - threshold;
    const currentCoverage = filtered - threshold;

    if (currentCoverage < 0) {
        return 100;
    }

    const coverage = currentCoverage / fullCoverage;
    return Math.round(coverage * 100);
}