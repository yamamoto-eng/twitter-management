import { procedure } from "../../trpc";
import { generators } from "openid-client";
import { authorize } from "@/server/services/authorize";

export const login = procedure.mutation(async ({ ctx }) => {
  const state = generators.state();
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const { authorizeURL } = authorize({ state, codeChallenge });

  ctx.session.state = state;
  ctx.session.codeVerifier = codeVerifier;
  await ctx.session.save();

  return { authorizeURL };
});
