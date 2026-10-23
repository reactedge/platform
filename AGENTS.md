# ReactEdge engineering standards

These mandatory rules apply to all platform changes, regardless of agent, skill, or workflow.

- **Single source of truth:** Keep cross-cutting engineering policies in this file. Specialized standards may refer to these policies but must not duplicate their requirements.
- **Complexity:** Run Lizard on authored or modified platform source code. Every checked function must have cyclomatic complexity (CCN) **at most 10**; refactor any function above 10. A project average is not sufficient. Exclude generated, vendored, and dependency files.
- **Function length:** ESLint must warn when a function or method exceeds 250 lines.
- **Git workflow:** Make implementation changes on a task-specific branch. When the task is complete, commit the task changes and push that branch to its matching remote branch without waiting for a separate push request. Keep unrelated working-tree changes out of the task commit and preserve them.
- **Quality:** Run applicable lint, strict TypeScript, build, and test checks for changed components; report actual results and do not treat unexecuted checks as passing.
- **Widgets:** Use `packages/widget-template/` as the canonical widget template; follow `packages/widget-template/ENGINEERING_STANDARDS.md` for widget contracts, scaffolding, builds, tests, and validation.
- **Widget CSS:** Give each distinct structural UI element its own intent-named CSS file and import it through the widget's style entry point. Shadow widgets use `src/styles/entry.ts`; other widgets use `src/styles/widget.css`.
- **Deployment:** After every completed deployment, run the platform MCP workspace-structure validation operation and report its result. Discover the actual tool/schema rather than inventing an operation. A successful build is not a substitute for post-deployment workspace validation.

Task procedures are documented separately in `.agents/skills/runtime-shadow-api-widget/SKILL.md` and `.agents/skills/express-service/SKILL.md`.

## Codex sub-agent delegation

When the user requests delegated implementation work, the main Codex agent acts as the launcher using the roles registered in `.codex/config.toml`:

- Delegate widget creation or maintenance to `widget-agent`.
- Delegate Express service creation or maintenance under `services/` to `service-agent`.
- For mixed tasks, delegate separable widget and service work to their respective agents, coordinate shared interfaces, and integrate their results. Avoid simultaneous edits to the same files.
- Keep architecture decisions, cross-cutting changes, and final verification coordinated by the main agent. Do not claim a delegation or tool run occurred unless it actually did.
- Each sub-agent follows its existing skill and the mandatory standards above; do not restate the skill workflow in the launcher.
