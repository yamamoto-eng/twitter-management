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
  };
};
