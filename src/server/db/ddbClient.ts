import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const ddbClient = new DynamoDBClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
  },
});
