# 0009: Enforce Subresource Integrity (SRI) for ReactEdge Widgets

## Status
**Status:** Accepted  
**Last Updated:** 2026-04-22

---

## Context

ReactEdge widgets are distributed as remotely hosted JavaScript bundles (IIFE) and embedded into third-party platforms such as Magento and WordPress.

This creates a critical trust boundary:
- Code is executed inside client storefronts
- Assets are fetched from external CDN endpoints
- Deployment is decoupled from the host platform release cycle

Without integrity validation:
- Any compromise of CDN, DNS, or pipeline can inject malicious code
- Clients implicitly trust remote execution without verification
- Security posture is not acceptable for production-grade commerce environments

---

## Decision

All widget scripts must be loaded using Subresource Integrity (SRI) with a cryptographic hash.

- Each widget build generates a content hash
- The hash is:
    - Embedded in the script URL (filename)
    - Exposed in a manifest
    - Injected into the host platform as the `integrity` attribute

Example:

```html
<script 
  src="https://widget-banner.reactedge.net/widget-banner@<hash>.iife.js"
  integrity="sha384-<hash>"
  crossorigin="anonymous">
</script>
```

---

## Rationale

This decision enforces runtime verification of third-party code execution.

Key properties:
- Guarantees immutability of deployed assets
- Detects tampering at the browser level
- Removes blind trust in CDN delivery
- Aligns with modern frontend security practices

This is not optional for distributed widget architectures.

---

## Consequences

### Positive

- Strong protection against supply chain attacks
- Safe decoupling of deployment from host platforms
- Enables independent widget lifecycle
- Improves credibility with enterprise clients

---

### Negative

- Deployment becomes hash-coupled
    - Any change requires updating integrity values
- Rollbacks are no longer trivial
    - Require manifest lookup or tooling
- Debugging becomes harder (cached + hashed assets)
- Slight increase in integration complexity for clients

---

### Neutral / Trade-offs

- Version numbers become informational only
- Hash becomes the true source of truth
- CI/CD pipeline must manage:
    - Hash generation
    - Manifest publishing
    - Integrity propagation

---

## Alternatives Considered

### 1. No SRI
Rejected: unacceptable security risk in distributed execution model.

### 2. Version-based loading only
Rejected: does not guarantee integrity, only identifies versions.

### 3. Signed manifests only
Partially useful but insufficient:
- Does not enforce browser-level validation
- Still trusts runtime delivery

---

## Implementation Notes

- Hash algorithm: sha384
- Manifest structure:

```json
{
  "banner": {
    "src": ".../widget-banner@<hash>.js",
    "integrity": "sha384-<hash>"
  }
}
```

- Magento (or host platform):
    - Reads manifest
    - Injects both `src` and `integrity`

- CI/CD responsibilities:
    - Generate hash at build time
    - Publish versioned assets
    - Update manifest atomically

---

## Future Considerations

- Introduce automated rollback tooling (version → hash resolution)
- Add signature verification for manifest itself
- Explore Content Security Policy (CSP) alignment
- Evaluate edge-side validation (Cloudflare Workers)

---

## Bottom line

SRI is not a “security enhancement.”  
It is the minimum viable control once you execute remote code inside someone else’s storefront.