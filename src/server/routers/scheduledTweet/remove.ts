import { input, output } from "@/schema/scheduledTweet/remove";
import { procedure } from "../../trpc";
import { scheduledTweetRepository } from "@/server/db";
import dayjs from "dayjs";
import { deleteRule, deleteTarget } from "@/server/services/eventBridge";

export const remove = procedure
  .input(input)
  .output(output)
  .mutation(async ({ ctx, input }) => {
    const { remove } = scheduledTweetRepository(ctx.session.id);

    await deleteTarget({ ebId: input.ebId });
    await deleteRule({ ebId: input.ebId });

    const scheduledTweet = await remove(input.ebId);

    if (!scheduledTweet) {
      throw new Error("Failed to remove scheduled tweet");
    }

    return {
      scheduledTweet: {
        ...scheduledTweet,
        fromDate: dayjs(scheduledTweet.fromDate).toDate(),
        toDate: dayjs(scheduledTweet.toDate).toDate(),
        createdAt: dayjs(scheduledTweet.createdAt).toDate(),
      },
    };
  });
