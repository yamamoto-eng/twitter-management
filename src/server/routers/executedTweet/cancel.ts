import { input, output } from "@/schema/executedTweet/cancel";
import { procedure } from "../../trpc";
import { executedTweetRepository } from "@/server/db";
import dayjs from "dayjs";

export const cancel = procedure
  .input(input)
  .output(output)
  .mutation(async ({ ctx, input }) => {
    const { updateExecutedTweet } = executedTweetRepository(ctx.session.id);

    const executedTweet = await updateExecutedTweet({ ebId: input.ebId, scheduledDeletionDate: null });

    return {
      executedTweet: {
        ...executedTweet,
        tweetedAt: dayjs(executedTweet.tweetedAt).toDate(),
        scheduledDeletionDate: executedTweet.scheduledDeletionDate
          ? dayjs(executedTweet.scheduledDeletionDate).toDate()
          : null,
      },
    };
  });
