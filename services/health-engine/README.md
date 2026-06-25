# ReactEdge Feature Health Engine

The ReactEdge Feature Health Engine continuously validates the
operational health of deployed frontend platforms.

Rather than validating source code, it observes live deployments,
validates deployed widget configurations, measures public page
performance, and produces structured health reports that can be consumed
by observability platforms or autonomous remediation systems.

## Features

-   Discover deployed ReactEdge widget instances
-   Validate live widget contracts
-   Validate public page performance from the site's sitemap
-   Detect cache state and response time
-   Normalize validation failures into Health Issues
-   Match Health Rules
-   Emit OpenTelemetry observations
-   Foundation for autonomous remediation

## Validate Widgets

``` bash
curl -X POST http://localhost:3002/validation/widgets
```

## Validate Performance

``` bash
curl -X POST http://localhost:3002/validation/performance
```

The performance validator:

-   Discovers pages from the site's native Magento sitemap.
-   Measures the initial response time.
-   Detects whether each page is already cached.
-   Re-validates only pages that were initially cold.
-   Compares both measurements.
-   Produces a performance health report.

## Health Validation Pipeline

``` text
Validation Request
        ↓
Discover Targets
        ↓
Execute Validators
        ↓
Normalize Health Issues
        ↓
Match Rules
        ↓
OpenTelemetry
        ↓
Health Report
```