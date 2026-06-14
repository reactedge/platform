import {rebuildRegistry} from "./build/rebuild-registry.ts";
import {Report} from "./build/report.ts";
import {setupTelemetry} from "./build/observability/tracing.ts";
import {ConsoleObserver} from "./build/observability/observers/console-observer.ts";
import {OpenTelemetryObserver} from "./build/observability/observers/otel-observer.ts";
import {loadRegistry} from "./build/rebuild-registry/registry-loader.ts";
import {selectTarget} from "./build/target-selection.ts";
import {selectWidgets} from "./build/widget-selection.ts";
import {loadConfig} from "./config.ts";

const target = await selectTarget()
loadConfig(target);

const report = new Report();
setupTelemetry();
report.addObserver(
    new ConsoleObserver()
);

report.addObserver(
    new OpenTelemetryObserver('registry-rebuild')
);

const registry =
    loadRegistry();

report.info(
    'Registry loaded',
    {
        "widgets & instances": Object.keys(registry).length
    }
);

const widgets = await selectWidgets(registry)
rebuildRegistry(widgets, registry, report)

await new Promise(
    resolve => setTimeout(resolve, 10000)
);