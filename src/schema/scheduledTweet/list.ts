import { z } from "zod";
import { scheduledTweet } from "../scheduledTweet";

export const output = z.object({
  scheduledTweetList: z.array(scheduledTweet),
});

export type Output = z.infer<typeof output>;