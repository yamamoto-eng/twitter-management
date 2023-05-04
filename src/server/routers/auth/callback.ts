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
      const { accessToken, refreshToken } = await tokenAuthorizationCode({
        code: input.code,
        codeVerifier: session.codeVerifier,
      });

      session.accessToken = accessToken;
      session.refreshToken = refreshToken;
      await session.save();

      return { success: true };
    } catch (e) {
      return { success: false };
    }
  });
