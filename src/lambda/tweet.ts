import { updateRule } from "@/server/services/eventBridge";
import { twitterApiV2 } from "@/server/utils";
import { TweetLambdaEvent } from "@/types/lambdaEvent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja";
import { tweetRepository } from "@/server/db";
import { createRandomDateInRange } from "@/utils";

dayjs.extend(utc);
dayjs.locale("ja");

export const tweet = async (event: TweetLambdaEvent) => {
  const { readTweetById } = tweetRepository(event.id);

  const tweet = await readTweetById(event.ebId);

  await twitterApiV2(event.id, (client) => client.tweets.createTweet({ text: tweet.text }));

  const { date } = createRandomDateInRange(dayjs(tweet.fromDate), dayjs(tweet.toDate));

  await updateRule({ ebId: event.ebId, date });
};
