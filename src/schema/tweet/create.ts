import { z } from "zod";
import { dayOfWeek } from "../dateTime";

export const input = z.object({
  text: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
  dayOfWeek: dayOfWeek,
});

export const output = z.object({
  date: z.date(),
});
