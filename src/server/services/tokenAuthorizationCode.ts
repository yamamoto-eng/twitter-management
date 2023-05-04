import { twitter } from "@/constants";
import { auth } from "@/server/utils";
import axios from "axios";

type Props = {
  code: string;
  codeVerifier: string;
};

export const tokenAuthorizationCode = async ({ code, codeVerifier }: Props) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: twitter.clientId,
    redirect_uri: twitter.redirectUri,
    code: code,
    code_verifier: codeVerifier,
  });

  try {
    const { data } = await axios.post("https://api.twitter.com/2/oauth2/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    });

    return {
      accessToken: data.access_token as string,
      refreshToken: data.refresh_token as string,
    };
  } catch (e) {
    throw e;
  }
};
