import { withSessionApi } from "@/server/utils/withSession";
import axios from "axios";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
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
};

export default withSessionApi(handler);
