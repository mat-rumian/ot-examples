# OpenTelemetry Java Auto-Instrumentation for Apache Tomcat

## Pre-req
* docker
* docker-compose
* Sumo Logic HTTP Traces URL endpoint (fill the value of `otlphttp/traces_endpoint` in [dockerization/otelcol.yml](./dockerization/otelcol.yaml)) 

## Build
```bash
cd dockerization
docker-compose build
```

## Run
```bash
docker-compose up
```

Then navigate to http://localhost:8080 and generate some traffic.
Spans should be visible in the `otelcol` container logs and exported to Sumo Logic.

## Troubleshooting
To make sure that spans are reaching collector navigate to http://localhost:8888/metrics and search for:
* otelcol_receiver_accepted_spans
* otelcol_receiver_refused_spans
* otelcol_exporter_sent_spans
* otelcol_exporter_send_failed_spans
