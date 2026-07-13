import { RepairProposal, Assessment } from "./types"
import { StringMaxLengthRepair } from "../../rules/string-maxlength-repair"
import { OpenaiRepairAgent } from "./openai-handler/ai-repair-agent";
import { config } from "../../config"

export class RepairEngine {
    constructor(
        private readonly repairs = [
            new StringMaxLengthRepair()
        ]
    ) { }

    async propose(
        assessment: Assessment
    ): Promise<RepairProposal[]> {
        const openaiAgent = new OpenaiRepairAgent();

        const response = await openaiAgent.getSuggestions(
            assessment,
            config.repairPromptVersion
        );

        return response.proposals.map(proposal => ({
            instance: assessment.instance,
            ruleId: assessment.matches?.[0] ?? 'unknown',
            reason: proposal.reason,
            strategy: proposal.strategy,
            target: proposal.target,
            before: assessment.issues?.find(
                issue => issue.target === proposal.target
            )?.details?.currentValue,
            value: proposal.value,
            approvalRequired: proposal.approvalRequired
        }));
    }
}