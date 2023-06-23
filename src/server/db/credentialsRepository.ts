import { encryption } from "@/server/utils";
import { ddbDocClient } from "../../libs";
import { AWS_CONFIG } from "@/constants";
import { Credentials } from "@/models";
import dayjs from "dayjs";

export const credentialsRepository = (id: Credentials["id"]) => {
  const { encrypt, decrypt } = encryption();
  const nowDate = dayjs().toISOString();

  return {
    createCredentials: (accessToken: Credentials["accessToken"], refreshToken: Credentials["refreshToken"]) => {
      const item: Credentials = {
        id,
        accessToken: encrypt(accessToken),
        refreshToken: encrypt(refreshToken),
        createdAt: nowDate,
        updatedAt: nowDate,
      };

      return ddbDocClient.put({
        TableName: AWS_CONFIG.TABLE_NAME,
        Item: item,
      });
    },

    readCredentials: async (): Promise<Credentials | undefined> => {
      const res = await ddbDocClient.get({
        TableName: AWS_CONFIG.TABLE_NAME,
        Key: {
          id,
        },
        ProjectionExpression: "id, accessToken, refreshToken, createdAt, updatedAt",
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
    },

    updateCredentials: (accessToken: Credentials["accessToken"], refreshToken: Credentials["refreshToken"]) => {
      const nowDate = dayjs().toISOString();

      return ddbDocClient.update({
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
    },

    deleteCredentials: () => {
      return ddbDocClient.delete({
        TableName: AWS_CONFIG.TABLE_NAME,
        Key: {
          id,
        },
      });
    },
  };
};
