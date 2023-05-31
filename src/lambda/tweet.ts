import { twitterApiV2 } from "@/server/utils";
import { TweetLambdaEvent } from "@/types/lambdaEvent";

export const tweet = async ({ id, text }: TweetLambdaEvent) => {
  try {
    await twitterApiV2(id, (client) => client.tweets.createTweet({ text }));
  } catch (e) {
    throw e;
  }
};
