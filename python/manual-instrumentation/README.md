# Un espresso per favore - Python manual instrumentation 

Simple application to present how to manually instrument the Python code with OpenTelemetry Python instrumentation.

## Prerequisite

* Python 3
* Pip
* OpenTelemetry Collector (OPTIONAL) - only if OTLP gRPC exporter is used.
* [Sumo Logic HTTP Traces URL](https://help.sumologic.com/Traces/HTTP_Traces_Source) - to export traces to Sumo Logic endpoint

## Dependencies installation

```bash
$ pip install -r requirements.txt
```

## Configuration

### Service Name configuration

The best way to configure *servcie name* is to set environment variable `OTEL_RESOURCE_ATTRIBUTES`.

```bash
export OTEL_RESOURCE_ATTRIBUTES=service.name=YOUR_SERVICE_NAME
```

### Exporting traces by Zipkin exporter to Sumo Logic

To export traces to [Sumo Logic HTTP Traces endpoint](https://help.sumologic.com/Traces/HTTP_Traces_Source) it is required to configure environment variable `OTEL_EXPORTER_ZIPKIN_ENDPOINT` which will setup endpoint for the Zipkin exporter.

```bash
export OTEL_EXPORTER_ZIPKIN_ENDPOINT=YOUR_SUMO_LOGIC_HTTP_TRACES_URL
```

## Exporting traces by OTLP gRPC exporter

Exporting traces by OTLP gRPC exporter require OpenTelemetry Collector instance please check [here](https://help.sumologic.com/Traces/Getting_Started_with_Transaction_Tracing/Set_up_traces_collection_for_other_environments).
OTLP gRPC exporter endpoint can be configured via environment variable `OTEL_EXPORTER_OTLP_ENDPOINT`.

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=http://OTELCOL_HOSTNAME:4317
```

## Execution

```bash
$ python coffee_bar_manual_propagation.py
```

```bash
$ python coffee_bar.py
```
