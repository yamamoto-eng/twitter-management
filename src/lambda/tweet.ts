import { updateRule } from "@/server/services/eventBridge";
import { twitterApiV2 } from "@/server/utils";
import { TweetLambdaEvent } from "@/types/lambdaEvent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja";
import { tweetRepository } from "@/server/db";
import { createRandomDateInRange } from "@/utils";
import { createNextDateForEventBridge } from "@/utils/createNextDateForEventBridge";

dayjs.extend(utc);
dayjs.locale("ja");

export const tweet = async (event: TweetLambdaEvent) => {
  const { readTweetById, updateTweet } = tweetRepository(event.id);

  const tweet = await readTweetById(event.ebId);

  const { fromDate, toDate } = createNextDateForEventBridge(dayjs(tweet.fromDate), dayjs(tweet.toDate), tweet.interval);
  const { date } = createRandomDateInRange(fromDate, toDate);

  await twitterApiV2(event.id, (client) => client.tweets.createTweet({ text: tweet.text }));
  await updateRule({ ebId: event.ebId, date });
  await updateTweet({ ...tweet, fromDate: fromDate.toISOString(), toDate: toDate.toISOString() });
};
