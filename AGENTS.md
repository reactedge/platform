# ReactEdge engineering standards

These mandatory rules apply to all platform changes, regardless of agent, skill, or workflow.

- **Complexity:** Run Lizard on authored or modified platform source code. Every checked function must have cyclomatic complexity (CCN) **at most 10**; refactor any function above 10. A project average is not sufficient. Exclude generated, vendored, and dependency files.
- **Quality:** Run applicable lint, strict TypeScript, build, and test checks for changed components; report actual results and do not treat unexecuted checks as passing.
- **Widgets:** Follow `packages/widget-template/ENGINEERING_STANDARDS.md` for widget contracts, scaffolding, builds, tests, and validation.
- **Deployment:** After every completed deployment, run the platform MCP workspace-structure validation operation and report its result. Discover the actual tool/schema rather than inventing an operation. A successful build is not a substitute for post-deployment workspace validation.

Task procedures are documented separately in `.agents/skills/runtime-shadow-api-widget/SKILL.md` and `.agents/skills/express-service/SKILL.md`.

## Codex sub-agent delegation

When the user requests delegated implementation work, the main Codex agent acts as the launcher using the roles registered in `.codex/config.toml`:

- Delegate widget creation or maintenance to `widget-agent`.
- Delegate Express service creation or maintenance under `services/` to `service-agent`.
- For mixed tasks, delegate separable widget and service work to their respective agents, coordinate shared interfaces, and integrate their results. Avoid simultaneous edits to the same files.
- Keep architecture decisions, cross-cutting changes, and final verification coordinated by the main agent. Do not claim a delegation or tool run occurred unless it actually did.
- Each sub-agent follows its existing skill and the mandatory standards above; do not restate the skill workflow in the launcher.
