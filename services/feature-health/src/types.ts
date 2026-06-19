export interface HealthIssue {
    type: string;
    target: string;
    details: Record<string, unknown>;
}