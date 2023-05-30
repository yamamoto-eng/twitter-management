import { procedure } from "@/server/trpc";
import { z } from "zod";
import { tokenAuthorizationCode } from "@/server/services";
import { TwitterApiV2 } from "@/server/utils";
import { TWITTER_CONFIG } from "@/constants";
import { credentialsRepository } from "@/server/db";

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

      const { createCredentials, readCredentials, updateCredentials } = credentialsRepository();

      const credentials = await readCredentials({ id: data.id });

      if (!credentials) {
        await createCredentials({
          id: data.id,
          accessToken: access_token,
          refreshToken: refresh_token,
        });
      } else {
        await updateCredentials(credentials);
      }

      ctx.session.id = data.id;
      await ctx.session.save();

      return {
        success: true,
        name: data.name,
        userName: data.username,
        image: data.profile_image_url ?? TWITTER_CONFIG.DEFAULT_IMAGE,
      };
    } catch (e) {
      return { success: false };
    }
  });
