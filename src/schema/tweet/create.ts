import { z } from "zod";

export const input = z.object({
  text: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
  isEnabled: z.boolean(),
});

export const output = z.object({
  date: z.date(),
});
