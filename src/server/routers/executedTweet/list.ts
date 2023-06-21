import { output } from "@/schema/executedTweet/list";
import { procedure } from "../../trpc";
import { executedTweetRepository } from "@/server/db";
import dayjs from "dayjs";

export const list = procedure.output(output).query(async ({ ctx }) => {
  const { readExecutedTweetList } = executedTweetRepository(ctx.session.id);
  const executedTweetList = await readExecutedTweetList();

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
