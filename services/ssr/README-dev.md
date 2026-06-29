npm install express react react-dom
npm install -D typescript tsx @types/node @types/express

.env for local
WIDGETS_CDN_URL=http://localhost:8098
PORT=3001
USP_ENTRY=../../usp/src/ssr/entry

.env for dev
WIDGETS_CDN_URL=http://widgets-cdn
USP_ENTRY=/usp/src/ssr/entry


```bash
curl -vk -X POST https://widgets-ssr.co.uk/render \
  -H "Content-Type: application/json" \
  -d '{
    "widget": "megamenu",
    "contractFile": "default.json",
    "runtime": {
      "integrations": {
        "googleMaps": {},
        "magentoGraphql": {},
        "intentApi": {}
      },
      "storeCode": "default",
      "category": null
    }
  }'
```

```bash
seq 1 5 | xargs -P5 -I{} \
curl -vk -X POST https://widgets-ssr.co.uk/render \
  -H "Content-Type: application/json" \
  -d '{
    "widget": "megamenu",
    "contractFile": "default.json",
    "runtime": {
      "integrations": {
        "googleMaps": {},
        "magentoGraphql": {},
        "intentApi": {}
      },
      "storeCode": "default",
      "category": null
    }
  }' > /dev/null
```

```bash
curl -vk -X POST https://ssr-origin.reactedge.net/render \
-H "Content-Type: application/json" \
-d '{
"widget": "megamenu",
"contractFile": "default.json",
"runtime": {
"integrations": {
"googleMaps": {},
"magentoGraphql": {},
"intentApi": {}
},
"storeCode": "default",
"category": null
}
}'
```

npm install \
@opentelemetry/api \
@opentelemetry/sdk-trace-node \
@opentelemetry/sdk-trace-base \
@opentelemetry/exporter-trace-otlp-http \
@opentelemetry/resources