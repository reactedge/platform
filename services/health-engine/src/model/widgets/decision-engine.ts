import { HealthDecision, Assessment } from "./types"

export class DecisionEngine {
    decide(assessment: Assessment): HealthDecision {
        if (assessment.healthy) {
            return {
                instance: assessment.instance,
                action: 'none',
                reason: 'Widget is healthy',
                ruleIds: []
            };
        }

        const ruleIds = assessment.matches ?? [];

        if (ruleIds.length > 0) {
            return {
                instance: assessment.instance,
                action: 'deterministic_repair',
                reason: 'Matched deterministic repair rules',
                ruleIds
            };
        }

        return {
            instance: assessment.instance,
            action: 'approval_required',
            reason: 'No safe deterministic repair rule matched',
            ruleIds: []
        };
    }
}