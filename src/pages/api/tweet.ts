import { withSessionApi } from "@/server/utils/withSession";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await axios
    .post(
      "https://api.twitter.com/2/tweets",
      { text: req.body.text },
      {
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res.send({ data: response.data });
    })
    .catch((e) => {
      throw e;
    });

  res.end();
};

export default withSessionApi(handler);
