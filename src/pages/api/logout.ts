import { NextApiHandler } from "next";

import { withSessionApi } from "@/server/utils/withSession";
import axios from "axios";
import { auth } from "@/server/utils";

const endPoint = "https://api.twitter.com/2/oauth2/revoke";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Basic ${auth}`,
};

const handler: NextApiHandler = async (req, res) => {
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
};

export default withSessionApi(handler);
