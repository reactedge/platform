### Create cloudflare worker
Login to Cloudflare / Go to Workers & Pages 
Create application / choose Hello World / Deploy
Add a route for the worker: from the search, search for worker route
Once create click Edit Code

The snippet below caches the graphql POST calls transforming them in GET requests

```bash
export default {
async fetch(request, env, ctx) {
const url = new URL(request.url)

    // Only cache GraphQL POST
    if (url.pathname === "/graphql" && request.method === "POST") {
      const bodyText = await request.clone().text()

      // Skip mutations (critical)
      if (bodyText.includes("mutation")) {
        return fetch(request)
      }

      let parsed
      try {
        parsed = JSON.parse(bodyText)
      } catch {
        return fetch(request) // invalid JSON → don't cache
      }

      const normalized = JSON.stringify(parsed)    
      const store = request.headers.get("Store") || ""

      const cacheKey = new Request(
        url.toString() + "?cacheKey=" + encodeURIComponent(store + ":" + normalized),
        {
          method: "GET"
        }
      )

      const cache = caches.default    
      let response = await cache.match(cacheKey)     

      if (!response) {
        const originResponse = await fetch(request)

        if (originResponse.status === 200) {
          const body = await originResponse.text()

          const headers = new Headers(originResponse.headers)
      
          headers.delete("set-cookie")
          headers.delete("Set-Cookie")
          headers.delete("cache-control")
          headers.delete("pragma")

          // ✅ Set cache-friendly headers
          headers.set("Cache-Control", "public, max-age=60")

          const MISS = new Response(body, {
            status: originResponse.status,
            headers
          })

          MISS.headers.set("X-Cache", "MISS")
          ctx.waitUntil(cache.put(cacheKey, MISS.clone()))
          return MISS
        }

        return originResponse
      }

      const HIT = new Response(response.body, response)
      HIT.headers.set("X-Cache", "HIT")
      return HIT
    }

    return fetch(request)
}
}
````