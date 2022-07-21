# OpenTelemetry context propagation for AWS Lambda and SQS queue

There're some bugs/lack of functionality for automatic context propagation thru SQS queue for OpenTelemetry 
auto-instrumented AWS Lambda functions. This gap can be workaround by adding some code into lambda functions. 

Issues:
* https://github.com/aws-observability/aws-otel-python/issues/11
* https://github.com/aws/aws-xray-sdk-node/issues/208

First of all, for SQS `pusher` current span context has to be obtained and added to the SQS message - in the example to 
the attributes. Then `puller` function has to create new SpanContext based on the context provided by attributes. 

## Reqs
* [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* Set AWS Access ID and AWS Access Key
* [Sumo Logic HTTP Traces URL](https://help.sumologic.com/Traces/01Getting_Started_with_Transaction_Tracing/HTTP_Traces_Source)

## Deployment
1. Set Sumo Logic HTTP Traces URL

    ```bash
    export SUMO_HTTP_TRACES_URL=https://your-generated-http-traces-url
    ```

2. Deploy stack
    
    ```bash
    ./run.sh -r AWS_REGION
    ```

## Traffic generation
After successful deployment in the `Outputs` section `ApiUrl` will appear. Navigate to it few times and search in Sumo
for `application=sqs-ctx-app` traces.
