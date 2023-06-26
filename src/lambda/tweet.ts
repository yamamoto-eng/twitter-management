import { createRule, createTarget, updateRule } from "@/server/services/eventBridge";
import { twitterApiV2 } from "@/server/utils";
import { TweetLambdaEvent, DeleteTweetLambdaEvent } from "@/types/lambdaEvent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja";
import { executedTweetRepository, scheduledTweetRepository } from "@/server/db";
import { createRandomDateInRange } from "@/utils";
import { createNextDateForEventBridge } from "@/utils/createNextDateForEventBridge";
import { v4 } from "uuid";
import { getArn } from "@/server/services/lambda/getArn";
import { AWS_CONFIG } from "@/constants";

dayjs.extend(utc);
dayjs.locale("ja");

export const tweet = async (event: TweetLambdaEvent) => {
  const uuid = v4();
  const { findById, save } = scheduledTweetRepository(event.id);
  const { save: saveExecutedTweet } = executedTweetRepository(event.id);

  const scheduledTweet = await findById(event.ebId);

  // TODO: remove rule and target
  if (!scheduledTweet) {
    throw new Error("scheduledTweet not found");
  }

  const { fromDate, toDate } = createNextDateForEventBridge(
    dayjs(scheduledTweet.fromDate),
    dayjs(scheduledTweet.toDate),
    scheduledTweet.interval
  );
  const { date } = createRandomDateInRange(fromDate, toDate);

  const {
    data: { data },
  } = await twitterApiV2(event.id, (client) => client.tweets.createTweet({ text: scheduledTweet.text }));

  if (!data) {
    throw new Error("tweet error");
  }

  await updateRule({ ebId: event.ebId, date });
  await save({ ...scheduledTweet, fromDate: fromDate.toISOString(), toDate: toDate.toISOString() });

  let deletedDate = null;

  if (scheduledTweet.scheduledDeletionDay) {
    const deleteTweetLambdaEvent: DeleteTweetLambdaEvent = {
      ebId: uuid,
      id: event.id,
    };

    const { arn } = await getArn({ functionName: AWS_CONFIG.LAMBDA_FUNCTION_NAME.DELETE_TWEET });

    if (!arn) {
      throw new Error("arn not found");
    }

    const date = dayjs().add(scheduledTweet.scheduledDeletionDay, "d");
    deletedDate = date.toISOString();

    await createRule({ ebId: uuid, date, isEnabled: true });
    await createTarget({ ebId: uuid, arn, event: deleteTweetLambdaEvent });
  }

  await saveExecutedTweet({
    id: event.id,
    ebId: uuid,
    scheduledEbId: event.ebId,
    tweetId: data.id,
    text: data.text,
    scheduledDeletionDate: deletedDate,
  });
};
