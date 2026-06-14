# ReactEdge – Google Reviews Widget

A small, embeddable **Google Reviews widget** designed to surface trust signals (ratings and reviews) within existing websites without taking ownership of the page or application lifecycle.

This widget is part of the **ReactEdge** initiative: a collection of frontend widgets built with a strong emphasis on isolation, reversibility, and clarity.

---

## What this is

- A lightweight frontend widget for displaying Google business reviews
- Designed to be embedded into existing platforms (e.g. Magento, CMS, static sites)
- Uses Google Places data as a source of truth
- Isolated by default (no global CSS or JS leakage)
- Easy to install **and easy to remove**
- Actively used and evolving

---

## What this is NOT

- ❌ A review management system
- ❌ A replacement for Google Business Profile
- ❌ A data aggregation platform
- ❌ A growth or conversion guarantee
- ❌ A backend service

This widget focuses on **safe delivery of trust signals**, not ownership of data or business logic.

---

## Design principles

- **Isolation first** – does not assume ownership of the host page
- **Reversible by design** – removal leaves no residual impact
- **Non-hostile to the host** – coexists with existing layouts and styles
- **Minimal surface area** – only exposes what is required
- **Testable in isolation** – can run independently of any platform
- **Deferred by default** – does not require early page execution
- **External data awareness** – integrates with third-party APIs without leaking concerns into the host
- **Layered structure** – aligns with ReactEdge architectural patterns
- **Boring on purpose** – prioritises clarity over abstraction
- **Observable by the host** – emits lifecycle signals for integration (analytics, monitoring)

---

## ⚠️ Data source considerations

This widget relies on:

- Google Places API
- A valid `placeId`

### Important constraints

- Maximum of ~5 reviews returned by Google
- Data is read-only
- Requires API key configuration
- Subject to Google quota and rate limits

---

## 🎨 Styling Tokens

The Reviews widget exposes optional CSS variables for host-level customization.

### Available Tokens

--re-reviews-bg  
--re-reviews-text-color  
--re-reviews-card-bg  
--re-reviews-radius  
--re-reviews-shadow  
--re-reviews-star-color  
--re-reviews-font-size

### Example

```css
.re-widget-reviews {
  --re-reviews-bg: #ffffff;
  --re-reviews-text-color: #222;
  --re-reviews-star-color: #f5a623;
}