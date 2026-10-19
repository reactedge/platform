# Widget template knowledge

## Purpose

This entry helps ReactEdge agents discover the authoritative widget scaffold and understand when to inspect it.

## Canonical source

- **Scaffold:** `packages/widget-template/`
- **Engineering standards:** `packages/widget-template/ENGINEERING_STANDARDS.md`
- **Widget creation workflow:** `.agents/skills/runtime-shadow-api-widget/SKILL.md` (for API-backed runtime-shadow widgets)
- **Global engineering standards:** `AGENTS.md`

The template directory is the source of truth. This knowledge entry is an index, **not a second template**. Do not copy the template into the knowledge base or rely on snapshots that can become stale.

## Discovery workflow

1. Before creating or changing a widget, inspect the current contents of `packages/widget-template/` to learn its structure, dependencies, contract conventions, and tests.
2. Read its `ENGINEERING_STANDARDS.md` and the root `AGENTS.md`.
3. For creation, use the ReactEdge MCP widget scaffold operation that consumes `packages/widget-template/`; do not manually reproduce the scaffold.
4. Validate the generated widget using the MCP widget validation operation, then perform the build, tests, and contract checks required by the standards.
5. If template structure or MCP behavior changes, re-inspect the live source instead of treating this index as an implementation specification.

## Audience

The main Codex agent, widget-agent, and any future agent implementing widgets.
