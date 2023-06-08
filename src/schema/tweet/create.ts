import { z } from "zod";
import { tweet } from "../tweet";
import { dateInterval } from "../dateTime";

export const input = z.object({
  text: z.string(),
  fromTime: z.date(),
  toTime: z.date(),
  isEnabled: z.boolean(),
  dateInterval: dateInterval,
});

export const output = z.object({
  tweet,
});
