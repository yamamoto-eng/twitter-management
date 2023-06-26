
import { input, output } from "@/schema/executedTweet/byId";
import { procedure } from "../../trpc";
import { executedTweetRepository } from "@/server/db";
import dayjs from "dayjs";

export const byId = procedure.input(input).output(output).query(async ({ ctx, input }) => {
  const { findAllByScheduledEbId } = executedTweetRepository(ctx.session.id);
  const executedTweetList = await findAllByScheduledEbId(input.scheduledEbId);

  const newExecutedTweetList = executedTweetList.map((executedTweet) => {
    return {
      ...executedTweet,
      tweetedAt: dayjs(executedTweet.tweetedAt).toDate(),
      scheduledDeletionDate: executedTweet.scheduledDeletionDate
        ? dayjs(executedTweet.scheduledDeletionDate).toDate()
        : null,
    };
  });

  return { executedTweetList: newExecutedTweetList };
});
