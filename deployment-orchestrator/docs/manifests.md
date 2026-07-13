# Multi-Widget Manifest Documentation

The ReactEdge deployment process uses two complementary manifest files:

1. **Deployment Manifest** – defines which widgets are active.
2. **Widget Registry Manifest** – defines how widget contracts are generated.

Although both files reference the same widget instances, they serve different purposes within the deployment pipeline.

---

## Deployment Manifest

Example:

```json
{
  "banner": "banner.json",
  "banner4": "banner4.json",
  "usp": "usp.json",
  "usp1": "usp1.json",
  "storefinder": "storefinder.json",
  "megamenu": "megamenu.json"
}
```

### Purpose

This file defines the widget instances that should be deployed.

Each entry maps a widget instance identifier to the generated widget contract that will be published.

For example:

```json
{
  "usp1": "usp1.json"
}
```

indicates that a widget instance named `usp1` should be deployed and that its generated contract will be stored in `usp1.json`.

### Used By

Deployment scripts.

### Responsibilities

* Determine which widgets are active.
* Determine which widget contracts should be published.
* Produce deployment artifacts.

---

## Widget Registry Manifest

Example:

```json
{
  "usp": {
    "cdn": "reactedge.json",
    "css": "usp.css"
  },

  "usp1": {
    "widget": "usp",
    "cdn": "usp-demo1.json"
  }
}
```

### Purpose

This file describes how widget contracts should be generated.

Each entry references:

* Widget type
* Contract source
* Optional CSS asset
* Shared widget configuration

For example:

```json
{
  "usp1": {
    "widget": "usp",
    "cdn": "usp-demo1.json"
  }
}
```

indicates:

* Reuse the `usp` widget definition.
* Load configuration from `usp-demo1.json`.
* Inherit shared widget metadata from the base widget.

### Widget Aliases

Many widget instances share the same implementation.

For example:

```json
{
  "usp": {
    "cdn": "reactedge.json",
    "css": "usp.css"
  },

  "usp1": {
    "widget": "usp",
    "cdn": "usp-demo1.json"
  },

  "usp2": {
    "widget": "usp",
    "cdn": "usp-demo2.json"
  }
}
```

All three entries use the same widget implementation but generate different contracts.

### Used By

Contract generation scripts.

### Responsibilities

* Locate widget assets.
* Locate widget configuration.
* Generate widget contracts.
* Support widget aliases and reuse.

---

## Relationship Between The Two Files

The deployment pipeline works as follows:

```text
Widget Registry Manifest
        │
        ▼
Contract Generation
        │
        ▼
Generated Widget Contracts
        │
        ▼
Deployment Manifest
        │
        ▼
Published Artifacts
```

The Widget Registry Manifest describes **how contracts are generated**.

The Deployment Manifest describes **which generated contracts are deployed**.

Keeping these responsibilities separate allows contract generation and deployment to evolve independently.
