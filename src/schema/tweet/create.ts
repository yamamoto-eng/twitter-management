import { z } from "zod";

export const input = z.object({
  text: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
});

export const output = z.object({
  date: z.date(),
});
