import { z } from "zod";

export const output = z.object({
  tweetList: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      fromDate: z.date(),
      toDate: z.date(),
      isEnabled: z.boolean(),
    })
  ),
});
