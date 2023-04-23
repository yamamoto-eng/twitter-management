import { twitter } from "@/constants";
import { auth } from "@/server/utils";
import { withSessionApi } from "@/server/utils/withSession";
import axios from "axios";
import { NextApiHandler } from "next";

const endPoint = "https://api.twitter.com/2/oauth2/token";
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Basic ${auth}`,
};

const handler: NextApiHandler = async (req, res) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: twitter.clientId,
    redirect_uri: twitter.redirectUri,
    code: req.session.code,
    code_verifier: req.session.codeVerifier,
  });

  await axios
    .post(endPoint, params, { headers })
    .then(async (response) => {
      req.session.accessToken = response.data.access_token;
      req.session.refreshToken = response.data.refresh_token;
      await req.session.save();
      res.send({ success: true });
    })
    .catch((e) => {
      throw e;
    });
};

export default withSessionApi(handler);
