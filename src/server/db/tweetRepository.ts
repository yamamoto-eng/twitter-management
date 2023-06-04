import { ddbDocClient } from "../../libs";
import { AWS_CONFIG } from "@/constants";
import { Credentials, Tweet } from "@/models";

export const tweetRepository = () => {
  const addTweet = ({ id, tweet }: { id: Credentials["id"]; tweet: Tweet }) => {
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
  };

  const readTweetList = async ({ id }: { id: Credentials["id"] }) => {
    try {
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

      return (res.Item.tweetList ?? []) as Tweet[];
    } catch (e) {
      throw e;
    }
  };

  const deleteTweet = async ({ id, ebId }: { id: Credentials["id"]; ebId: string }) => {
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

    const tweetList = res.Item.tweetList as Tweet[];
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
  };

  return {
    addTweet,
    readTweetList,
    deleteTweet,
  };
};
