import { z } from "zod";
import { executedTweet } from "../executedTweet";

export const input = z.object({
  ebId: z.string(),
});

export const output = z.object({
  executedTweet,
});
