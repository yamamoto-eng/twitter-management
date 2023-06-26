import { ddbDocClient } from "../../libs";
import { AWS_CONFIG } from "@/constants";
import dayjs from "dayjs";
import { credentialTransformer } from "./transformer/credentialTransformer";
import { GetCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { CredentialDB, CredentialAPP } from "../models";

export const credentialRepository = (id: string) => {
  const tableName = AWS_CONFIG.TABLE_NAME;
  const nowDate = dayjs().toISOString();
  const { toDB, toAPP } = credentialTransformer();

  return {
    save: async (
      credential: Pick<CredentialAPP, "accessToken" | "refreshToken">
    ): Promise<CredentialAPP | undefined> => {
      const input = toDB({
        id,
        accessToken: credential.accessToken,
        refreshToken: credential.refreshToken,
        createdAt: nowDate,
        updatedAt: nowDate,
      });

      const command = new UpdateCommand({
        TableName: tableName,
        Key: {
          HASH: input.HASH,
        },
        UpdateExpression: `SET GSI1HASH = :GSI1HASH, GSI1RANGE = if_not_exists(GSI1RANGE, :GSI1RANGE), accessToken = :accessToken, refreshToken = :refreshToken, updatedAt = :updatedAt`,
        ExpressionAttributeValues: {
          ":GSI1HASH": input.GSI1HASH,
          ":GSI1RANGE": input.GSI1RANGE,
          ":accessToken": input.accessToken,
          ":refreshToken": input.refreshToken,
          ":updatedAt": input.updatedAt,
        },
      });

      const res = await ddbDocClient.send(command);

      if (!res.Attributes) {
        return undefined;
      }

      return toAPP(res.Attributes as CredentialDB);
    },

    find: async (): Promise<CredentialAPP | undefined> => {
      const command = new GetCommand({
        TableName: tableName,
        Key: {
          HASH: id,
        },
      });

      const res = await ddbDocClient.send(command);

      if (!res.Item) {
        return undefined;
      }

      return toAPP(res.Item as CredentialDB);
    },

    remove: async (): Promise<CredentialAPP | undefined> => {
      const command = new DeleteCommand({
        TableName: tableName,
        Key: {
          HASH: id,
        },
      });

      const res = await ddbDocClient.send(command);

      if (!res.Attributes) {
        return undefined;
      }

      return toAPP(res.Attributes as CredentialDB);
    },
  };
};
