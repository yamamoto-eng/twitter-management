import { decrypt, encrypt } from "@/server/utils/encryption";
import { ddbDocClient } from "./ddbClient";
import { awsConfig } from "@/constants";

export const credentialsRepository = () => {
  const createCredentials = async ({
    id,
    accessToken,
    refreshToken,
  }: Pick<Credentials, "id" | "accessToken" | "refreshToken">): Promise<unknown> => {
    const currentDate = new Date().toISOString();

    const item: Credentials = {
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

  const readCredentials = async ({ id }: Pick<Credentials, "id">): Promise<Credentials> => {
    try {
      const res = await ddbDocClient.get({
        TableName: awsConfig.tableName,
        Key: {
          id,
        },
      });

      const credentials = res.Item as Credentials;

      return {
        id: credentials.id,
        accessToken: decrypt(credentials.accessToken),
        refreshToken: decrypt(credentials.refreshToken),
        createdAt: credentials.createdAt,
        updatedAt: credentials.updatedAt,
      };
    } catch (e) {
      throw e;
    }
  };

  const updateCredentials = async ({
    id,
    accessToken,
    refreshToken,
  }: Pick<Credentials, "id" | "accessToken" | "refreshToken">): Promise<unknown> => {
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

  const deleteCredentials = async ({ id }: Pick<Credentials, "id">): Promise<unknown> => {
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
    createCredentials,
    readCredentials,
    updateCredentials,
    deleteCredentials,
  };
};
