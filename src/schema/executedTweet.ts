import { z } from "zod";

export const executedTweet = z.object({
  ebId: z.string(),
  scheduledEbId: z.string(),
  tweetId: z.string(),
  text: z.string(),
  tweetedAt: z.date(),
  scheduledDeletionDate: z.date().nullable(),
});

export type ExecutedTweet = z.infer<typeof executedTweet>;
