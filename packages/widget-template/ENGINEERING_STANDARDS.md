# Widget engineering standards

Applies to every newly created or modified widget in `reactedge/platform`, regardless of which agent or skill performs the work.

Cross-cutting engineering policies are defined in the root `AGENTS.md`. This document contains widget-specific standards and points to the root policy where relevant.

## Scaffold and contracts

- `packages/widget-template` is the authoritative scaffold. Create widgets through the ReactEdge MCP widget creation operation.
- Each widget must contain `public/default.json` and `public/reactedge-runtime.json`.
- Both files must parse as valid JSON and conform to the applicable widget/runtime contract schemas. Confirm consistency with the widget implementation; existence alone is insufficient.
- Validate the widget structure using the MCP widget validator.

## Required verification

- Run the widget's applicable build and test commands. Both must pass; a scaffold validation alone is not enough.
- Run applicable lint and strict TypeScript checks.
- Apply the platform-wide Lizard CCN limit defined in the root `AGENTS.md`.
- If deployment occurs, apply the post-deployment MCP workspace validation rule in `AGENTS.md`.
- Record command results and failures. Do not mark unexecuted checks as passed.
