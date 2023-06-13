import { z } from "zod";
import { scheduledTweet } from "../scheduledTweet";
import { day, interval } from "../dateTime";

export const input = z.object({
  ebId: z.string(),
  text: z.string(),
  fromTime: z.date(),
  toTime: z.date(),
  isEnabled: z.boolean(),
  interval: interval,
  scheduledDeletionDay: day.nullable(),
});

export const output = z.object({
  scheduledTweet,
});
