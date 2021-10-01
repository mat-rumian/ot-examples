# OpenTelemetry Golang instrumentation debug examples
Simple HTTP client application instrumented by OpenTelemetry Go

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

## Expected result
```console
mrumian-mac:dockerization mrumian$ docker-compose up
[+] Running 3/3
 ⠿ Network dockerization_default  Created                                                                                            0.1s
 ⠿ Container otelcol              Started                                                                                            1.1s
 ⠿ Container simple-service       Started                                                                                            2.0s
Attaching to otelcol, simple-service
simple-service  | Response status code: 200 OK
simple-service  | Waiting for few seconds to export spans ...
simple-service  | 
otelcol         | 2021-10-01T11:34:47.672Z      INFO    loggingexporter/logging_exporter.go:332 TracesExporter  {"#spans": 1}
otelcol         | 2021-10-01T11:34:47.673Z      DEBUG   loggingexporter/logging_exporter.go:371 ResourceSpans #0
otelcol         | Resource labels:
otelcol         |      -> application: STRING(simple-service-app)
otelcol         |      -> service.name: STRING(golang-test)
otelcol         |      -> telemetry.sdk.language: STRING(go)
otelcol         |      -> telemetry.sdk.name: STRING(opentelemetry)
otelcol         |      -> telemetry.sdk.version: STRING(1.0.0)
otelcol         | InstrumentationLibrarySpans #0
otelcol         | InstrumentationLibrary go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp semver:0.24.0
otelcol         | Span #0
otelcol         |     Trace ID       : 24ff4183f36efe12ace062e29d20c5a7
otelcol         |     Parent ID      : 
otelcol         |     ID             : 165f7c545973bdee
otelcol         |     Name           : HTTP GET
otelcol         |     Kind           : SPAN_KIND_CLIENT
otelcol         |     Start time     : 2021-10-01 11:34:42.669197405 +0000 UTC
otelcol         |     End time       : 2021-10-01 11:34:43.320488098 +0000 UTC
otelcol         |     Status code    : STATUS_CODE_UNSET
otelcol         |     Status message : 
otelcol         | Attributes:
otelcol         |      -> http.method: STRING(GET)
otelcol         |      -> http.url: STRING(https://sumologic.com)
otelcol         |      -> http.scheme: STRING(http)
otelcol         |      -> http.host: STRING(sumologic.com)
otelcol         |      -> http.flavor: STRING(1.1)
otelcol         |      -> http.status_code: INT(301)
otelcol         | 
simple-service exited with code 0
```