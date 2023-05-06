import { procedure } from "@/server/trpc";
import { z } from "zod";
import { tokenAuthorizationCode } from "@/server/services/tokenAuthorizationCode";
import { twitterApiV2 } from "@/server/services/twitterApiV2";
import { tokenRevoke } from "@/server/services/tokenRevoke";
import { twitter } from "@/constants";

export const callback = procedure
  .input(
    z.object({
      state: z.string(),
      code: z.string(),
    })
  )
  .output(
    z
      .object({
        success: z.literal(true),
        name: z.string(),
        userName: z.string(),
        image: z.string(),
      })
      .or(
        z.object({
          success: z.literal(false),
        })
      )
  )
  .mutation(async ({ ctx, input }) => {
    if (ctx.session.state !== input.state) {
      return { success: false };
    }

    try {
      const {
        data: { access_token, refresh_token },
      } = await tokenAuthorizationCode({
        code: input.code,
        codeVerifier: ctx.session.codeVerifier,
      });

      ctx.session.accessToken = access_token;
      ctx.session.refreshToken = refresh_token;
      await ctx.session.save();

      const userFields = new Set<"profile_image_url">(["profile_image_url"]);
      const { data } = await twitterApiV2(ctx, (client) => client.users.findMyUser(userFields));

      const { data: userData } = data;

      if (!userData) {
        await tokenRevoke({ accessToken: access_token });
        await ctx.session.destroy();
        return { success: false };
      }

      return {
        success: true,
        name: userData.name,
        userName: userData.username,
        image: userData.profile_image_url ?? twitter.defaultImage,
      };
    } catch (e) {
      return { success: false };
    }
  });
