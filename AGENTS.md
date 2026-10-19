# AI Instructions

Before creating a widget:

- Treat `packages/widget-template` as the source of truth for widget scaffolding.
- Use the ReactEdge MCP `create widget` operation to scaffold from the template; do not manually copy or recreate the scaffold.
- Use the MCP `validate widget` operation to validate the generated structure.

Before creating an Express service:

- Create services under `services/<service-name>`.
- Use the Operational Intelligence MCP Express scaffold operation, following `.agents/skills/express-service/SKILL.md`.
- Validate the generated service structure with MCP if a validator exists, then run the applicable platform checks.

Platform-wide quality gates:

- Enforce a maximum Lizard cyclomatic complexity (CCN) of **10 per function** in authored or modified platform source code. Run Lizard on the relevant code; refactor any function above 10. Do not treat a project-wide average as sufficient. Exclude generated, vendored, and dependency files from this source-code gate.
- For every new widget, verify that the widget build and tests pass and that both `public/default.json` and `public/reactedge-runtime.json` exist as contracts. Check that the contracts are valid and consistent with the widget's runtime schema.
- After every completed deployment, run the platform MCP workspace-structure validation operation and report its result. Discover the actual operation/schema; never invent a command or report an unexecuted check as passed.
