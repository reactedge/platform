import {HealthIssue} from "../types";
import {HealthRule} from "./interface";

export class EnumInvalidRule implements HealthRule {

    id = 'enum.invalid';

    supports(issue: HealthIssue): boolean {
        return issue.type === 'enum.invalid';
    }
}