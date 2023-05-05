import axios, { AxiosResponse } from "axios";
import { auth } from "@/server/utils";

type Props = {
  refreshToken: string;
};

type Response = {
  token_type: unknown;
  expires_in: unknown;
  access_token: string;
  scope: string;
  refresh_token: string;
};

export const tokenRefresh = async ({ refreshToken }: Props): Promise<AxiosResponse<Response>> => {
  return await axios.post(
    "https://api.twitter.com/2/oauth2/token",
    {
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};
