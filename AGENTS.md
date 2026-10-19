# AI Instructions

Before creating a widget:

- Treat `packages/widget-template` as the source of truth for widget scaffolding.
- Use the ReactEdge MCP `create widget` operation to scaffold from the template; do not manually copy or recreate the scaffold.
- Use the MCP `validate widget` operation to validate the generated structure.

Before creating an Express service:

- Create services under `services/<service-name>`.
- Use the Operational Intelligence MCP Express scaffold operation, following `.agents/skills/express-service/SKILL.md`.
- Validate the generated service structure with MCP if a validator exists, then run the applicable platform checks.
