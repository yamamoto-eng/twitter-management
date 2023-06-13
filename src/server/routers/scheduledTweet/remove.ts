import { input, output } from "@/schema/scheduledTweet/remove";
import { procedure } from "../../trpc";
import { scheduledTweetRepository } from "@/server/db";
import dayjs from "dayjs";
import { deleteRule, deleteTarget } from "@/server/services/eventBridge";

export const remove = procedure
  .input(input)
  .output(output)
  .mutation(async ({ ctx, input }) => {
    const { deleteScheduledTweet } = scheduledTweetRepository(ctx.session.id);

    await deleteTarget({ ebId: input.ebId });
    await deleteRule({ ebId: input.ebId });

    const scheduledTweet = await deleteScheduledTweet(input.ebId);

    return {
      scheduledTweet: {
        ...scheduledTweet,
        fromDate: dayjs(scheduledTweet.fromDate).toDate(),
        toDate: dayjs(scheduledTweet.toDate).toDate(),
        createdAt: dayjs(scheduledTweet.createdAt).toDate(),
      },
    };
  });
