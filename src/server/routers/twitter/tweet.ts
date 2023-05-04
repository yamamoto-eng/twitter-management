import { procedure } from "@/server/trpc";
import { z } from "zod";
import { twitterApiV2 } from "@/server/services/twitterApiV2";

export const tweet = procedure
  .input(
    z.object({
      text: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      await twitterApiV2(ctx).tweets.createTweet({ text: input.text });

      return { success: true };
    } catch {
      return { success: false };
    }
  });
