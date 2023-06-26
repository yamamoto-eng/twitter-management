import { AWS_CONFIG } from "@/constants";
import { ddbDocClient } from "@/libs";
import { ExecutedTweetAPP, ExecutedTweetDB } from "@/server/models";
import { DeleteCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dayjs from "dayjs";
import { executedTweetTransformer } from "./transformer/executedTweetTransformer";

export const executedTweetRepository = (id: string) => {
  const tableName = AWS_CONFIG.TABLE_NAME;
  const { toAPP, toDB } = executedTweetTransformer();

  return {
    save: async (executedTweet: Omit<ExecutedTweetAPP, "tweetedAt">): Promise<ExecutedTweetAPP | undefined> => {
      const nowDate = dayjs().toISOString();

      const input = toDB({
        ...executedTweet,
        tweetedAt: nowDate,
      });

      const command = new UpdateCommand({
        TableName: tableName,
        Key: {
          HASH: input.HASH,
        },
        UpdateExpression: `SET #GSI1HASH = :GSI1HASH, #GSI1RANGE = if_not_exists(#GSI1RANGE, :GSI1RANGE), #scheduledDeletionDate = :scheduledDeletionDate, #GSI2HASH = :GSI2HASH, #GSI2RANGE = :GSI2RANGE, #tweetId = :tweetId, #text = :text`,
        ExpressionAttributeValues: {
          ":GSI1HASH": input.GSI1HASH,
          ":GSI1RANGE": input.GSI1RANGE,
          ":scheduledDeletionDate": input.scheduledDeletionDate,
          ":GSI2HASH": input.GSI2HASH,
          ":GSI2RANGE": input.GSI2RANGE,
          ":tweetId": input.tweetId,
          ":text": input.text,
        },
        ExpressionAttributeNames: {
          "#GSI1HASH": "GSI1HASH",
          "#GSI1RANGE": "GSI1RANGE",
          "#GSI2HASH": "GSI2HASH",
          "#GSI2RANGE": "GSI2RANGE",
          "#scheduledDeletionDate": "scheduledDeletionDate",
          "#tweetId": "tweetId",
          "#text": "text",
        },
      });

      await ddbDocClient.send(command);

      return toAPP(input);
    },

    updateScheduledDeletionDate: async ({
      ebId,
      scheduledDeletionDate,
    }: Pick<ExecutedTweetAPP, "ebId" | "scheduledDeletionDate">) => {
      const command = new UpdateCommand({
        TableName: tableName,
        Key: {
          HASH: ebId,
        },
        UpdateExpression: `SET #scheduledDeletionDate = :scheduledDeletionDate`,
        ExpressionAttributeValues: {
          ":scheduledDeletionDate": scheduledDeletionDate,
        },
        ExpressionAttributeNames: {
          "#scheduledDeletionDate": "scheduledDeletionDate",
        },
        ReturnValues: "ALL_NEW",
      });

      const res = await ddbDocClient.send(command);

      if (!res.Attributes) {
        return undefined;
      }

      return toAPP(res.Attributes as ExecutedTweetDB);
    },

    findById: async (ebId: string): Promise<ExecutedTweetAPP | undefined> => {
      const command = new GetCommand({
        TableName: tableName,
        Key: {
          HASH: ebId,
        },
      });

      const res = await ddbDocClient.send(command);

      if (!res.Item) {
        return undefined;
      }

      return toAPP(res.Item as ExecutedTweetDB);
    },

    findAllByScheduledEbId: async (scheduledEbId: string): Promise<ExecutedTweetAPP[]> => {
      const command = new QueryCommand({
        TableName: tableName,
        IndexName: "GSI2",
        KeyConditionExpression: "GSI2HASH = :gh and GSI2RANGE >= :gr",
        ExpressionAttributeValues: {
          ":gh": scheduledEbId,
          ":gr": dayjs("2000-01-01").toISOString(),
        },
      });

      const res = await ddbDocClient.send(command);

      if (!res.Items) {
        return [];
      }

      return res.Items.map((item) => toAPP(item as ExecutedTweetDB));
    },

    findAll: async (): Promise<ExecutedTweetAPP[]> => {
      const command = new QueryCommand({
        TableName: tableName,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1HASH = :gh and GSI1RANGE >= :gr",
        ExpressionAttributeValues: {
          ":gh": `${AWS_CONFIG.LOGICAL_TABLES.EXECUTED_TWEET}|${id}`,
          ":gr": dayjs("2000-01-01").toISOString(),
        },
      });

      const res = await ddbDocClient.send(command);

      if (!res.Items) {
        return [];
      }

      return res.Items.map((item) => toAPP(item as ExecutedTweetDB));
    },

    remove: async (ebId: string): Promise<ExecutedTweetAPP | undefined> => {
      const command = new DeleteCommand({
        TableName: tableName,
        Key: {
          HASH: ebId,
        },
        ReturnValues: "ALL_OLD",
      });

      const res = await ddbDocClient.send(command);

      if (!res.Attributes) {
        return undefined;
      }

      return toAPP(res.Attributes as ExecutedTweetDB);
    },
  };
};
