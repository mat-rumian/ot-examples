const { listS3Buckets } = require('./handler');

const handler = async (event: any): Promise<any> => {
  try {
    const buckets = await listS3Buckets();
    return {
      statusCode: 200,
      body: JSON.stringify(buckets),
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error listing S3 buckets',
          error: error.message,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'An unknown error occurred',
        }),
      };
    }
  }
};

module.exports.handler = handler;
