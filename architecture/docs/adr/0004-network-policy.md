# ADR-0004: Zero-Network by Default Policy

## Status
Accepted (Test-Enforced)

---

## Context

Embeddable widgets must not introduce hidden network dependencies that:

- Break Content Security Policy (CSP)
- Introduce latency
- Create security concerns
- Reduce rendering predictability

Unexpected network calls undermine portability and enterprise trust.

---

## Decision

Widgets must not initiate external network requests unless:

- Explicitly declared in `integrations`
- Clearly documented in architecture notes

Playwright tests enforce zero unexpected network activity in controlled fixtures.

Network activity is considered part of the contract surface.

---

## Example: Cloudflare Turnstile Integration

When a widget requires Cloudflare Turnstile, it must declare it in the contract:

```json
{
  "data": { ... },
  "integrations": {
    "require": ["cloudflare"]
  }
}
```

The runtime configuration provides the required public key separately:

```javascript
<script type="application/json" id="reactedge-runtime">
{
  "integrations": {
    "cloudflare": {
      "siteKey": "PUBLIC_KEY"
    }
  }
}
</script>
```

No widget may load third-party scripts unless the corresponding integration is declared.

## Consequences
**Positive**
- Predictable performance
- CSP-safe by design
- Enterprise-ready embed model
- Explicit integration boundaries

**Trade-offs**
- Data fetching strategy must be explicit and intentional
- Future async widgets must declare loading responsibility clearly

