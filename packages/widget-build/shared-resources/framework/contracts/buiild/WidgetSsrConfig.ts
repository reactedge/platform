import type {SsrStrategy} from "../../../../../../services/orchestrator/deployment/schema";

export interface WidgetSsrConfig {
    strategy: SsrStrategy;
    variants?: SsrVariant[];
}

export type SsrVariant =
    | 'desktop'
    | 'mobile'
    | 'tablet';

export type SsrViewMap =
    Partial<Record<SsrVariant, string>>;