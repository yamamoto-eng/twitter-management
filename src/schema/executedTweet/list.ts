import { z } from "zod";
import { executedTweet } from "../executedTweet";

export const output = z.object({
  executedTweetList: z.array(executedTweet),
});

export type Output = z.infer<typeof output>;
