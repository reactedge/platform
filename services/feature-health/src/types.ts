export interface HealthIssue {
    type: string;
    target: string;
    details: Record<string, unknown>;
}

export type DecisionAction =
    | 'none'
    | 'deterministic_repair'
    | 'approval_required';

export interface HealthDecision {
    instance: string;
    action: DecisionAction;
    reason: string;
    ruleIds: string[];
}

export interface Assessment {
    instance: string;
    healthy: boolean;

    result?: unknown;

    issues?: HealthIssue[];

    matches?: string[];

    error?: string;
}

export interface WidgetRegistryEntry {
    widget?: string;
    cdn: string;
    css?: string;
    ssr?: WidgetSsrConfig;
}

export interface WidgetSsrConfig {
    strategy: SsrStrategy;
    variants?: SsrVariant[];
}

export type SsrVariant =
    | 'desktop'
    | 'mobile'
    | 'tablet';

export type WidgetRegistry =
    Record<string, WidgetRegistryEntry>;

export interface SsrStrategy {

}

export interface RepairProposal {
    instance: string;
    reason: string;
    strategy: string;
    target: string;
    approvalRequired: boolean;
    value: string;
}

export interface AiRepairResponse {
    summary: string;
    proposals: RepairProposal[];
}
