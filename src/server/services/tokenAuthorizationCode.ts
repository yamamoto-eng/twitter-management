import { twitterConfig } from "@/constants";
import { auth } from "@/server/utils";
import axios, { AxiosResponse } from "axios";

type Props = {
  code: string;
  codeVerifier: string;
};

type Response = {
  token_type: unknown;
  expires_in: unknown;
  access_token: string;
  scope: string;
  refresh_token: string;
};

export const tokenAuthorizationCode = async ({ code, codeVerifier }: Props): Promise<AxiosResponse<Response>> => {
  return await axios.post(
    "https://api.twitter.com/2/oauth2/token",
    {
      grant_type: "authorization_code",
      client_id: twitterConfig.clientId,
      redirect_uri: twitterConfig.redirectUri,
      code: code,
      code_verifier: codeVerifier,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    }
  );
};
