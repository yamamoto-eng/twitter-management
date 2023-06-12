import { ddbDocClient } from "../../libs";
import { AWS_CONFIG } from "@/constants";
import { Credentials, Tweet } from "@/models";
import dayjs from "dayjs";

export const tweetRepository = (id: Credentials["id"]) => {
  return {
    addTweet: async (tweet: Omit<Tweet, "createdAt">): Promise<Tweet> => {
      const nowDate = dayjs().toISOString();

      const item: Tweet = {
        ...tweet,
        createdAt: nowDate,
      };
      await ddbDocClient.update({
        TableName: AWS_CONFIG.TABLE_NAME,
        Key: {
          id,
        },
        UpdateExpression: "SET #tl = list_append(if_not_exists(#tl, :empty), :t)",
        ExpressionAttributeNames: {
          "#tl": "tweetList",
        },
        ExpressionAttributeValues: {
          ":t": [item],
          ":empty": [],
        },
      });

      return item;
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

    updateTweet: async (tweet: Omit<Tweet, "createdAt">): Promise<Tweet> => {
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

      let updatedTweet: Tweet | undefined = undefined;

      const tweetList = (res.Item.tweetList ?? []) as Tweet[];
      const newTweetList = tweetList.map((item) => {
        if (item.ebId === tweet.ebId) {
          const newTweet = { ...item, ...tweet };
          updatedTweet = newTweet;
          return newTweet;
        }
        return item;
      });

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
          ":t": newTweetList,
        },
      });

      if (!updatedTweet) {
        throw new Error("tweet not found");
      }

      return updatedTweet as Tweet;
    },

    deleteTweet: async (ebId: string): Promise<Tweet> => {
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
      let deletedTweet: Tweet | undefined = undefined;

      const newList = tweetList.filter((tweet) => {
        if (tweet.ebId === ebId) {
          deletedTweet = tweet;
          return false;
        }
        return true;
      });

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

      if (!deletedTweet) {
        throw new Error("tweet not found");
      }

      return deletedTweet as Tweet;
    },
  };
};
