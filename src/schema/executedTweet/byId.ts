import { z } from "zod";
import { executedTweet } from "../executedTweet";

export const input = z.object({
  scheduledEbId: z.string(),
})

export const output = z.object({
  executedTweetList: z.array(executedTweet),
});

export type Output = z.infer<typeof output>;
