import { procedure } from "../../trpc";
import { scheduledTweetRepository } from "@/server/db";
import dayjs from "dayjs";
import { input, output } from "@/schema/scheduledTweet/byId";

export const byId = procedure
  .input(input)
  .output(output)
  .query(async ({ ctx, input }) => {
    const { findById } = scheduledTweetRepository(ctx.session.id);
    const scheduledTweet = await findById(input.ebId);

    if (!scheduledTweet) {
      throw new Error("Failed to find scheduled tweet");
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
