import { z } from "zod";
import { interval } from "./dateTime";

export const scheduledTweet = z.object({
  ebId: z.string(),
  text: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
  isEnabled: z.boolean(),
  interval: interval,
  createdAt: z.date(),
});

export type ScheduledTweet = z.infer<typeof scheduledTweet>;
