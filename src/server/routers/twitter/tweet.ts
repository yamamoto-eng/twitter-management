import { procedure } from "@/server/trpc";
import { z } from "zod";
import axios from "axios";

export const tweet = procedure
  .input(
    z.object({
      text: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      await axios.post(
        "https://api.twitter.com/2/tweets",
        { text: input.text },
        {
          headers: {
            Authorization: `Bearer ${ctx.session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true };
    } catch {
      return { success: false };
    }
  });
