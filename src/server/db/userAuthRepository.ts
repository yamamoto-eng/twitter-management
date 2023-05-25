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

  const readUserAuth = async ({ id }: Pick<UserAuth, "id">) => {
    return await ddbDocClient.get({
      TableName: awsConfig.tableName,
      Key: {
        id,
      },
    });
  };

  const updateUserAuth = async ({ id, accessToken, refreshToken }: UserAuth) => {
    const currentDate = new Date().toISOString();
    return await ddbDocClient.update({
      TableName: awsConfig.tableName,
      Key: {
        id,
      },
      UpdateExpression: "SET #a = :access_token, #r = :refresh_token, #u = :updated_at",
      ExpressionAttributeNames: {
        "#a": "access_token",
        "#r": "refresh_token",
        "#u": "updated_at",
      },
      ExpressionAttributeValues: {
        ":access_token": accessToken,
        ":refresh_token": refreshToken,
        ":updated_at": currentDate,
      },
    });
  };

  const deleteUserAuth = async ({ id }: Pick<UserAuth, "id">) => {
    return await ddbDocClient.delete({
      TableName: awsConfig.tableName,
      Key: {
        id,
      },
    });
  };

  return {
    createUserAuth,
    readUserAuth,
    updateUserAuth,
    deleteUserAuth,
  };
};
