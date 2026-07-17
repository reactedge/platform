# Welcome to ReactEdge

## 1. Clone the repository

```bash
git clone https://github.com/digitalrisedorset/ready ReactEdge
cd ReactEdge
```

---

## 2. Install mise

```bash
curl https://mise.run | sh
```

Activate it (Bash):

```bash
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
source ~/.bashrc
```

Verify:

```bash
mise --version
```

---

## 3. Install the ReactEdge toolchain

```bash
mise install
```

This installs the required Node.js and Python versions.

---

## 4. Install ReactEdge dependencies

Make the helper scripts executable:

```bash
chmod u+x ./launcher/scripts/*.sh
```

Install all project dependencies:

```bash
mise run platform-install
```

---

## 5. Configure ReactEdge

cp .env.sample .env
cp -R workspace.sample workspace

Generate the local configuration:

```bash
mise run configure
```

The configuration wizard will create:

- `.env`
- `deployment-orchestrator/.env.dev`
- `widgets/*/public/reactedge-runtime.json`

---

## 6. Launch a widget locally

For example:

```bash
mise run widget-dev -- usp
```

or:

```bash
mise run widget-dev -- banner
```

---

# Magento Integration

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
composer require reactedge/widgetbridgelight
```

Enable the module:

```bash
bin/magento module:enable ReactEdge_WidgetBridge

bin/magento setup:upgrade

bin/magento cache:flush
```

---

## Verify the installation

Check that the module is installed:

```bash
bin/magento module:status ReactEdge_WidgetBridge
```

Inspect widget configuration:

```bash
bin/magento config:show reactedge/usp/enabled
bin/magento config:show reactedge/banner/enabled
bin/magento config:show reactedge/productgallery/enabled
bin/magento config:show reactedge/storefinder/enabled
bin/magento config:show reactedge/megamenu/enabled
bin/magento config:show reactedge/googlereviews/enabled
```

---

## Configure integrations

Configure Google integrations if required:

```bash
bin/magento config:set reactedge/google_maps/api_key YOUR_API_KEY

bin/magento config:set reactedge/google_maps/place_id YOUR_PLACE_ID
```

Enable server-side rendering:

```bash
bin/magento config:set reactedge/widgets_ssr/enabled 1
```

---

## Enable widgets

Enable the widgets you want to use:

```bash
bin/magento config:set reactedge/usp/enabled 1

bin/magento config:set reactedge/banner/enabled 1

bin/magento config:set reactedge/productgallery/enabled 1
```

Flush the cache:

```bash
bin/magento cache:flush
```

---

## Customise widget placement

Copy the starter layout XML files into the active Magento theme and adjust widget placement as required.

---

## Deploy widgets

Build and publish the widgets:

```bash
mise run widgets-deploy
```

