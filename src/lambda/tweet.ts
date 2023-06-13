import { updateRule } from "@/server/services/eventBridge";
import { twitterApiV2 } from "@/server/utils";
import { TweetLambdaEvent } from "@/types/lambdaEvent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja";
import { scheduledTweetRepository } from "@/server/db";
import { createRandomDateInRange } from "@/utils";
import { createNextDateForEventBridge } from "@/utils/createNextDateForEventBridge";

dayjs.extend(utc);
dayjs.locale("ja");

export const scheduledTweet = async (event: TweetLambdaEvent) => {
  const { readScheduledTweet, updateScheduledTweet } = scheduledTweetRepository(event.id);

  const scheduledTweet = await readScheduledTweet(event.ebId);

  const { fromDate, toDate } = createNextDateForEventBridge(
    dayjs(scheduledTweet.fromDate),
    dayjs(scheduledTweet.toDate),
    scheduledTweet.interval
  );
  const { date } = createRandomDateInRange(fromDate, toDate);

  await twitterApiV2(event.id, (client) => client.tweets.createTweet({ text: scheduledTweet.text }));
  await updateRule({ ebId: event.ebId, date });
  await updateScheduledTweet({ ...scheduledTweet, fromDate: fromDate.toISOString(), toDate: toDate.toISOString() });
};
