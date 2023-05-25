import { decrypt, encrypt } from "@/server/utils/encryption";
import { ddbDocClient } from "./ddbClient";
import { awsConfig } from "@/constants";

export const userAuthRepository = () => {
  const createUserAuth = async ({
    id,
    accessToken,
    refreshToken,
  }: Pick<UserAuth, "id" | "accessToken" | "refreshToken">): Promise<unknown> => {
    const currentDate = new Date().toISOString();

    const item: UserAuth = {
      id,
      accessToken: encrypt(accessToken),
      refreshToken: encrypt(refreshToken),
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    try {
      await ddbDocClient.put({
        TableName: awsConfig.tableName,
        Item: item,
      });

      return;
    } catch (e) {
      throw e;
    }
  };

  const readUserAuth = async ({ id }: Pick<UserAuth, "id">): Promise<UserAuth> => {
    try {
      const res = await ddbDocClient.get({
        TableName: awsConfig.tableName,
        Key: {
          id,
        },
      });

      const userAuth = res.Item as UserAuth;

      return {
        id: userAuth.id,
        accessToken: decrypt(userAuth.accessToken),
        refreshToken: decrypt(userAuth.refreshToken),
        createdAt: userAuth.createdAt,
        updatedAt: userAuth.updatedAt,
      };
    } catch (e) {
      throw e;
    }
  };

  const updateUserAuth = async ({
    id,
    accessToken,
    refreshToken,
  }: Pick<UserAuth, "id" | "accessToken" | "refreshToken">): Promise<unknown> => {
    const currentDate = new Date().toISOString();

    try {
      await ddbDocClient.update({
        TableName: awsConfig.tableName,
        Key: {
          id,
        },
        UpdateExpression: "SET #a = :accessToken, #r = :refreshToken, #u = :updatedAt",
        ExpressionAttributeNames: {
          "#a": "accessToken",
          "#r": "refreshToken",
          "#u": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":accessToken": encrypt(accessToken),
          ":refreshToken": encrypt(refreshToken),
          ":updatedAt": currentDate,
        },
      });

      return;
    } catch (e) {
      throw e;
    }
  };

  const deleteUserAuth = async ({ id }: Pick<UserAuth, "id">): Promise<unknown> => {
    try {
      await ddbDocClient.delete({
        TableName: awsConfig.tableName,
        Key: {
          id,
        },
      });

      return;
    } catch (e) {
      throw e;
    }
  };

  return {
    createUserAuth,
    readUserAuth,
    updateUserAuth,
    deleteUserAuth,
  };
};
