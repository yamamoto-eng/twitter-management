import { z } from "zod";

export const tweet = z.object({
  ebId: z.string(),
  text: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
  isEnabled: z.boolean(),
});

export type Tweet = z.infer<typeof tweet>;