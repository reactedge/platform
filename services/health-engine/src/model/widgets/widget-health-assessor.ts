import { getResolvedEntry } from "../../runtime/widget-resolver";
import { ZodError } from "zod";
import { mapZodError } from "../../validation/zod-mapper";
import { RuleEngine } from "../../repair/engine"
import { OpenTelemetryObserver } from "../../observability/activity"
import { Assessment, WidgetRegistry } from "./types"

function resolveEntry(widget: string): string {
    return `${process.env.WIDGET_ROOT}/${widget}/vite_project/src/ConfigSchema.ts`;
}

export class WidgetAssessment {

    static async assess(
        registry: WidgetRegistry,
        instanceKey: string,
        ruleEngine: RuleEngine,
        telemetry: OpenTelemetryObserver
    ): Promise<Assessment> {
        const registryEntry =
            await getResolvedEntry(
                registry,
                instanceKey
            );

        telemetry.logObservation(
            'health.widget.observed',
            {
                'reactedge.widget.instance': instanceKey,
                'reactedge.widget.type': registryEntry.type
            }
        );

        try {

            const ConfigSchema =
                resolveEntry(registryEntry.type);

            const { parseConfig } =
                await import(ConfigSchema);

            const result =
                await parseConfig(
                    registryEntry.entry.contract
                );

            return {
                instance: instanceKey,
                healthy: true,
                result
            };

        } catch (e) {

            if (e instanceof ZodError) {

                const issues = mapZodError(e);

                return {
                    instance: instanceKey,
                    healthy: false,
                    issues,
                    matches: ruleEngine
                        .match(issues)
                        .map(rule => rule.id)
                };
            }

            return {
                instance: instanceKey,
                healthy: false,
                error:
                    e instanceof Error
                        ? e.message
                        : 'Unknown validation error'
            };
        }
    }
}
