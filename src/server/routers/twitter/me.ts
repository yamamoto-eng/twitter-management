import { procedure } from "@/server/trpc";
import axios from "axios";
import { z } from "zod";

export const me = procedure
  .output(z.union([z.object({ name: z.string(), userName: z.string(), image: z.string() }), z.object({})]))
  .query(async ({ ctx }) => {
    try {
      const { data } = await axios.get("https://api.twitter.com/2/users/me", {
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          "user.fields": "profile_image_url",
        },
      });

      return {
        name: data.data.name as string,
        userName: data.data.username as string,
        image: data.data.profile_image_url as string,
      };
    } catch {
      return {};
    }
  });
