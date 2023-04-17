import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApi } from "@/server/utils/withSession";
import axios from "axios";

const buf = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
const base64Auth = buf.toString("base64");

const endPoint = "https://api.twitter.com/2/oauth2/revoke";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Basic ${base64Auth}`,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await axios
    .post(
      endPoint,
      {
        token: req.session.accessToken,
        token_type_hint: "access_token",
      },
      { headers }
    )
    .then(async (response) => {
      await req.session.destroy();
      res.send({ success: true });
    })
    .catch((e) => {
      throw e;
    });

  res.end();
};

export default withSessionApi(handler);
