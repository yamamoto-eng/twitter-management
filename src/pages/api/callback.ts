import { withSessionApi } from "@/server/utils/withSession";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const buf = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
const base64Auth = buf.toString("base64");

const endPoint = "https://api.twitter.com/2/oauth2/token";
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Basic ${base64Auth}`,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", "http://localhost:3000/callback");
  params.append("code_verifier", req.session.codeVerifier);
  params.append("client_id", process.env.CLIENT_ID ?? "");
  params.append("code", req.session.code);

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

  res.end();
};

export default withSessionApi(handler);
