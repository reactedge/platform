---
name: runtime-shadow-api-widget
description: Scaffold a runtime-shadow widget using ReactEdge MCP and replace its default GraphQL integration with the runtime-contract API dependency.
---

# Runtime-shadow API widget

Use when creating or converting a `runtime-shadow` widget to consume an API instead of GraphQL.

Follow the mandatory root `AGENTS.md` and `packages/widget-template/ENGINEERING_STANDARDS.md` standards. This skill describes the task procedure, not the quality gates.

## Procedure

1. Collect the widget name, API endpoint or contract, expected response shape, and rendering requirements.
2. Inspect `packages/widget-template` and discover the actual ReactEdge MCP `create widget` operation/schema. Scaffold with type `runtime-shadow`; let MCP own generation.
3. Run the MCP `validate widget` operation on the scaffold; resolve structural failures before adapting it.
4. Inspect the runtime contract and identify its API dependency, request context, authentication, typing, and error behavior. Do not invent interfaces.
5. Inspect the Google Review widget to understand its system state provider access, updates, and cleanup. If the reference cannot be located, report this rather than guessing.
6. Replace generated GraphQL imports, queries, and data access with the runtime-provided API dependency. Preserve widget registration, mount/unmount lifecycle, and observability.
7. Implement typed API data flow and loading, empty, success, and error behavior. Handle stale requests and cleanup; reuse the system state provider pattern.
8. Run MCP widget validation again, then satisfy the widget standards and global engineering gates. If deployed, satisfy the post-deployment workspace validation gate.

## Completion report

Report widget path, API dependency used, GraphQL integration removed, state provider pattern, MCP validation outcomes, and the verification results required by the referenced standards. Distinguish not-run checks from passes.
