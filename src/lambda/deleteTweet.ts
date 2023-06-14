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
  const { readExecutedTweet, updateExecutedTweet } = executedTweetRepository(event.id);
  const executedTweet = await readExecutedTweet(event.ebId);

  await deleteTarget({ ebId: event.ebId });
  await deleteRule({ ebId: event.ebId });

  // TODO: handle error
  if (!executedTweet) {
    throw new Error("executedTweet not found");
  }

  if (executedTweet.scheduledDeletionDate) {
    const {
      data: { data },
    } = await twitterApiV2(event.id, (client) => client.tweets.deleteTweetById(executedTweet.tweetId));

    await updateExecutedTweet({ ebId: event.ebId, isTweetDeleted: data?.deleted });
  }
};
