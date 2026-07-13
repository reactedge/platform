# Feature Observability Demo

A lightweight observability widget that captures frontend activity and exports it using OpenTelemetry-compatible telemetry.

The project is based on the simple idea that each feature `have a lifecycle`: 

User Interaction
↓
Frontend Activity
↓
Telemetry Event
↓
Trace / Observability Platform

Rather than treating frontend features as black boxes, the widget makes feature behaviour observable and measurable.

## Why?

Modern applications often provide excellent infrastructure monitoring but limited visibility into what individual frontend features are doing.

This project explores how a self-contained frontend feature can:

Emit structured activity events
Produce distributed traces
Integrate with standard observability tooling
Create a foundation for future self-healing capabilities

These are valuable signals, but they tell us little about how a feature behaves.

```text
search.started
↓
search.completed
```

or

```text
search.started
↓
search.failed
```

Feature observability allows us to capture and analyse those journeys.

## What does this repository demonstrate?

The demo contains:

* A small React feature
* Contract-driven configuration
* Activity tracking
* OpenTelemetry instrumentation
* Jaeger integration using Docker Compose

The search feature itself is intentionally simple. The focus of the repository is not the business logic but the observability journey.

The feature emits telemetry whenever meaningful activities occur.

For example:

```text
search.started
search.completed
search.failed
```

These events become spans that can be viewed inside Jaeger.

## Architecture

```text
Widget
↓
Activity
↓
OpenTelemetry
↓
Collector
↓
Jaeger
```

The feature itself remains unaware of Jaeger or OpenTelemetry implementation details.

It simply reports activity.

## Running the Demo

Install dependencies:

```bash
npm install
```

Start Jaeger and the OpenTelemetry Collector:

```bash
docker compose up -d
```

Start the application:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Open Jaeger:

```text
http://localhost:16686
```

Perform a search and observe the generated traces.

## Why this matters

As frontend architectures become increasingly modular, independently deployed features should become independently observable.

Feature observability allows engineers to move beyond monitoring technical components and begin understanding feature behaviour, feature failures and feature outcomes.

Observability is the foundation.

Self-healing features are the next step.

## Production Considerations

This repository intentionally bundles the telemetry implementation inside the widget.

The goal is to keep the example self-contained and easy to understand:

Widget
↓
Telemetry
↓
OpenTelemetry
↓
Observability Platform

For a small demonstration project this approach is perfectly acceptable.

For production environments, a different architecture is recommended:

Widget
↓
Telemetry Contract
↓
Shared Telemetry Runtime
↓
Observability Platform

In this model:

Widgets emit activity through a lightweight interface.
Telemetry libraries are loaded once by the host application.
Multiple widgets share the same telemetry runtime.
Bundle sizes remain smaller.
Telemetry configuration can be managed centrally.
Observability can evolve independently from individual widgets.

The current implementation therefore demonstrates the observability concepts rather than the final deployment architecture.