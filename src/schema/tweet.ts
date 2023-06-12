import { z } from "zod";
import { interval } from "./dateTime";

export const tweet = z.object({
  ebId: z.string(),
  text: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
  isEnabled: z.boolean(),
  interval: interval,
  createdAt: z.date(),
});

export type Tweet = z.infer<typeof tweet>;
