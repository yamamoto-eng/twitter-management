import axios from "axios";
import { auth } from "@/server/utils";

type Props = {
  refreshToken: string;
};

export const tokenRefresh = async ({ refreshToken }: Props) => {
  try {
    const { data } = await axios.post(
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

    return {
      accessToken: data.access_token as string,
      refreshToken: data.refresh_token as string,
    };
  } catch (e) {
    throw e;
  }
};
