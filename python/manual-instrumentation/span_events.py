import traceback
import logging as log
from os import environ
from time import sleep

log.basicConfig(level=log.INFO)

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import (
    ConsoleSpanExporter,
    SimpleSpanProcessor,
    SimpleSpanProcessor
)
from opentelemetry.util._time import _time_ns
from opentelemetry.sdk.resources import Resource

environ[
    "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"] = "HTTP_TRACES_URL"

# Initiate tracer
service_name = Resource.create({'service.name': 'span-event-creator'})
provider = TracerProvider(resource=service_name)

ssp_processor = SimpleSpanProcessor(ConsoleSpanExporter())
provider.add_span_processor(ssp_processor)

otlp_http_exporter = OTLPSpanExporter()
otlp_ssp = SimpleSpanProcessor(otlp_http_exporter)
provider.add_span_processor(otlp_ssp)

trace.set_tracer_provider(provider)
tracer = trace.get_tracer('coffee-bar')


def span_creator():
    with tracer.start_as_current_span('root-span') as root_span:
        root_span.set_attribute('key', 'value')

        # Custom event
        root_span.add_event("exception_name", {"exception.code": 503,
                                               "exception.message": "EXCEPTION MESSAGE"},
                            _time_ns())

        # Automatically recorded event
        try:
            with open('test.asd') as f:
                f.read()
        except Exception as e:
            tb = traceback.format_exc()
            e.with_traceback(tb)


span_creator()
sleep(10)
