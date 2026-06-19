import 'dotenv/config';
import express from 'express';
import { getResolvedEntry, getRegistry } from "./runtime/widget-resolver"
import { FeatureHealthOperation } from "./feature-health-operation";
import {mapZodError} from "./validation/zod-mapper";
import {RuleEngine} from "./repair/engine"
import { ZodError } from 'zod';
import { StringMaxLengthRule } from './rules/string-max-length-rule';
import { EnumInvalidRule } from './rules/enum-invalid-rule';

const app = express();
app.use(express.json());

if (process.env.ALLOW_SELF_SIGNED_SSL === 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

function resolveEntry(widget: string): string {
    return `${process.env.WIDGET_ROOT}/${widget}/vite_project/src/ConfigSchema.ts`;
}

//const operation = new FeatureHealthOperation();

export const ruleEngine = new RuleEngine([
    new StringMaxLengthRule(),
    new EnumInvalidRule()
]);

app.post('/observe', async (req, res) => {
    try {
        //operation.registerStart(req.headers);
        const registry = await getRegistry();

        const assessments = [];

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
});

app.listen(process.env.HEALTH_PORT, '0.0.0.0', () => {
    console.log(`Widgets Feature Health runtime listening on port ${process.env.HEALTH_PORT}`);
});