import { z } from "zod";
import { tweet } from "../tweet";

export const output = z.object({
  tweetList: z.array(tweet),
});