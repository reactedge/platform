# Booking System Widget

A booking flow designed to work under hostile embedding constraints — where modals, global state, and platform control are unavailable.

A **decoupled, embeddable booking widget** delivered as a single versioned JavaScript file.  
It can be embedded into **WordPress, Magento, or static sites** and communicates with a Keystone backend.

The widget is designed for **isolation, determinism, and flexible reuse** across different use cases and industries.

---

## What this repository contains

- Frontend booking widget source
- Build pipeline producing `widget-*.iife.js`
- Public embedding contract (custom element + data attributes)
- Local development setup for the widget

---

## What this repository does NOT contain

- Backend (Keystone) configuration
- OAuth provider setup or secrets
- Server or infrastructure configuration (Nginx, TLS, pm2, etc.)
- CMS theme or template code (WordPress, Magento)
- Deployment or operations scripts
---

## Usage

Embed the widget by including the custom element and pointing it to a **versioned script URL**:

```html
<div class="booking-system">
    <bookingsystem-widget
            data-load="eager"
            data-src="https://widgets.example.com/widget-booking-system@X.Y.Z.iife.js"
            data-page="request-an-appointment"
            data-venue="green-edge"
    ></bookingsystem-widget>
</div>

<script type="application/json" id="reactedge-config">
    {
        "widgets": {
            "booking": {
                "api": "https://<keystone-url>/api/graphql/"
            }
        },
        "integrations": {
            "cloudflare": {
                "siteKey": "..."
            }
        }
    }
</script>

<div id="security-gate" class="hidden">
    <div class="security-veil"></div>
    <div id="booking-turnstile"></div>
</div>
```

## Design goals

This widget is intentionally designed around the following constraints:
No control over the host DOM or global layout
No reliance on modals, overlays, or z-index stacking
Linear, state-driven UX (login → booking → action)
Security checks applied to business mutations, not navigation
The implementation favours determinism, isolation, and recoverable UI states over visual complexity.

## Roadmap
This repository is published before feature-completion to document architectural decisions in public.

Planned work includes:
- OAuth integration (credential → token handoff already designed)
- Step-up authentication after repeated login failure
- Turnstile token reuse across booking flow
- Expanded Playwright coverage on abuse scenarios
- Playwright tests focused on core flow integrity  

## Hosts examples
| Host                           | Test to check it works                                                                                                       | Notes on the component                                                                                                                                                                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **booking-api.local**          | Open `https://booking-api.local/api/graphql` in browser → expect GraphQL JSON (or GraphiQL), then run `query { __typename }` | Keystone persistence + GraphQL. Must be bound to `0.0.0.0`, HTTPS cert trusted, CORS must allow `https://southerndemo.com` **with credentials**. Auth logic must accept JWT (not rely on `context.session`).                                      |
| **oauth-api.local**            | `POST https://oauth-api.local/auth/login` → expect `200` + token in JSON                                                     | Token issuer only. No cookies here unless explicitly designed. Verify token format (JWT vs opaque) and expiry. HTTPS required but CORS usually not (server-to-server or same origin).                                                             |
| **auth-bridge.local**          | Hit login/refresh endpoint → DevTools → Application → Cookies → verify cookie appears                                        | Most fragile component. Must set cookie with `Secure; SameSite=None; Domain=.southerndemo.com; Path=/`. Must return `Access-Control-Allow-Origin: https://southerndemo.com` **and** `Allow-Credentials: true`. Any mismatch silently breaks auth. |
| **southerndemo.com**           | Load page → Network tab shows widget JS `200`, no CSP/CORS errors                                                            | Host page. Must be HTTPS. Must not block third-party scripts or credentials. CSP must allow widget domain and auth-bridge. Cookies should be visible under this domain after auth.                                                                |
| **widget.bookingsystem.co.uk** | Widget loads, then triggers calls to auth-bridge and booking-api with `credentials: include`                                 | Execution layer only. Should not read cookies manually. Should rely on browser cookie attachment. Any auth failure here usually originates upstream (cookies or CORS).                                                                            |

To run the test suite:
```bash
npx playwright test --config=tests/playwright.dev.config.ts
```