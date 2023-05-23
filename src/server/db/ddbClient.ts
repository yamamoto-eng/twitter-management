import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { EnvironmentCredentials } from "aws-sdk";

export const ddbClient = new DynamoDBClient({
  region: "ap-northeast-1",
  credentials: new EnvironmentCredentials("AWS"),
});
