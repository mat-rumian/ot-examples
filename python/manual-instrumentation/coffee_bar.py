from random import randint
from time import sleep

import logging as log
log.basicConfig(level=log.INFO)

from opentelemetry import trace
from opentelemetry.trace import set_span_in_context
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.zipkin.json import ZipkinExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import (
    ConsoleSpanExporter,
    SimpleSpanProcessor,
    BatchSpanProcessor)
from opentelemetry.sdk.resources import Resource
from opentelemetry.trace.status import Status, StatusCode

# Initiate tracer and set Service Name from the code if is not set from the environment variable
# OTEL_RESOURCE_ATTRIBUTES=service.name=COFFEE-BAR
# service_name = Resource.create({'service.name': 'coffee-bar'})
# provider = TracerProvider(resource=service_name)

# Initiate tracer
provider = TracerProvider()

# Use SimpleSpanProcessor only for ConsoleSpanExporter (in other case can cause performance issues), recommended for
# debug
ssp_processor = SimpleSpanProcessor(ConsoleSpanExporter())
provider.add_span_processor(ssp_processor)

# Add OTLP gRPC Span Exporter - endpoint can be configured via env variable
# OTEL_EXPORTER_OTLP_ENDPOINT=http://HOSTNAME:4317
# OpenTelemetry Collector instance is required to run
# otlp_grpc_exporter = OTLPSpanExporter()
# otlp_bsp_processor = BatchSpanProcessor(otlp_grpc_exporter)
# provider.add_span_processor(otlp_bsp_processor)

# Add Zipkin exporter - endpoint can be configure via env variable
# OTEL_EXPORTER_ZIPKIN_ENDPOINT=http://hostname:9411/api/v2/spans
zipkin_exporter = ZipkinExporter()
zipkin_bsp_processor = BatchSpanProcessor(zipkin_exporter)
provider.add_span_processor(zipkin_bsp_processor)

trace.set_tracer_provider(provider)
tracer = trace.get_tracer('coffee-bar')


def coffee_bar():
    with tracer.start_as_current_span('coffee-bar-root-span') as root_span:
        root_span.set_attribute('coffee', 'espresso')
        #root_span.set_status(Status(StatusCode.ERROR))
        prepare_coffee()


def prepare_coffee():
    # For prettier trace view
    sleep(0.01)

    with tracer.start_as_current_span('preparing-coffee') as preparation_span:
        log.info('Coffee preparation in progress...')
        preparation_time = 0.01
        sleep(preparation_time)
        preparation_span.set_attribute('preparation_time', preparation_time)

        log.info('Coffee done.')
        #preparation_span.set_status(Status(StatusCode.ERROR))

        coffee_pack()


def coffee_pack():
    with tracer.start_as_current_span('packing-coffee') as packing_span:
        log.info('Coffee packing in progress...')
        preparation_time = 0.01
        sleep(preparation_time)
        packing_span.set_attribute('packing_time', preparation_time)

        log.info('Coffee packing done.')


for i in range(0, 10):
    coffee_bar()
