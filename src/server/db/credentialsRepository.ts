import { decrypt, encrypt } from "@/server/utils";
import { ddbDocClient } from "../../libs";
import { AWS_CONFIG } from "@/constants";
import { Credentials } from "@/models";
import dayjs from "dayjs";

export const credentialsRepository = () => {
  const nowDate = dayjs().toISOString();

  const createCredentials = async ({
    id,
    accessToken,
    refreshToken,
  }: Pick<Credentials, "id" | "accessToken" | "refreshToken">): Promise<unknown> => {
    const item: Credentials = {
      id,
      accessToken: encrypt(accessToken),
      refreshToken: encrypt(refreshToken),
      createdAt: nowDate,
      updatedAt: nowDate,
    };

    try {
      await ddbDocClient.put({
        TableName: AWS_CONFIG.TABLE_NAME,
        Item: item,
      });

      return;
    } catch (e) {
      throw e;
    }
  };

  const readCredentials = async ({ id }: Pick<Credentials, "id">): Promise<Credentials | undefined> => {
    try {
      const res = await ddbDocClient.get({
        TableName: AWS_CONFIG.TABLE_NAME,
        Key: {
          id,
        },
      });

      if (!res.Item) {
        return undefined;
      }

      const credentials = res.Item as Credentials;

      return {
        id: credentials.id,
        accessToken: decrypt(credentials.accessToken),
        refreshToken: decrypt(credentials.refreshToken),
        createdAt: credentials.createdAt,
        updatedAt: credentials.updatedAt,
      };
    } catch (e) {
      console.log("error", e);
      throw e;
    }
  };

  const updateCredentials = async ({
    id,
    accessToken,
    refreshToken,
  }: Pick<Credentials, "id" | "accessToken" | "refreshToken">): Promise<unknown> => {
    const nowDate = dayjs().toISOString();

    try {
      await ddbDocClient.update({
        TableName: AWS_CONFIG.TABLE_NAME,
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
          ":updatedAt": nowDate,
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
        TableName: AWS_CONFIG.TABLE_NAME,
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
