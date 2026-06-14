# 0008 — Widget Fallback Rendering

## Status
Accepted

## Context

ReactEdge widgets are normally mounted dynamically by the runtime loader.

In some integrations, it may be desirable to display meaningful content before JavaScript execution to improve Lighthouse performance or support progressive enhancement.

## Decision

Fallback rendering is **optional** and handled at the **integration layer**.

By default a widget may be mounted directly:

<banner-widget data-contract="/cdn/uk.json"></banner-widget>

When progressive enhancement is required, the host page may provide fallback content that is replaced when the widget mounts.

## Fallback Content

Fallback content may be any static representation appropriate to the host platform, for example:

- HTML
- SVG
- images
- server-rendered PHP templates
- CMS content

## Consequences

Positive:

- improved Lighthouse performance when fallbacks are used
- progressive enhancement support
- flexible integration across platforms

Trade-offs:

- fallback implementation becomes the responsibility of the host integration