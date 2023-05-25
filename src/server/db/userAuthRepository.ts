import { encrypt } from "@/server/utils/encryption";
import { ddbDocClient } from "./ddbClient";
import { awsConfig } from "@/constants";

export const userAuthRepository = () => {
  const createUserAuth = async ({ id, accessToken, refreshToken }: UserAuth) => {
    const currentDate = new Date().toISOString();

    return await ddbDocClient.put({
      TableName: awsConfig.tableName,
      Item: {
        id,
        access_token: encrypt(accessToken),
        refresh_token: encrypt(refreshToken),
        created_at: currentDate,
        updated_at: currentDate,
      },
    });
  };

  return {
    createUserAuth,
  };
};
