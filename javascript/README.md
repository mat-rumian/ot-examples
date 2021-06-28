# OpenTelemetry JavaScript instrumentation debug examples
Simple Express framework and HTTP applications instrumented by OpenTelemetry JS

## Pre-req
* docker
* docker-compose
* Sumologic HTTP Traces URL endpoint (fill the value of otlphttp/traces_endpoint in dockerization/otelcol.yml) 

## Build
```bash
cd dockerization
docker-compose build
```

## Run
```bash
docker-compose up
```

## Traffic trigger
```bash
curl http://localhost:8081/run_test
```
