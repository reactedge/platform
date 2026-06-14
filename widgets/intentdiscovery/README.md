# AI-Powered Intent Discovery for Magento

An end-to-end intent-driven product discovery system that augments
Magento layered navigation with:

-   Real-time intent scoring (client-side)
-   Deterministic pre-scoring (server-side)
-   AI-powered ranking and explanation
-   Structured JSON schema enforcement
-   Pluggable infrastructure integrations

------------------------------------------------------------------------

## Architecture Overview

Frontend (Vite + React) ↓ IntentEngine (client-side weighted signals) ↓
Node Backend (/intent/suggest) ↓ preScoreProducts (deterministic
filtering) ↓ OpenAI (gpt-4o-mini, JSON schema enforced) ↓ Top 5 ranked
suggestions + explanation ↓ UI presentation

------------------------------------------------------------------------

## Project Structure

-   `vite_project/` --- React frontend widget
-   `node-backend/` --- Express API + OpenAI integration

------------------------------------------------------------------------

## Backend Setup

``` bash
cd node-backend
npm install
```

Create a `.env` file:

    OPENAI_API_KEY=your_key_here
    PORT=3003

Run:

``` bash
npm run dev
```

------------------------------------------------------------------------

## Frontend Setup

``` bash
cd vite_project
npm install
npm run dev
```

To run the widget in SSR mode:

```bash
cd widget-intentdiscovery
npm install
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/render-page.ts ../widgets-cdn/www/intentdiscovery/contracts/default.json
```

------------------------------------------------------------------------

## Runtime Integration Configuration

The backend endpoint is configured via integrations (NOT hard-coded):

``` ts
intentApi: {
  baseUrl: "http://localhost:3003"
}
```

In production, this should be:

``` ts
intentApi: {
  baseUrl: "https://api.yourdomain.com"
}
```

------------------------------------------------------------------------

## AI Recommendation Flow

1.  IntentEngine accumulates weighted interaction signals.
2.  Top N products are pre-scored server-side.
3.  AI selects up to 5 products.
4.  AI generates:
    -   `message`
    -   `suggestions[]`
    -   `confidence`
    -   `reason`
5.  JSON schema is strictly enforced.
6.  Deterministic fallback used if AI fails.

## To run the test suite:
```bash
npx playwright test --config=tests/playwright.dev.config.ts
npx playwright test --config=tests/playwright.dev.config.ts --debug
npx playwright test --config=tests/playwright.dev.config.ts -g "title is visible" 
npx playwright test --config=tests/playwright.dev.config.ts show-report
```

------------------------------------------------------------------------

## Production Considerations

-   Prefer relative `/intent/suggest` behind reverse proxy
-   Enable HTTPS
-   Add TTL caching for identical requests
-   Monitor OpenAI token usage
-   Implement rate limiting
-   Add circuit breaker for repeated AI failures

------------------------------------------------------------------------