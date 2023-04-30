import { procedure } from "@/server/trpc";
import { z } from "zod";
import { twitter } from "@/constants";
import { auth } from "@/server/utils";
import axios from "axios";

const endPoint = "https://api.twitter.com/2/oauth2/token";
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Basic ${auth}`,
};

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

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: twitter.clientId,
      redirect_uri: twitter.redirectUri,
      code: input.code,
      code_verifier: session.codeVerifier,
    });

    try {
      const { data } = await axios.post(endPoint, params, { headers });

      session.accessToken = data.access_token;
      session.refreshToken = data.refresh_token;
      await session.save();

      return { success: true };
    } catch {
      return { success: false };
    }
  });
