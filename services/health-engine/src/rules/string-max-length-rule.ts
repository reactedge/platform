import {HealthIssue} from "../types";
import {HealthRule} from "./interface";

export class StringMaxLengthRule implements HealthRule {

    id = 'string.max_length';

    supports(issue: HealthIssue): boolean {
        return issue.type === 'string.max_length';
    }
}