import { z } from "zod";
import { scheduledTweet } from "../scheduledTweet";

export const input = z.object({
  ebId: z.string(),
});

export const output = z.object({
  scheduledTweet,
});

export type Output = z.infer<typeof output>;
