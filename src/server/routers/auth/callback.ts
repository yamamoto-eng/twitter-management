import { procedure } from "@/server/trpc";
import { z } from "zod";
import { tokenAuthorizationCode } from "@/server/services/tokenAuthorizationCode";
import { TwitterApiV2 } from "@/server/services/twitterApiV2";
import { twitterConfig } from "@/constants";
import { credentialsRepository } from "@/server/db/credentialsRepository";

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
      const client = new TwitterApiV2(access_token);
      const {
        data: { data },
      } = await client.users.findMyUser(userFields);

      if (!data) {
        return { success: false };
      }

      ctx.session.id = data.id;
      await ctx.session.save();

      await credentialsRepository().createCredentials({
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
