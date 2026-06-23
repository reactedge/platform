# MegaMenu Widget

A navigation system designed to operate as an embedded feature — where platform menus are fragile, tightly coupled, and risky to change.

A **decoupled, embeddable MegaMenu widget** delivered as a single versioned JavaScript file.  
It can be embedded into **WordPress, Magento, or static sites** and consumes navigation data from an external API or JSON endpoint.

The widget is designed for **isolation, determinism, and safe navigation evolution** without touching core platform code.

---

## What this repository contains

- Frontend MegaMenu widget source
- Build pipeline producing `widget-*.iife.js`
- Public embedding contract (custom element + data attributes)
- Local development setup for the widget

---

## What this repository does NOT contain

- CMS or commerce platform menu logic
- Backend navigation APIs or data models
- Server or infrastructure configuration (Nginx, TLS, TLS termination, etc.)
- Theme overrides or template code (WordPress, Magento)
- Deployment or operations scripts

---

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
cd widgets/megamenu
npm install
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/render-page.ts ../../services/cdn/www/megamenu/contracts/fr.json
```

To run the test suite:
```bash
npx playwright test --config=tests/playwright.dev.config.ts
```

| Host                   | Test to check it works                                                      | Notes on the component                                                                  |
| ---------------------- | --------------------------------------------------------------------------- |-----------------------------------------------------------------------------------------|
| **Magento / Mage-OS**  | Load page → verify menu renders → change menu data → refresh → menu updates | No core overrides required. Menu logic remains outside the platform.                    |
| **WordPress**          | Load page → widget JS loads → menu renders without theme hooks              | Works reading the Wordpress menu data and remains independent WP or theme templates. |
| **Static site**        | Load page → widget JS `200` → menu renders from remote JSON                 | No server-side integration required.                                                    |
| **Widget host domain** | Network tab shows widget JS loaded once, no duplicate execution             | Widget should remain side-effect free outside its mount point.                          |


To run the test suite:
```bash
npx playwright test --config=tests/playwright.dev.config.ts
```