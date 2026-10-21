---
name: express-service
description: Create an Express service under ReactEdge platform services/ using the Operational Intelligence MCP scaffold.
---

# Express service creation

Use when creating a new Express service in `reactedge/platform/services/`.

Follow the mandatory root `AGENTS.md` standards. This skill describes the task procedure, not the quality gates.

## Sources of truth

- Destination: `reactedge/platform/services/<service-name>`.
- Scaffold: the Express service creation operation exposed by the Operational Intelligence MCP associated with `reactedge/operational-intelligence`. Discover its real schema and output; do not invent tool names or parameters.
- Implementation conventions: established patterns in `reactedge/platform/services/`. Do not substitute conventions from unrelated platform areas.

## Procedure

1. Establish service name, responsibility, API routes/contracts, dependencies, configuration, and expected behavior.
2. Inspect existing platform services and discover the Operational Intelligence MCP Express scaffold operation and its arguments.
3. Invoke MCP to scaffold under `services/<service-name>`; verify the target and avoid overwriting unrelated files. Do not manually recreate the scaffold.
4. Run an MCP service-structure validator if available. If not, inspect against the documented scaffold contract and explicitly report that MCP validation was unavailable.
5. Implement service behavior while retaining the scaffold's route, middleware, error handling, configuration, and lifecycle separation.
6. Follow existing `services/` patterns for logging, telemetry, health checks, shutdown, and dependency injection where applicable.
7. Add typed request/response contracts, input validation, error handling, and tests without embedding credentials or environment-specific endpoints.
8. Re-run MCP validation if supported and satisfy the global engineering standards. Verify actual service startup and endpoint behavior where applicable; if deployed, satisfy the post-deployment workspace validation gate.

## Completion report

Report service path, MCP scaffold and validation results, implemented routes/contracts, configuration changes, and verification outcomes required by `AGENTS.md`. Mark unexecuted checks as not run.
