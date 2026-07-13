# 0012 — Local HTTPS Parity and Runtime Boundary Strategy

## Status

Proposed

---

# Context

ReactEdge increasingly operates across multiple independent runtime boundaries during local development.

These boundaries may include:
- widget runtimes
- rendering services
- backend integrations
- local development platforms
- browser-facing asset delivery

Early local development approaches relied heavily on:
- localhost assumptions
- container-local networking
- internal Docker aliases
- HTTP-only communication

While initially simple, these approaches introduced growing operational asymmetry between:
- local environments
- staging environments
- production environments

This asymmetry created several recurring problems:
- inconsistent runtime behavior
- hidden networking assumptions
- TLS-specific failures appearing only after deployment
- unreliable local reproduction of distributed runtime issues
- increasing difficulty debugging runtime integrations

As ReactEdge evolved toward independently deployable runtime boundaries, local HTTPS parity became increasingly important.

---

# Decision

## 1. Local runtime communication uses HTTPS boundaries

ReactEdge local environments communicate through explicit HTTPS hostnames rather than container-local aliases or localhost-only assumptions.

Examples:

```text
https://widgets-ssr.co.uk
https://widgets-cdn.co.uk
https://mageos-docker.magsite.co.uk
```

Purpose:
- align local runtime topology with production expectations
- reduce hidden environment-specific behavior
- make distributed runtime interactions explicit
- improve reproducibility of integration failures

---

## 2. Runtime boundaries are externally addressable

Runtime services are treated as independently addressable endpoints during local development.

This applies even when services execute on the same physical machine.

Purpose:
- reduce coupling between runtime location and runtime identity
- support independent runtime execution strategies
- simplify future deployment portability
- improve operational clarity between systems

---

## 3. Local HTTPS certificates are managed centrally

Local HTTPS certificates are generated and managed through a centralized local certificate authority.

Purpose:
- provide browser-trusted HTTPS locally
- allow realistic TLS behavior during development
- surface certificate and trust-chain issues earlier
- reduce divergence between local and production runtime behavior

---

## 4. Reverse proxy routing is centralized

Local hostname routing and HTTPS termination are centralized through a dedicated reverse proxy layer.

Purpose:
- provide stable runtime entrypoints
- simplify local runtime discovery
- reduce per-service networking configuration
- centralize HTTPS handling and routing concerns

---

# Consequences

## Positive

- Local and production runtime topology become significantly closer
- Runtime integration failures become easier to reproduce locally
- HTTPS-specific issues surface earlier in development
- Runtime services become more deployment-independent
- Browser and runtime behavior become more predictable across environments
- Runtime boundaries become clearer and easier to reason about

---

## Negative

- Local infrastructure complexity increases
- Certificate trust propagation becomes operationally important
- Docker and host trust stores require explicit management
- Local firewall and routed traffic behavior become relevant
- Runtime debugging may involve additional networking layers
- Local development setup becomes more operationally sensitive

---

# Notes

This ADR intentionally focuses on:
- runtime topology
- HTTPS parity
- local boundary behavior

It does not define:
- rendering strategies
- CDN governance
- orchestration models
- observability implementations

Those concerns are addressed separately through dedicated architectural decisions.

---

# Future considerations

Potential future evolution areas include:
- automated local certificate propagation
- runtime discovery automation
- simplified local onboarding tooling
- environment health validation
- local topology observability
- self-healing local runtime orchestration
