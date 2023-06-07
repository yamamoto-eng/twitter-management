import { ddbDocClient } from "../../libs";
import { AWS_CONFIG } from "@/constants";
import { Credentials, Tweet } from "@/models";

export const tweetRepository = (id: Credentials["id"]) => {
  return {
    addTweet: (tweet: Tweet) => {
      return ddbDocClient.update({
        TableName: AWS_CONFIG.TABLE_NAME,
        Key: {
          id,
        },
        UpdateExpression: "SET #tl = list_append(if_not_exists(#tl, :empty), :t)",
        ExpressionAttributeNames: {
          "#tl": "tweetList",
        },
        ExpressionAttributeValues: {
          ":t": [tweet],
          ":empty": [],
        },
      });
    },

    readTweetById: async (ebId: string): Promise<Tweet> => {
      const res = await ddbDocClient.get({
        TableName: AWS_CONFIG.TABLE_NAME,
        Key: {
          id,
        },
        ProjectionExpression: "tweetList",
      });

      if (!res.Item) {
        throw new Error("tweetList not found");
      }

      const tweetList: Tweet[] = res.Item.tweetList ?? [];
      const tweet = tweetList.find((tweet) => tweet.ebId === ebId);

      if (!tweet) {
        throw new Error("tweet not found");
      }

      return tweet;
    },

    readTweetList: async (): Promise<Tweet[]> => {
      const res = await ddbDocClient.get({
        TableName: AWS_CONFIG.TABLE_NAME,
        Key: {
          id,
        },
        ProjectionExpression: "tweetList",
      });

      if (!res.Item) {
        throw new Error("tweetList not found");
      }

      return res.Item.tweetList ?? [];
    },

    deleteTweet: async (ebId: string): Promise<Tweet[]> => {
      const res = await ddbDocClient.get({
        TableName: AWS_CONFIG.TABLE_NAME,
        Key: {
          id,
        },
        ProjectionExpression: "tweetList",
      });

      if (!res.Item) {
        throw new Error("tweetList not found");
      }

      const tweetList = (res.Item.tweetList ?? []) as Tweet[];
      const newList = tweetList.filter((tweet) => tweet.ebId !== ebId);

      await ddbDocClient.update({
        TableName: AWS_CONFIG.TABLE_NAME,
        Key: {
          id,
        },
        UpdateExpression: "SET #tl = :t",
        ExpressionAttributeNames: {
          "#tl": "tweetList",
        },
        ExpressionAttributeValues: {
          ":t": newList,
        },
      });

      return newList;
    },
  };
};
