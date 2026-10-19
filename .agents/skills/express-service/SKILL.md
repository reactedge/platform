---
name: express-service
description: Create a ReactEdge platform Express service under services/ using the Operational Intelligence MCP scaffold, then validate and implement it according to platform conventions.
---

# Express service creation

Use this skill when asked to create a new Express service in the ReactEdge platform repository.

## Sources of truth

1. The destination is `reactedge/platform/services/<service-name>`.
2. The authoritative service scaffold is the **Operational Intelligence MCP create-service operation** associated with `reactedge/operational-intelligence`. Discover the actual MCP tool and its schema; do not assume its exact tool name, parameters, or output.
3. Inspect `reactedge/operational-intelligence` for its Express service architecture and conventions. Existing services such as `cache-warmer` and `sitemap-planner` may provide useful references, but do not blindly copy their domain logic.
4. Inspect `reactedge/platform/services` for naming, dependency management, scripts, TypeScript/lint configuration, health endpoints, telemetry, deployment, and testing conventions. Respect the platform's actual integration requirements.

## Workflow

1. Establish service name, responsibility, API routes/contracts, external dependencies, configuration, and desired behavior. Clarify essential missing requirements.
2. Discover the Operational Intelligence MCP operation that scaffolds an Express server. Inspect its input schema and confirm how its generated files are targeted to `reactedge/platform/services/<service-name>`. Do not invent MCP arguments or manually substitute a scaffold.
3. Run the MCP scaffold operation. Confirm that the generated service is placed under `services/<service-name>`, without overwriting existing services or unrelated files.
4. Discover and run the MCP service-structure validation operation **if available**. If the MCP provides no validator, inspect the generated structure against its documented contract and explicitly report that MCP structural validation was unavailable.
5. Inspect the scaffolded routes, application/server separation, middleware, error handling, configuration, and dependencies. Implement the requested service behavior while retaining the generated architectural boundaries.
6. Reuse established platform service patterns for configuration, logging, OpenTelemetry/trace propagation, health checks, shutdown, and dependency injection where relevant. Do not add new infrastructure or dependencies when existing platform facilities meet the need.
7. Add or adjust typed request/response contracts, input validation, failure handling, and tests. Avoid embedding secrets, hardcoded environment-specific endpoints, or unsafe defaults.
8. Re-run MCP validation if supported. Run applicable lint, strict TypeScript, unit/integration tests, build checks, and service health/startup verification. Run Lizard on authored/modified source; refactor every function with CCN above 10. Confirm routes and actual behavior separately from scaffold validity.
9. After deployment completes, run the platform MCP workspace-structure validation operation and report its result. Discover the actual MCP schema; do not assume the operation name.

## Constraints

- Create the service **only** under `reactedge/platform/services/` unless the user explicitly requests a different destination.
- Let the Operational Intelligence MCP own Express scaffolding; do not copy service files manually in place of its generator.
- Preserve the platform's existing separation of responsibilities and integration conventions.
- Use only the established service patterns in `reactedge/platform/services/` when adapting the generated scaffold; do not apply conventions from unrelated platform areas.
- Do not claim that the MCP supports a validator, or that tests and runtime health passed, without verifying them.
- Avoid changing unrelated services or repository-wide configuration unless required and justified.
- Enforce Lizard CCN <= 10 per function in authored or modified source.

## Completion report

Report the service path, MCP scaffold operation and result, any structural validation operation and result, implemented routes and contracts, dependency/configuration changes, lint, strict TypeScript, tests, build, maximum Lizard CCN, startup/health checks, post-deployment MCP workspace validation (if deployed), and outstanding limitations. Mark unexecuted checks as **not run**.
