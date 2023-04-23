import { NextApiHandler } from "next";
import { generators } from "openid-client";
import { withSessionApi } from "@/server/utils/withSession";
import { twitter } from "@/constants";

const endPoint = "https://twitter.com/i/oauth2/authorize";

const handler: NextApiHandler = async (req, res) => {
  const state = generators.state();
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: twitter.clientId,
    redirect_uri: twitter.redirectUri,
    scope: "tweet.read users.read tweet.write offline.access",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "s256",
  });

  req.session.state = state;
  req.session.codeVerifier = codeVerifier;
  await req.session.save();

  res.redirect(`${endPoint}?${params}`);
};

export default withSessionApi(handler);