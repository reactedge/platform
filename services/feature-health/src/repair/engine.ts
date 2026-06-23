import { HealthIssue } from '../types';
import { HealthRule } from '../rules/interface'

export class RuleEngine {

    constructor(
        private readonly rules: HealthRule[]
    ) { }

    match(
        issues: HealthIssue[]
    ): HealthRule[] {

        const matches: HealthRule[] = [];

        for (const issue of issues) {
            for (const rule of this.rules) {
                if (rule.supports(issue)) {
                    matches.push(rule);
                }
            }
        }

        return matches;
    }
}