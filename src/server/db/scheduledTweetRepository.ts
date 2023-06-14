import { ddbDocClient } from "../../libs";
import { AWS_CONFIG } from "@/constants";
import { Credentials, ScheduledTweet } from "@/models";
import dayjs from "dayjs";

export const scheduledTweetRepository = (id: Credentials["id"]) => {
  const tableName = AWS_CONFIG.TABLE_NAME;
  const itemName = AWS_CONFIG.TABLE_ITEMS.SCHEDULED_TWEET_LIST;

  return {
    addScheduledTweet: async (scheduledTweet: Omit<ScheduledTweet, "createdAt">): Promise<ScheduledTweet> => {
      const nowDate = dayjs().toISOString();

      const item: ScheduledTweet = {
        ...scheduledTweet,
        createdAt: nowDate,
      };
      await ddbDocClient.update({
        TableName: tableName,
        Key: {
          id,
        },
        UpdateExpression: "SET #tl = list_append(if_not_exists(#tl, :empty), :t)",
        ExpressionAttributeNames: {
          "#tl": itemName,
        },
        ExpressionAttributeValues: {
          ":t": [item],
          ":empty": [],
        },
      });

      return item;
    },

    readScheduledTweet: async (ebId: string): Promise<ScheduledTweet | undefined> => {
      const res = await ddbDocClient.get({
        TableName: tableName,
        Key: {
          id,
        },
        ProjectionExpression: itemName,
      });

      if (!res.Item) {
        return undefined;
      }

      const scheduledTweetList: ScheduledTweet[] = res.Item[itemName] ?? [];
      const scheduledTweet = scheduledTweetList.find((scheduledTweet) => scheduledTweet.ebId === ebId);

      if (!scheduledTweet) {
        throw new Error("scheduledTweet not found");
      }

      return scheduledTweet;
    },

    readScheduledTweetList: async (): Promise<ScheduledTweet[]> => {
      const res = await ddbDocClient.get({
        TableName: tableName,
        Key: {
          id,
        },
        ProjectionExpression: itemName,
      });

      if (!res.Item) {
        return [];
      }

      return res.Item[itemName] ?? [];
    },

    updateScheduledTweet: async (scheduledTweet: Omit<ScheduledTweet, "createdAt">): Promise<ScheduledTweet> => {
      const res = await ddbDocClient.get({
        TableName: tableName,
        Key: {
          id,
        },
        ProjectionExpression: itemName,
      });

      // TODO: handle error
      if (!res.Item) {
        throw new Error(`${itemName} not found`);
      }

      let updatedScheduledTweet: ScheduledTweet | undefined = undefined;

      const scheduledTweetList = (res.Item[itemName] ?? []) as ScheduledTweet[];
      const newScheduledTweetList = scheduledTweetList.map((item) => {
        if (item.ebId === scheduledTweet.ebId) {
          const newScheduledTweet = { ...item, ...scheduledTweet };
          updatedScheduledTweet = newScheduledTweet;
          return newScheduledTweet;
        }
        return item;
      });

      await ddbDocClient.update({
        TableName: tableName,
        Key: {
          id,
        },
        UpdateExpression: "SET #tl = :t",
        ExpressionAttributeNames: {
          "#tl": itemName,
        },
        ExpressionAttributeValues: {
          ":t": newScheduledTweetList,
        },
      });

      if (!updatedScheduledTweet) {
        throw new Error("scheduledTweet not found");
      }

      return updatedScheduledTweet as ScheduledTweet;
    },

    deleteScheduledTweet: async (ebId: string): Promise<ScheduledTweet> => {
      const res = await ddbDocClient.get({
        TableName: tableName,
        Key: {
          id,
        },
        ProjectionExpression: itemName,
      });

      // TODO: handle error
      if (!res.Item) {
        throw new Error(`${itemName} not found`);
      }

      const scheduledTweetList = (res.Item[itemName] ?? []) as ScheduledTweet[];
      let deletedScheduledTweet: ScheduledTweet | undefined = undefined;

      const newScheduledTweetList = scheduledTweetList.filter((scheduledTweet) => {
        if (scheduledTweet.ebId === ebId) {
          deletedScheduledTweet = scheduledTweet;
          return false;
        }
        return true;
      });

      await ddbDocClient.update({
        TableName: tableName,
        Key: {
          id,
        },
        UpdateExpression: "SET #tl = :t",
        ExpressionAttributeNames: {
          "#tl": itemName,
        },
        ExpressionAttributeValues: {
          ":t": newScheduledTweetList,
        },
      });

      if (!deletedScheduledTweet) {
        throw new Error("scheduledTweet not found");
      }

      return deletedScheduledTweet as ScheduledTweet;
    },
  };
};
