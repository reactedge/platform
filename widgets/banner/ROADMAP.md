
# Banner Widget – Image Compression Roadmap

The ReactEdge Banner Widget aims to provide a lightweight and flexible way to manage homepage banners without introducing friction between marketing and development teams.

A common issue with homepage banners is **image performance**. Large or poorly optimised images can negatively impact page speed and Lighthouse scores.

To address this problem, the banner widget introduces a progressive roadmap for **asynchronous image optimisation**.

The key principle is:

> Banner rendering must **never be blocked** by image optimisation.

Optimisation should always improve the system without introducing runtime fragility.

---

# Roadmap

| Phase | Title | Description | Notes |
|------|------|-------------|------|
| **Phase 1** | Compression Contract (Foundation) | Introduce a `compression` parameter in the banner `settings`. Supported values: `none`, `webp`, `avif`, `auto`. At this stage the widget accepts the parameter but performs no optimisation. The goal is to establish a stable contract and prepare the system for future optimisation workflows. | Safe foundation. No processing yet. |
| **Phase 2** | MVP Compression (Manual Workflow) | Provide basic WebP compression using a manual workflow. Images can be compressed via CLI tools or a scheduled cron job. Once compressed images are produced, the banner contract can be manually updated to reference the optimised assets. The widget continues rendering normally even if compression has not yet occurred. | Low complexity. Demonstrates the concept and validates workflow. |
| **Phase 3** | MVP v2 – Queue-based Compression | Introduce a queue-driven optimisation process. When compression is enabled, the system validates banner images and pushes optimisation jobs into a queue. Background workers generate WebP versions asynchronously. The original images remain active until the optimisation process completes. | First automated optimisation layer. |
| **Phase 4** | Automated Asset Optimisation | Implement a full optimisation pipeline: automatic validation, compression generation (WebP/AVIF), contract state updates (`pending`, `optimised`, `valid`), and automatic activation of optimised assets. This optimisation capability becomes reusable across widgets (banner, gallery, CMS media). | Production-grade optimisation capability. |

---

# Banner Widget Contract (Extended)

Example contract including compression configuration:

```json
{
  "data": {
    "slides": [
      {
        "image": {
          "src": "../banner-roofing-solutions.jpg",
          "srcset": "../banner-solutions.jpg 479w, ../banner-solutions-small.jpg 359w",
          "alt": "..."
        }
      },
      {
        "image": {
          "src": "../banner-example.jpg",
          "srcset": "../banner-example.jpg 479w, ../banner-example-small.jpg 359w",
          "alt": "..."
        }
      }
    ]
  },
  "settings": {
    "mode": {
      "desktop": "static",
      "tablet": "slider",
      "mobile": "slider"
    },
    "height": "300px",
    "compression": "none"
  }
}
```

Supported compression modes:

```
compression = "none" | "webp" | "avif" | "auto"
```

---

# Architectural Principles

## Non-blocking optimisation

Banner rendering must **always work regardless of optimisation state**.

Images should render immediately, even if optimisation has not yet been performed.

---

## Contract-driven behaviour

Compression behaviour is controlled through the **banner contract**, ensuring transparency and predictability.

---

## Asynchronous improvement

Optimisation tasks are performed **outside the rendering path**, allowing improvements without affecting deployments or runtime stability.

---

# Future Extension (Optional)

Later versions may introduce optimisation status tracking.

Example:

```json
"compression": {
  "mode": "webp",
  "status": "pending"
}
```

Possible states:

```
pending
optimised
valid
```

This would allow the system to automatically activate optimised assets once processing completes.

---

# Vision

The goal is simple:

**A homepage banner should never be the reason a website receives a poor Lighthouse score.**

By progressively introducing asynchronous optimisation, the ReactEdge Banner Widget enables teams to maintain performance while giving marketing teams full freedom to update campaigns independently.