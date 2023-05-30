import { AWS_CONFIG } from "@/constants";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: AWS_CONFIG.REGION,
  credentials: {
    accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
    secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY_ID,
  },
});

const marshallOptions = {
  convertClassInstanceToMap: true,
};

export const ddbDocClient = DynamoDBDocument.from(client, {
  marshallOptions,
});
