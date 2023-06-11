import { z } from "zod";
import { tweet } from "../tweet";

export const input = z.object({
  ebId: z.string(),
});

export const output = z.object({
  tweet: tweet,
});
