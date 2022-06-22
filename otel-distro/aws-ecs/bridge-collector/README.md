# Sumo Logic OTel Distro Collector for AWS ECS (bridge network mode)

## Installation
### Environment configuration
Set up the following environment variables that are needed to perform the AWS OpenTelemetry Collector deployment:
* CLUSTER_NAME - your ECS Cluster name setup from prerequisite
* AWS_REGION - your ECS Cluster deployment region
* TEMPLATE_PATH - path to the OTel Distro Collector cloud formation template file [EC2](./otel-distro-collector-bridge-ec2.yaml) or [Fargate](otel-distro-collector-bridge-fargate.yaml)
* SUMO_OTLP_HTTP_URL - mandatory Sumo Logic OTLP HTTP Source URL

### Stack deployment
Execute the command below to create an AWS CloudFormation stack that deploys the Sumo Logic OTel Distro Collector on your cluster:
```bash
aws cloudformation create-stack --stack-name sumologic-otel-distro-collector-ec2 \
--template-body file://${TEMPLATE_PATH} \
--parameters ParameterKey=ClusterName,ParameterValue=${CLUSTER_NAME} \
ParameterKey=OtlpHttpEndpoint,ParameterValue=${SUMO_OTLP_HTTP_URL} \
--capabilities=CAPABILITY_NAMED_IAM \
--region=${AWS_REGION}
```
