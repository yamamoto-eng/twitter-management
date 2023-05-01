import { procedure } from "../../trpc";
import { generators } from "openid-client";
import { twitter } from "@/constants";

const endPoint = "https://twitter.com/i/oauth2/authorize";

export const login = procedure.mutation(async ({ ctx }) => {
  const state = generators.state();
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    // client_id: twitter.clientId,
    client_id: process.env.CLIENT_ID,
    redirect_uri: twitter.redirectUri,
    scope: "tweet.read users.read tweet.write offline.access",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "s256",
  });

  const redirectUrl = `${endPoint}?${params}`;

  ctx.session.state = state;
  ctx.session.codeVerifier = codeVerifier;
  await ctx.session.save();

  return { redirectUrl };
});
