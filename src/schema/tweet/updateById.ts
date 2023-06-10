import { z } from "zod";
import { tweet } from "../tweet";
import { interval } from "../dateTime";

export const input = z.object({
  ebId: z.string(),
  text: z.string(),
  fromTime: z.date(),
  toTime: z.date(),
  isEnabled: z.boolean(),
  interval: interval,
});

export const output = z.object({
  tweet: tweet,
});
