from random import randint
from time import sleep

import logging as log

from opentelemetry import trace
from opentelemetry.trace import set_span_in_context
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import (
    ConsoleSpanExporter,
    SimpleSpanProcessor,
    BatchSpanProcessor)
from opentelemetry.sdk.resources import Resource

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
otlp_grpc_exporter = OTLPSpanExporter()
bsp_processor = BatchSpanProcessor(otlp_grpc_exporter)
provider.add_span_processor(bsp_processor)

trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)


def coffee_bar():
    with tracer.start_as_current_span('coffee-bar-root-span') as root_span:
        root_span.set_attribute('coffee', 'espresso')
        prepare_coffee()


def prepare_coffee():
    with tracer.start_as_current_span('preparing-coffee') as preparation_span:
        log.info('Coffee preparation in progress...')
        preparation_time = randint(1, 5)
        sleep(preparation_time)
        preparation_span.set_attribute('preparation_time', preparation_time)

        log.info('Coffee done.')

        coffee_pack()


def coffee_pack():
    with tracer.start_as_current_span('packing-coffee') as packing_span:
        log.info('Coffee packing in progress...')
        preparation_time = randint(1, 5)
        sleep(preparation_time)
        packing_span.set_attribute('packing_time', preparation_time)

        log.info('Coffee packing done.')


coffee_bar()
