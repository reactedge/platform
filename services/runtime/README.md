## Start Jaeger to run observability
```bash
docker compose up -d
go to http://localhost:16686/search
refresh Magento and search for traces for the service reactedge-runtime
```

ITE_OTEL_ENDPOINT=http://localhost:4318