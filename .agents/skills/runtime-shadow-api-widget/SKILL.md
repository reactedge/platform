---
name: runtime-shadow-api-widget
description: Scaffold and validate a ReactEdge runtime-shadow widget that consumes an API through the runtime contract instead of the default GraphQL integration.
---

# Runtime-shadow API widget

Use this skill when asked to create or convert a `runtime-shadow` widget to consume an API rather than GraphQL.

## Mandatory repository context

1. Inspect `packages/widget-template` as the authoritative widget scaffold and structure. Do not use `packages/docs/widget-spec.md` or `packages/widget-build/shared-resources` as the source of truth for creation.
2. Use the ReactEdge MCP `create widget` operation to generate widgets from `packages/widget-template`; do not manually copy the template or create an alternative scaffold.
3. Locate and inspect the current runtime contract and its API dependency; do not guess interface names or import paths.
4. Locate and inspect the Google Review widget (including its repository if external) to establish the existing system state provider pattern. If unavailable, report the missing reference and do not invent its behavior.
5. Inspect existing widget lifecycle, mount, observability, and test conventions.

## Procedure

1. Collect the widget name, API endpoint or API contract, expected response shape, and rendering requirements. Ask only for missing details that cannot be inferred from the repository.
2. Discover the ReactEdge MCP `create widget` operation and inspect its actual schema. Invoke it with widget type `runtime-shadow` and the required widget parameters. The MCP operation owns scaffolding from `packages/widget-template`; do not manually reproduce that process or invent MCP argument names.
3. Invoke the MCP `validate widget` operation on the untouched scaffold. Fix structural failures before modifying the integration. If MCP is unavailable, report this explicitly; do not claim MCP validation occurred.
4. Inspect the generated GraphQL dependencies, data access, and runtime wiring. Identify the corresponding API dependency anchored in the runtime contract, including request context, authentication, response typing, and error handling.
5. Replace GraphQL-specific imports, queries, and data access with the runtime-provided API dependency. Remove unused GraphQL dependencies only when safe; avoid introducing an independent HTTP client when the runtime already provides one.
6. Integrate the system state provider using the same access, subscription, state-update, and cleanup conventions as the Google Review widget. Adapt only widget-specific behavior. Avoid introducing parallel state infrastructure.
7. Implement typed API data flow with loading, success, empty, and failure states. Handle cancellation or stale responses and cleanup across unmount/remount. Preserve existing widget registration, mount lifecycle, and observability.
8. Run MCP `validate widget` again. Run relevant strict TypeScript, lint, unit, integration, and widget e2e checks as available. Where supported, validate deployed runtime behavior separately from scaffold structure.

## Architectural constraints

- Preserve separation of responsibilities between widget code, runtime orchestration, mounting, and observability.
- Follow the actual runtime contract; do not change it without a clearly justified and separately reviewed need.
- Never embed credentials or leak sensitive system state.
- Treat `packages/widget-template` and the MCP scaffold operation as the source of truth for widget creation; preserve repository naming, layout, contract schema, and test conventions.
- Do not claim structural validation proves API requests or widget mounting work.
- Do not fabricate MCP operations, runtime interfaces, Google Review behavior, or test outcomes.

## Completion report

Report widget path, runtime API dependency used, GraphQL integration removed, system state provider pattern followed, initial/final MCP validation, lint, strict TypeScript, tests, runtime verification, and any unverified behavior. Mark checks not executed as **not run**, not passed.
