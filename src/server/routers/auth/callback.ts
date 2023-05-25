import { procedure } from "@/server/trpc";
import { z } from "zod";
import { tokenAuthorizationCode } from "@/server/services/tokenAuthorizationCode";
import { twitterApiV2WithToken } from "@/server/services/twitterApiV2";
import { twitterConfig } from "@/constants";
import { userAuthRepository } from "@/server/db/userAuthRepository";

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

      const userFields = new Set<"profile_image_url">(["profile_image_url"]);
      const {
        data: { data },
      } = await twitterApiV2WithToken(access_token, (client) => client.users.findMyUser(userFields));

      if (!data) {
        return { success: false };
      }

      ctx.session.accessToken = access_token;
      ctx.session.refreshToken = refresh_token;
      ctx.session.id = data.id;
      await ctx.session.save();

      await userAuthRepository().createUserAuth({
        id: data.id,
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      return {
        success: true,
        name: data.name,
        userName: data.username,
        image: data.profile_image_url ?? twitterConfig.defaultImage,
      };
    } catch (e) {
      return { success: false };
    }
  });
