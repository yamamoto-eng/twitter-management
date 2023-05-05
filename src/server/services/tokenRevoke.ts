import axios, { AxiosResponse } from "axios";
import { auth } from "@/server/utils";

type Props = {
  accessToken: string;
};

type Response = {
  revoked: boolean;
};

export const tokenRevoke = async ({ accessToken }: Props): Promise<AxiosResponse<Response>> => {
  return await axios.post(
    "https://api.twitter.com/2/oauth2/revoke",
    {
      token: accessToken,
      token_type_hint: "access_token",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    }
  );
};
