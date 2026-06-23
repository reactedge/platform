import { Request, Response } from "express";
import { getRegistry, getResolvedEntry } from "../runtime/widget-resolver";
import { RuleEngine } from "../repair/engine"
import { EnumInvalidRule } from "../rules/enum-invalid-rule"
import { StringMaxLengthRule } from "../rules/string-max-length-rule"
import { OpenTelemetryObserver } from "../observability/activity"
import { WidgetAssessment } from "../model/widget-health-assessor"
import { RepairEngine } from "../model/repair-engine"

export class ObserveHandler {
    validateFeatures = async (req: Request, res: Response): Promise<void> => {
        const telemetry = req.app.locals.telemetry as OpenTelemetryObserver;

        try {
            telemetry.startOperation('health.validate_features', req.headers);
            const registry = await getRegistry();
            const assessments = [];
            const ruleEngine = new RuleEngine([
                new EnumInvalidRule(),
                new StringMaxLengthRule(),
            ]);

            for (const [instanceKey, entry] of Object.entries(registry)) {

                const assessment = await WidgetAssessment.assess(
                    registry,
                    instanceKey,
                    ruleEngine,
                    telemetry
                );

                if (!assessment.healthy) {
                    assessments.push(assessment);
                }
            }

            const repairEngine = new RepairEngine();
            const repairs = await Promise.all(assessments
                .filter(assessment => !assessment.healthy)
                .flatMap(assessment => repairEngine.propose(assessment)));

            res.json({
                healthy: assessments.every(a => a.healthy),
                assessments,
                repairs
            });

        } catch (e) {
            res.status(500).json({
                healthy: false,
                error: e instanceof Error ? e.message : 'Unknown error'
            });
            telemetry.failOperation(e);
        }
    }
}