# ReactEdge – Banner Widget

A small, embeddable **Banner (Unique Selling Points) widget** designed to be safely integrated into existing websites without owning the page or application lifecycle.

This widget is part of the **ReactEdge** initiative: a collection of frontend widgets built with a strong emphasis on isolation, reversibility, and clarity.

---

## What this is

- A lightweight frontend widget for displaying Banners
- Designed to be embedded into existing platforms (e.g. legacy CMS, e-commerce sites)
- Isolated by default (no global CSS or JS leakage)
- Easy to install **and easy to remove**
- Actively used and evolving

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
  Source code for the Banner widget and its build configuration.

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
<script src="path-to-widget.js"></script>

<reactedge-banner-widget></reactedge-banner-widget>
```

## Local development

This project uses Node.js and npm.

From the repository root:

```bash
npm install
```

To run the widget locally:

```bash
cd vite_project
npm install
npm run dev
```

To run the widget in SSR mode:

```bash
cd widget-usp
npm install
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/render-page.ts ../widgets-cdn/www/bannermulti/contracts/mageosuk2.json

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
(e.g. widget-banner@x.y.z.iife.js).

The www/ Generated build output produced by the build process. This folder is intentionally not committed to the repository.

## CSS Isolation

ReactEdge widgets use PostCSS prefixing to guarantee style isolation
when embedded into hostile environments such as WordPress or Magento.

All selectors are automatically scoped to a widget-specific root class.

### Example:
Source CSS:
```bash
.slide { ... }
```
Production output:
```bash
.reactedge-banner .slide { ... }
```

This prevents collisions with host themes or other plugins.
