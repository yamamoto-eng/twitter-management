import { twitterApiV2 } from "@/server/services/twitterApiV2";
import { procedure } from "@/server/trpc";
import { z } from "zod";

export const me = procedure
  .output(z.union([z.object({ name: z.string(), userName: z.string(), image: z.string() }), z.object({})]))
  .query(async ({ ctx }) => {
    const userFields = new Set<"profile_image_url">(["profile_image_url"]);

    try {
      const { data } = await twitterApiV2(ctx).users.findMyUser(userFields);

      return {
        name: data.data?.name,
        userName: data.data?.username,
        image: data.data?.profile_image_url,
      };
    } catch (e) {}
  });
