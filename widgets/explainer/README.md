# ReactEdge – Explainer Widget

A small, isolated explainer widget that attaches contextual explanations to existing DOM elements — without touching core templates.

This project demonstrates how explanatory UI can be delivered as an isolated, reversible feature instead of being embedded into a core system.

---

## What this is

- One explainer explains one feature
- Attached from the outside via a selector
- Fully removable
- Keyboard accessible
- No framework assumptions beyond the bundle itself

The explainer is designed to be foundational, not clever.

---

## What this is NOT

- ❌ A framework
- ❌ A full design system
- ❌ A conversion or growth “hack”
- ❌ A replacement for CMS or backend logic
- ❌ Opinionated about content or marketing strategy

This widget focuses on **delivery and safety**, not business promises.

---

## Design principles

- **Isolation first** – the widget does not assume ownership of the page or application
- **Reversible by design** – removal should leave no trace on the host system
- **Non-hostile to the host** – designed to coexist with existing themes and layouts rather than override them
- **Minimal surface area** – only what is required to do the job
- **Testable in isolation** – behaviour can be verified without the host platform
- **Deferred by default** – does not require early page execution to function
- **Layered structure** – organised to encourage consistency across ReactEdge widgets without enforcing a framework
- **Boring on purpose** – clarity over cleverness
- **Observable by the host** – key lifecycle and interaction events are emitted to allow integration with analytics or monitoring tools without coupling to a specific provider

---

## Project structure (high level)

This repository contains the widget itself, along with supporting tooling used for development, testing, and community maintenance.

- `vite_project/`  
  Source code for the Explainer widget and its build configuration.

- `tests/`  
  End-to-end tests (Playwright) used to validate widget behaviour in a real browser environment.

- `docker/` and `docker-compose.yml`  
  Optional local development tooling. These are provided for convenience and are not required to use the widget.

- `.github/`  
  GitHub metadata (issue templates, CI workflows, etc.) to support collaboration and maintainability.

- `www/`  
  Generated build output. This folder is intentionally not committed to the repository.

## Installation (high level)

The widget is delivered as a standalone JavaScript file and exposed via a custom element.

Typical usage looks like:

```html
<button data-explain="banner">Why is this banner isolated?</button>

<explainer-widget config-key="banner"></explainer-widget>

<script type="application/json" id="reactedge-config">
  {
    "widgets": {
      "banner": {
        "selector": "[data-explain='banner']",
        "title": "Isolated banner",
        "notes": "<p>This banner is deployed independently from the core system.</p>",
        "layout": "right"
      }
    }
  }
</script>

<script src="/explainer.js"></script>
```

## Local development

This project uses Node.js and npm.

From the repository root:

```bash
npm install
npm install playwright
```

To run the widget locally:

```bash
cd vite_project
npm install
npm run dev
```

To run the test suite:
```bash
npx playwright test --config=tests/playwright.dev.config.ts
```

## Deploying the widget

ReactEdge widgets are deployed as **static JavaScript artefacts**.
They do not require a server-side runtime once built.

### Build the artefact

From the `vite_project` directory:

```bash
npm run build
```

This produces a versioned JavaScript file in the www/ directory
(e.g. widget-explainer@x.y.z.iife.js).

The www/ Generated build output produced by the build process. This folder is intentionally not committed to the repository.