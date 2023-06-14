import { AWS_CONFIG } from "@/constants";
import { ddbDocClient } from "@/libs";
import { Credentials, ExecutedTweet } from "@/models";
import dayjs from "dayjs";

export const executedTweetRepository = (id: Credentials["id"]) => {
  const tableName = AWS_CONFIG.TABLE_NAME;
  const itemName = AWS_CONFIG.TABLE_ITEMS.EXECUTED_TWEET_LIST;

  return {
    addExecutedTweet: async (
      executedTweet: Omit<ExecutedTweet, "isTweetDeleted" | "tweetedAt">
    ): Promise<ExecutedTweet> => {
      const nowDate = dayjs().toISOString();

      const item: ExecutedTweet = {
        ...executedTweet,
        isTweetDeleted: false,
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

    updateExecutedTweet: async (
      executedTweet: Partial<ExecutedTweet> & Pick<ExecutedTweet, "ebId">
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

      const ExecutedTweetList = (res.Item[itemName] ?? []) as ExecutedTweet[];
      const newExecutedTweetList = ExecutedTweetList.map((item) => {
        if (item.ebId === executedTweet.ebId) {
          const newExecutedTweet: ExecutedTweet = {
            ...item,
            scheduledDeletionDate: executedTweet.scheduledDeletionDate
              ? executedTweet.scheduledDeletionDate
              : item.scheduledDeletionDate,
            isTweetDeleted: executedTweet.isTweetDeleted ? executedTweet.isTweetDeleted : item.isTweetDeleted,
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
  };
};
