# Sumo Logic OTel Distro Collector for AWS ECS

## Installation
### Environment configuration
Set up the following environment variables that are needed to perform the AWS OpenTelemetry Collector deployment:
* CLUSTER_NAME - your ECS Cluster name setup from prerequisite
* AWS_REGION - your ECS Cluster deployment region
* TEMPLATE_PATH - path to the OTel Distro Collector cloud formation template file [EC2](./otel-distro-collector-awsvpc-ec2.yaml) or [Fargate](otel-distro-collector-awsvpc-fargate.yaml)
* SUMO_OTLP_HTTP_URL - mandatory Sumo Logic OTLP HTTP Source URL
* SUBNETS - same as Security Groups, Subnets have to be configured for AWS Fargate. To find Subnets used on the cluster, use the VPC ID from Security Group and search for it on the list here. In the case of multiple Subnets use a comma as a separator, such as, subnet-xyz,subnet-xyz.
* SECURITY_GROUPS - it is mandatory for AWS Fargate deployment to provide a Security Group ID. They can be found in the AWS Console. Find the one configured for the cluster. In the case of multiple Security Groups use a comma as separator, such as, sg-xyz,sg-xyz.  

    **Note:** The OpenTelemetry Collector receives data from various receivers - these ports should be configured in the Security Group:
    * OTLP - ports: `4317/tcp`, `4318/tcp`
    * Collector Metrics - port `8888/tcp` (http://hostname:8888/metrics)

### Stack deployment
Execute the command below to create an AWS CloudFormation stack that deploys the Sumo Logic OTel Distro Collector on your cluster:
```bash
aws cloudformation create-stack --stack-name sumologic-otel-distro-collector-ec2 \
--template-body file://${TEMPLATE_PATH} \
--parameters ParameterKey=ClusterName,ParameterValue=${CLUSTER_NAME} \
ParameterKey=OtlpHttpEndpoint,ParameterValue=${SUMO_OTLP_HTTP_URL} \
ParameterKey=SecurityGroups,ParameterValue=\"${SECURITY_GROUPS}\" \
ParameterKey=Subnets,ParameterValue=\"${SUBNETS}\" \
--capabilities=CAPABILITY_NAMED_IAM \
--region=${AWS_REGION}
```
