import boto3
from opentelemetry import trace, context as ot_ctx
from opentelemetry.trace.span import NonRecordingSpan
from opentelemetry.trace.span import TraceState, TraceFlags
s3 = boto3.resource('s3')


def with_span_link(ctx_from_sqs, msg_id):
    link = trace.Link(context=ctx_from_sqs)

    tracer = trace.get_tracer(__name__)
    with tracer.start_as_current_span("link_to_sqs", links=[link]) as span:
        span.set_attribute('sqsMsgId', msg_id)


def lambda_handler(event, context):
    records = event['Records']

    for record in records:
        attrs = record['messageAttributes']
        if attrs:
            print(attrs)
            trace_id = int(attrs['ContextTraceId']['stringValue'])
            span_id = int(attrs['ContextSpanId']['stringValue'])
            trace_flags = TraceFlags(int(attrs['ContextTraceFlags']['stringValue']))
            # Add better support for TraceState
            trace_state = TraceState(None)
            if attrs['ContextTraceState']['stringValue'] != '[]':
                print(attrs['ContextTraceState']['stringValue'])
            is_remote = bool(attrs['ContextIsRemote']['stringValue'])

            msg_id = record['messageId']
            # Create SpanContext based on the context from SQS msg
            ctx_from_sqs = trace.SpanContext(trace_id, span_id, is_remote, trace_flags, trace_state)

            # Scenario 1 - create span_link based on the context from SQS msg
            with_span_link(ctx_from_sqs, msg_id)

            # Scenario 2 - switch context to the context from SQS msg (not possible for root span - handler span)
            # for all new spans
            ctx = trace.set_span_in_context(NonRecordingSpan(ctx_from_sqs))
            ot_ctx.attach(ctx)

    for bucket in s3.buckets.all():
        print(bucket)
