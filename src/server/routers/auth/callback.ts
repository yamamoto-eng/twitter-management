import { procedure } from "@/server/trpc";
import { z } from "zod";
import { tokenAuthorizationCode } from "@/server/services/tokenAuthorizationCode";

export const callback = procedure
  .input(
    z.object({
      state: z.string(),
      code: z.string(),
    })
  )
  .output(z.object({ success: z.boolean() }))
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (session.state !== input.state) {
      return { success: false };
    }

    try {
      const { data } = await tokenAuthorizationCode({
        code: input.code,
        codeVerifier: session.codeVerifier,
      });

      session.accessToken = data.access_token;
      session.refreshToken = data.refresh_token;
      await session.save();

      return { success: true };
    } catch (e) {
      return { success: false };
    }
  });
