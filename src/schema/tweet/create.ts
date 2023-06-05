import { z } from "zod";
import { tweet } from "../tweet";

export const input = z.object({
  text: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
  isEnabled: z.boolean(),
});

export const output = z.object({
  tweet,
});
