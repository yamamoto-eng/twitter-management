import type { NextApiRequest, NextApiResponse } from "next";
import { generators } from "openid-client";
import { withSessionApi } from "@/server/utils/withSession";

const endPoint = "https://twitter.com/i/oauth2/authorize";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const state = generators.state();
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.CLIENT_ID ?? "",
    redirect_uri: "http://localhost:3000/callback",
    scope: "tweet.read users.read tweet.write offline.access",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "s256",
  });

  const authorize = {
    state,
    codeVerifier,
    referer: req.headers.referer ?? "",
  };

  req.session.authorize = authorize;
  await req.session.save();

  res.redirect(`${endPoint}?${params}`);
};

export default withSessionApi(handler);
