import { RepairProposal, Assessment } from "../types"

export class StringMaxLengthRepair {
    supports(ruleId: string): boolean {
        return ruleId === 'string.max_length';
    }


    propose(assessment: Assessment): RepairProposal[] {
        return (assessment.issues ?? [])
            .filter(issue => issue.type === 'string.max_length')
            .map(issue => ({
                instance: assessment.instance,
                ruleId: 'string.max_length',
                strategy: 'truncate_with_ellipsis',
                target: issue.target,
                approvalRequired: true
            }));
    }
}