from random import randint
from time import sleep

import logging as log
log.basicConfig(level=log.INFO)

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
    log.info('Starting The Coffee Bar')

    # Create root span
    root_span = tracer.start_span('coffee-bar-root-span')

    # Set additional attribute
    root_span.set_attribute('coffee', 'espresso')

    # Pass the root span to the child span to obtain context
    preparation_span = prepare_coffee(root_span)

    # Pass the parent span (preparation_span) to the child span (packing_span) to obtain context
    coffee_pack(preparation_span)

    root_span.end()
    log.info('Coffee provided.')


def prepare_coffee(parent_span):
    log.info('Coffee preparation in progress...')

    # Parent context
    context = set_span_in_context(parent_span)

    # Create child span called 'preparing-coffee' based on the parent span context
    preparation_span = tracer.start_span('preparing-coffee', context=context)

    # Random sleep
    preparation_time = randint(1, 2)
    sleep(preparation_time)

    # Add additional attribute to the span
    preparation_span.set_attribute('preparation_time', preparation_time)

    # End span
    preparation_span.end()

    log.info('Preparation done.')

    return preparation_span


def coffee_pack(parent_span):
    log.info('Coffee packing in progress...')

    # Parent context
    context = set_span_in_context(parent_span)

    # Create child span called 'packing-coffee' based on the parent span context
    packing_span = tracer.start_span('packing-coffee', context=context)

    # Random sleep
    packing_time = randint(1, 2)
    sleep(packing_time)

    # Add additional attribute to the span
    packing_span.set_attribute('packing_time', packing_time)

    # End span
    packing_span.end()

    log.info('Packing done.')

    return


coffee_bar()
