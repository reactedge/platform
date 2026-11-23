# Welcome to ReactEdge

## 1. Clone the repository

```bash
git clone https://github.com/reactedge/platform ReactEdge
cd ReactEdge
```

---

## 2. Install Mise

ReactEdge uses Mise for tool version management and project tasks.

### macOS

```bash
brew install mise
```

### Linux / other platforms

Activate Mise for your shell by following the setup instructions shown after installation, or the official Mise documentation.

```bash
curl https://mise.run | sh
```

Verify:

```bash
mise --version
```

When you first enter the ReactEdge repository, Mise may ask you to trust
the project's mise.toml:
```bash
mise trust
```

You can inspect mise.toml before trusting it.

---

## 3. Install ReactEdge dependencies

Install all project dependencies:

```bash
npm ci
```

---

## 4. Configure ReactEdge

### Browser setup

From the repository root, start the local configuration UI:

```bash
mise run configure-ui
```

Or use `npm run configure:ui` if Node is already available. The UI itself needs
no installed project dependencies. Open <http://127.0.0.1:4173> in your browser.

1. On a fresh clone, select **Create new environment** and enter a store code.
   To edit an existing configuration, select it from the list and click
   **Load selected environment**.
2. Enter the Site URL and the absolute path to the platform root (for example,
   your Magento installation), then choose the environment and capabilities.
   If the site has a product catalog, provide an example SKU and category.
   Maps and reviews share one Google API key; reviews also need a Place ID.
3. Click **Review changes** to inspect the workspace setup, allowed URL hosts,
   and files to change. The Site URL host is included automatically; local
   hosts are included in development. Add other domains only for absolute URLs
   used in widget contracts.
4. Click **Save configuration** to write the files. This creates
   `.env.<store-code>`, the store workspace from `workspace.sample`, the global
   registry and release directory if missing, service environment files, and
   widget runtime JSON. The target workspace is created alongside the platform
   root.

Saving another store replaces the shared widget runtime JSON and
`services/ssr/.env`. For a site without a catalog, disable widgets that require
SKU and catalog services in the store registry before building. SSR port and
public URL settings are retained in the configuration but hidden in this basic
form while unused.

To run the configuration tests:

```bash
node --experimental-strip-types --test launcher/control-panel/configuration.test.ts
```

### Existing script fallback

Keep using the existing interactive Bash setup while the browser workflow is
being validated:

```bash
mise run configure
```

---

# 5. Magento integration

Change to your Magento or Mage-OS installation directory:

```bash
cd /path/to/magento
```

Update `composer.json`:

```json
"minimum-stability": "dev"
```

Install the ReactEdge bridge:

```bash
composer require reactedge/widgetbridge
```

Enable the module:

```bash
bin/magento module:enable ReactEdge_WidgetBridge
bin/magento setup:upgrade
```

---

### Install Magento layout integration

ReactEdge provides starter Magento layout files in:

```text
widgets/integration/magento/
```

These files define where the ReactEdge widgets are mounted within the Magento storefront.

Copy:

```text
widgets/integration/magento/*
```

to your active Magento theme:

```text
app/design/frontend/<Vendor>/<theme>/Magento_Catalog/layout/
```

If your theme already contains one of these layout files, **do not overwrite it**. Merge the ReactEdge layout instructions into the existing file instead.

The supplied files are starter integrations and can be adjusted to change widget placement within your theme.

## 5. Add a widget locally

The platform starts without any widgets. Add at least one widget before launching it locally:

```bash
mise run widget-install -- <widget-name> <version>
```

For example, to add four widgets, install each widget at its desired release tag:

```bash
mise run widget-install -- usp <version>
mise run widget-install -- productgallery <version>
mise run widget-install -- sizeguide <version>
mise run widget-install -- megamenu <version>
```

## 6. Launch a widget locally

For example:

```bash
mise run widget-dev -- productgallery
```

or:

```bash
mise run widget-dev -- megamenu
```

---

### Shared React pilot

With USP and Category FAQ installed, build and test their shared React browser
bundles from the repository root.

```bash
npm run build:shared-react
npm run test:shared-react
```

The build writes to `workspace/release/pilot/shared-react/`. A pilot host
serves that directory and loads `react-shared@19.2.8.iife.js` once before the
two widgets’ scripts. Each widget subdirectory contains a manifest with the
script filename, its integrity digest, and the stylesheet filename. Use
ordered `defer` scripts and call the widget mount APIs after both have loaded.

## 7. Deploy widgets

Build and publish the widgets:

```bash
mise run widgets-deploy
```

---

---

## 8. Configure integrations

Enable server-side rendering:

```bash
bin/magento config:set reactedge/widgets_ssr/enabled 1
```

---

### 9. Enable widgets

Enable the widgets you want to use:

```bash
bin/magento config:set reactedge/megamenu/enabled 1

bin/magento config:set reactedge/productgallery/enabled 1

bin/magento config:set reactedge/usp/enabled 1
```

Flush the cache:

```bash
bin/magento cache:flush
```

If the commands above fails, check that the module correctly installed:

```bash
bin/magento module:status ReactEdge_WidgetBridge
```

Inspect widget configuration:

```bash
bin/magento config:show reactedge/productgallery/enabled
bin/magento config:show reactedge/megamenu/enabled
bin/magento config:show reactedge/usp/enabled
```
---

## 10. Revert to Magento UI

Disable the widgets you don't want to use:

```bash
bin/magento config:set reactedge/megamenu/enabled 0

bin/magento config:set reactedge/productgallery/enabled 0

bin/magento config:set reactedge/usp/enabled 0
```

Flush the cache:

```bash
bin/magento cache:flush
```
---

## 11. Modify and redeploy a widget

Widget deployments use the contracts referenced by the workspace registry (see `workspace/registry.json`)

Open the workspace registry and identify the contract configured for the widget you want to modify.

Either update that contract or create a new contract and update the registry to reference it.

For example, change the Product Gallery presentation mode from "tile" to "gallery" in its contract.

Redeploy the widgets:

```bash
mise run widgets-deploy
```

Then clear the ReactEdge Magento cache:
```bash
bin/magento cache:clean reactedge
```

## 12. Project tasks

Mise is used as a task runner. The commands it executes are defined in
`mise.toml`, with supporting scripts in `launcher/scripts/`, and can be
inspected before running them.

| Command | Purpose |
| --- | --- |
| `mise run configure` | Generates the local ReactEdge configuration |
| `mise run widget-dev -- <widget>` | Starts a widget locally with Vite |
| `mise run widget-build -- <widget>` | Builds a selected widget |
| `mise run widgets-deploy` | Builds and deploys selected widget assets |
| `mise run widget-test -- <widget>` | Runs tests for a selected widget |


## 13. MCP server

ReactEdge provides an MCP server that exposes platform documentation and
development tools to MCP-compatible clients.

Start the server with:

```bash
npx @modelcontextprotocol/inspector npx tsx mcp/server.ts default
npx @modelcontextprotocol/inspector npx tsx browser-mcp/server.ts default
