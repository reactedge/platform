import { Request, Response } from "express";
import { getRegistry, getResolvedEntry } from "../runtime/widget-resolver";
import { ZodError } from "zod";
import { mapZodError } from "../validation/zod-mapper";
import { RuleEngine } from "../repair/engine"
import { EnumInvalidRule } from "../rules/enum-invalid-rule"
import { StringMaxLengthRule } from "../rules/string-max-length-rule"

function resolveEntry(widget: string): string {
    return `${process.env.WIDGET_ROOT}/${widget}/vite_project/src/ConfigSchema.ts`;
}

export class ObserveHandler {
    validateFeatures = async (req: Request, res: Response): Promise<void> => {
        try {
            //operation.registerStart(req.headers);
            const registry = await getRegistry();
            debugger
            const assessments = [];
            const ruleEngine = new RuleEngine([
                new EnumInvalidRule(),
                new StringMaxLengthRule(),
            ]);

            for (const [instanceKey, entry] of Object.entries(registry)) {

                const registryEntry = await getResolvedEntry(registry, instanceKey)
                //operation.logObservation(payload);

                try {

                    const ConfigSchema = resolveEntry(registryEntry.type);
                    const { parseConfig } = await import(ConfigSchema);

                    const result = await parseConfig(registryEntry.entry.contract);

                    assessments.push({
                        instance: instanceKey,
                        healthy: true,
                        result
                    });

                } catch (e) {

                    //operation.logFailure(e);
                    if (e instanceof ZodError) {
                        const issues = mapZodError(e);
                        const matches = ruleEngine.match(issues);

                        assessments.push({
                            instance: instanceKey,
                            healthy: false,
                            issues,
                            matches: matches.map(rule => rule.id)
                        });
                    } else {

                        assessments.push({
                            instance: instanceKey,
                            healthy: false,
                            error: e instanceof Error
                                ? e.message
                                : 'Unknown validation error'
                        });

                    }
                }
            }

            res.json({
                healthy: assessments.every(a => a.healthy),
                assessments
            });
        } catch (e) {
            res.status(500).json({
                healthy: false,
                error: e instanceof Error ? e.message : 'Unknown error'
            });
            //operation.logCompletion(result);
        }
    }
}