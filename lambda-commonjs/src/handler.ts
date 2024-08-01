import { S3 } from 'aws-sdk';

const listS3Buckets = async (): Promise<string[]> => {
  const s3 = new S3();
  try {
    const response = await s3.listBuckets().promise();
    return response.Buckets ? response.Buckets.map(bucket => bucket.Name).filter((name): name is string => !!name) : [];
  } catch (error) {
    console.error('Error listing S3 buckets:', error);
    throw error;
  }
};

module.exports = { listS3Buckets };
