import { procedure } from "../../trpc";
import { scheduledTweetRepository } from "@/server/db";
import { output } from "@/schema/scheduledTweet/list";
import dayjs from "dayjs";

export const list = procedure.output(output).query(async ({ ctx }) => {
  const { findAll } = scheduledTweetRepository(ctx.session.id);
  const scheduledTweetList = await findAll();

  const newScheduledTweetList = scheduledTweetList.map((scheduledTweet) => {
    return {
      ...scheduledTweet,
      fromDate: dayjs(scheduledTweet.fromDate).toDate(),
      toDate: dayjs(scheduledTweet.toDate).toDate(),
      createdAt: dayjs(scheduledTweet.createdAt).toDate(),
    };
  });

  return { scheduledTweetList: newScheduledTweetList };
});
