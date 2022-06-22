# Sumo Logic OTel Distro Agent for AWS ECS (bridge network mode)

## Installation
### Environment configuration
Set up the following environment variables that are needed to perform the AWS OpenTelemetry Collector deployment:
* CLUSTER_NAME - your ECS Cluster name setup from prerequisite
* AWS_REGION - your ECS Cluster deployment region
* TEMPLATE_PATH - path to the OTel Distro Agent cloud formation template file [EC2](./otel-distro-agent-bridge-ec2.yaml)
* OTEL_COLLECTOR_ENDPOINT - mandatory OTLP HTTP collector endpoint

### Stack deployment
Execute the command below to create an AWS CloudFormation stack that deploys the Sumo Logic OTel Distro Agent on your cluster:
```bash
aws cloudformation create-stack --stack-name sumologic-otel-distro-agent \
--template-body file://${TEMPLATE_PATH} \
--parameters ParameterKey=ClusterName,ParameterValue=${CLUSTER_NAME} \
ParameterKey=OtelCollectorEndpoint,ParameterValue=${OTEL_COLLECTOR_ENDPOINT} \
--capabilities=CAPABILITY_NAMED_IAM \
--region=${AWS_REGION}
```
