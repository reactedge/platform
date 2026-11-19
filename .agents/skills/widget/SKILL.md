---
name: widget
description: Standards for creating and maintaining ReactEdge widgets.
---

Applies to every newly created or modified widget in `reactedge/platform`

This document contains widget-specific standards.

## Scaffold and contracts

- **Widgets:** Use `packages/widget-template/` as the canonical widget template
- **Widget CSS:** Give each distinct structural UI element its own intent-named CSS file and import it through the widget's style entry point. Shadow widgets use `src/styles/entry.ts`; other widgets use `src/styles/widget.css`.
- Create widgets through the ReactEdge MCP widget creation operation.
- Each widget must contain `public/default.json` and `public/reactedge-runtime.json`.
- Both files must parse as valid JSON and conform to the applicable widget/runtime contract schemas. Confirm consistency with the widget implementation
- Validate the widget structure using the MCP widget validator.

## Source layout

- Bootstrap folder responsability:
- API entry points: `api/package.ts` is the package export entry point. Each widget must also
  keep exactly one variant entry point: `api/widget.tsx`, `api/runtime-widget.tsx`, or `api/runtime-shadow-widget.tsx`, according to
  its template. Preserve the existing variant filename and public API.
- Config validation: `src/bootstrap/config/` owns widget configuration and schema files.
- SSR: `src/bootstrap/ssr/render.tsx` must export `renderHtml` with positional parameters in the order `(config, runtime, bootstrap)`. Omit unused trailing parameters; preserve the order of those retained and avoid unnecessary placeholders. Keep SSR implementations under `src/bootstrap/ssr/`. Runtime-shadow widgets may omit SSR.
- Widget View:
- `src/bootstrap/view/` owns `Widget.tsx` and `WidgetView.tsx` when those files
  exist. `Widget.tsx` exposes the widget's React mounting/component API for NPM packages;
  `WidgetView.tsx` renders the widget's widget static view.
- Other startup and host integration code belongs under `src/bootstrap/`.

For API-backed runtime-shadow widgets, follow:
.agents/skills/runtime-shadow-api-widget/SKILL.md
- Third-party API isolation: Put provider requests, credentials, and provider-specific response mapping in a dedicated ReactEdge Express service. A widget calls that service through a typed client and must not call the third-party API directly.

- React component structure:
- JSX size: Keep the JSX returned by each React component to 30 lines or fewer. Extract focused child components when a component's JSX would exceed this limit.
- JSX line width: Target 60–150 characters per substantive JSX line, counting indentation, and never exceed 150. Do not put multiple elements on one line to save vertical space; break attributes and children into readable lines. Short tags and short labels may be shorter; do not pad them to meet the target.
- props drills: When forwarding a callback or event handler through a React component tree, pass
  it through at most two React components from its owner to the component that
  invokes it. If the path would exceed two components, first consider moving the handler owner closer to its consumer.
  Use a widget-scoped context when state or actions are genuinely shared by multiple descendants, not solely to satisfy this limit.
  Do not introduce a global context or package for this purpose.

- props structure: use no more than six top-level props per component.
  When related values need to travel together, group them into a typed object by purpose.
  Avoid arbitrary bags that combine unrelated concerns, and do not use grouping to hide excessive handler forwarding.

- use controller: When a widget component mostly coordinates feature state, domain hooks, and
  callbacks to assemble grouped props for a child, consider extracting that
  composition into a feature-scoped controller hook. the component should remain focused on rendering.
  Do not create a controller merely to move JSX, duplicate state ownership, or collect
  unrelated widget concerns into one catch-all object.

- destructured parameters: destructure controller result, then use those names directly.
  Avoid keeping the whole result under a generic variable such as `controller` throughout the render.

- scope-state context: Use Intent Discovery's local state pattern as an example: `widgets/intentdiscovery/src/state/Intent/IntentStateProvider.tsx` owns the
  state and `widgets/intentdiscovery/src/state/Intent/useIntentState.ts` gives descendants access through a widget-local hook.
  Follow its ownership and local-access pattern, not necessarily its single-context shape. Keep context providers as close as practical to the descendants that share the
  value.
  Avoid combining frequently changing state and stable actions in one broad context when splitting them or keeping values stable would reduce unnecessary renders.
  Register a shared event listener at the provider or feature boundary rather than independently in every consumer.

- widget semantic HTML Rules: ReactEdge widgets are self-contained UI components, not standalone pages. Apply semantic HTML according to content and purpose.
1. widgets must not introduce a page-level `main`. Use `section` when its content has a meaningful label or heading.
2. widget owns semantics: Each widget defines its internal HTML independently.
3. `article`: Use only for independently meaningful content, not automatically as a widget wrapper.
4. `nav`: Use for navigation widgets (e.g. MegaMenu), not informational widgets (e.g. USP).
5. Headings: Use `h2`–`h6` according to the host's heading hierarchy; avoid widget-owned `h1`.
6. `p`: Use for descriptive and explanatory text.
7. `ul` / `ol`: Use for collections and ordered sequences (USP, results, steps).
8. `dl` / `table` / `figure`: Use for definitions, tabular data and media.
9. `form` / `label` / `button` / `a`: Use native HTML semantics for inputs, actions and links.
10. `div`: Do not use `div`. Always choose the most appropriate semantic HTML element for the content or interaction.

- code standards: Follow the mandatory engineering standards in: AGENTS.md

- widget assets: Keep widget-owned public assets under the widget's public/assets/ directory.
  When a widget's contract references those assets, use the deployable workspace asset path and coordinate the corresponding copies into
  workspace.sample/default/assets/<widget-id>/. Validate both contract and asset copies before reporting the widget as deployable.

## Required verification

- Run the widget's applicable build and test commands. Both must pass; a scaffold validation alone is not enough.
- Run applicable lint and strict TypeScript checks.
- Apply the platform-wide Lizard CCN limit defined in the root `AGENTS.md`.
- If deployment occurs, apply the post-deployment MCP workspace validation rule in `AGENTS.md`.
- Record command results and failures. Do not mark unexecuted checks as passed.
