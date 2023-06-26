import { deleteRule, deleteTarget } from "@/server/services/eventBridge";
import { twitterApiV2 } from "@/server/utils";
import { DeleteTweetLambdaEvent } from "@/types/lambdaEvent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja";
import { executedTweetRepository } from "@/server/db";

dayjs.extend(utc);
dayjs.locale("ja");

export const deleteTweet = async (event: DeleteTweetLambdaEvent) => {
  const { findById, remove } = executedTweetRepository(event.id);
  const executedTweet = await findById(event.ebId);

  await deleteTarget({ ebId: event.ebId });
  await deleteRule({ ebId: event.ebId });

  // TODO: handle error
  if (!executedTweet) {
    throw new Error("executedTweet not found");
  }

  if (executedTweet.scheduledDeletionDate) {
    await twitterApiV2(event.id, (client) => client.tweets.deleteTweetById(executedTweet.tweetId)).then(async () => {
      await remove(event.ebId);
    });
  }
};
