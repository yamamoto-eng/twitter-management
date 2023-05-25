import { awsConfig } from "@/constants";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const ddbClient = new DynamoDBClient({
  region: awsConfig.region,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
  },
});
