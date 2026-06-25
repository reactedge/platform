import {HealthIssue} from "../types";

export interface HealthRule {
    id: string;

    supports(issue: HealthIssue): boolean;
}
