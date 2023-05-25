import { encrypt } from "@/server/utils/encryption";
import { ddbClient } from "./ddbClient";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { awsConfig } from "@/constants";

export const userAuthRepository = () => {
  const createUserAuth = async ({ id, accessToken, refreshToken }: UserAuth) => {
    const currentDate = new Date().toISOString();
    const params = {
      TableName: awsConfig.tableName,
      Item: {
        id: { S: id },
        access_token: { S: encrypt(accessToken) },
        refresh_token: { S: encrypt(refreshToken) },
      },
      created_at: { S: currentDate },
      updated_at: { S: currentDate },
    };

    return await ddbClient.send(new PutItemCommand(params));
  };

  return {
    createUserAuth,
  };
};
