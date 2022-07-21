import boto3
import os
from opentelemetry import trace

sqs = boto3.client('sqs')
SQS_QUEUE_URL = os.getenv("SQS_QUEUE_URL")


def lambda_handler(event, context):
    ctx = trace.get_current_span().get_span_context()
    print(str(ctx))
    response = sqs.send_message(
        QueueUrl=SQS_QUEUE_URL,
        DelaySeconds=10,
        MessageAttributes={
            'Title': {
                'DataType': 'String',
                'StringValue': 'The Whistler',
            },
            'ContextTraceId': {
                'DataType': 'String',
                'StringValue': str(ctx.trace_id),
            },
            'ContextSpanId': {
                'DataType': 'String',
                'StringValue': str(ctx.span_id),
            },
            'ContextTraceFlags': {
                'DataType': 'String',
                'StringValue': str(ctx.trace_flags),
            },
            'ContextTraceState': {
                'DataType': 'String',
                'StringValue': str(ctx.trace_state),
            },
            'ContextIsRemote': {
                'DataType': 'String',
                'StringValue': str(ctx.is_remote),
            },
        },
        MessageBody=(
            'Information about current NY Times fiction bestseller for '
            'week of 12/11/2016.'
        ),
    )

    print(response['MessageId'])

    return {'statusCode': 200, 'body': response['MessageId']}
