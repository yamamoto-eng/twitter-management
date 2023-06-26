import { ddbDocClient } from "../../libs";
import { AWS_CONFIG } from "@/constants";
import { ScheduledTweetAPP, ScheduledTweetDB } from "@/server/models";
import dayjs from "dayjs";
import { scheduledTweetTransformer } from "./transformer/scheduledTweetTransformer";
import { DeleteCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const scheduledTweetRepository = (id: string) => {
  const tableName = AWS_CONFIG.TABLE_NAME;
  const { toAPP, toDB } = scheduledTweetTransformer();

  return {
    save: async (scheduledTweet: Omit<ScheduledTweetAPP, "createdAt">): Promise<ScheduledTweetAPP | undefined> => {
      const nowDate = dayjs().toISOString();

      const input = toDB({
        ...scheduledTweet,
        createdAt: nowDate,
      });

      const command = new UpdateCommand({
        TableName: tableName,
        Key: {
          HASH: input.HASH,
        },
        UpdateExpression: `SET GSI1HASH = :GSI1HASH, GSI1RANGE = if_not_exists(GSI1RANGE, :GSI1RANGE), fromDate = :fromDate, toDate = :toDate, isEnabled = :isEnabled, #interval = :interval, scheduledDeletionDay = :scheduledDeletionDay, #text = :text`,
        ExpressionAttributeValues: {
          ":GSI1HASH": input.GSI1HASH,
          ":GSI1RANGE": input.GSI1RANGE,
          ":fromDate": input.fromDate,
          ":toDate": input.toDate,
          ":isEnabled": input.isEnabled,
          ":interval": input.interval,
          ":scheduledDeletionDay": input.scheduledDeletionDay,
          ":text": input.text,
        },
        ExpressionAttributeNames: {
          "#interval": "interval",
          "#text": "text",
        },
      });

      await ddbDocClient.send(command);

      return toAPP(input);
    },

    findById: async (ebId: string): Promise<ScheduledTweetAPP | undefined> => {
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

      return toAPP(res.Item as ScheduledTweetDB);
    },

    findAll: async (): Promise<ScheduledTweetAPP[]> => {
      const command = new QueryCommand({
        TableName: tableName,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1HASH = :gh and GSI1RANGE >= :gr",
        ExpressionAttributeValues: {
          ":gh": `${AWS_CONFIG.LOGICAL_TABLES.SCHEDULED_TWEET}|${id}`,
          ":gr": dayjs("2000-01-01").toISOString(),
        },
      });

      const res = await ddbDocClient.send(command);

      if (!res.Items) {
        return [];
      }

      return res.Items.map((item) => toAPP(item as ScheduledTweetDB));
    },

    remove: async (ebId: string): Promise<ScheduledTweetAPP | undefined> => {
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

      return toAPP(res.Attributes as ScheduledTweetDB);
    },
  };
};
