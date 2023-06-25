import { AWS_CONFIG } from "@/constants";
import { ddbDocClient } from "@/libs";
import { ExecutedTweet } from "@/server/models";
import dayjs from "dayjs";

export const executedTweetRepository = (id: string) => {
  const tableName = AWS_CONFIG.TABLE_NAME;
  const itemName = AWS_CONFIG.TABLE_ITEMS.EXECUTED_TWEET_LIST;

  return {
    addExecutedTweet: async (
      executedTweet: Omit<ExecutedTweet, "isTweetDeleted" | "tweetedAt">
    ): Promise<ExecutedTweet> => {
      const nowDate = dayjs().toISOString();

      const item: ExecutedTweet = {
        ...executedTweet,
        tweetedAt: nowDate,
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

    readExecutedTweet: async (ebId: string): Promise<ExecutedTweet | undefined> => {
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

      const executedTweetList: ExecutedTweet[] = res.Item[itemName] ?? [];
      const executedTweet = executedTweetList.find((executedTweet) => executedTweet.ebId === ebId);

      return executedTweet;
    },

    readExecutedTweetList: async (): Promise<ExecutedTweet[]> => {
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

    updateExecutedTweet: async (
      executedTweet: Pick<ExecutedTweet, "ebId" | "scheduledDeletionDate">
    ): Promise<ExecutedTweet> => {
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

      let updatedExecutedTweet: ExecutedTweet | undefined = undefined;

      const executedTweetList = (res.Item[itemName] ?? []) as ExecutedTweet[];
      const newExecutedTweetList = executedTweetList.map((item) => {
        if (item.ebId === executedTweet.ebId) {
          const newExecutedTweet: ExecutedTweet = {
            ...item,
            scheduledDeletionDate: executedTweet.scheduledDeletionDate,
          };
          updatedExecutedTweet = newExecutedTweet;
          return newExecutedTweet;
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
          ":t": newExecutedTweetList,
        },
      });

      if (!updatedExecutedTweet) {
        throw new Error("executedTweet not found");
      }

      return updatedExecutedTweet as ExecutedTweet;
    },

    deleteExecutedTweet: async (ebId: string): Promise<ExecutedTweet> => {
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

      const executedTweetList = (res.Item[itemName] ?? []) as ExecutedTweet[];
      let deletedExecutedTweet: ExecutedTweet | undefined = undefined;

      const newExecutedTweetList = executedTweetList.filter((executedTweet) => {
        if (executedTweet.ebId === ebId) {
          deletedExecutedTweet = executedTweet;
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
          ":t": newExecutedTweetList,
        },
      });

      if (!deletedExecutedTweet) {
        throw new Error(`${itemName} not found`);
      }

      return deletedExecutedTweet as ExecutedTweet;
    },
  };
};
