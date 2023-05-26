import { UsersApi, Configuration, TweetsApi } from "@/api-client/twitter-v2";
import { isAxiosError } from "axios";
import { tokenRefresh } from "../services/tokenRefresh";
import { credentialsRepository } from "../db/credentialsRepository";

export class TwitterApiV2 {
  private readonly config;

  constructor(accessToken: Credentials["accessToken"]) {
    this.config = new Configuration({
      accessToken,
    });
  }

  get users() {
    return new UsersApi(this.config);
  }

  get tweets() {
    return new TweetsApi(this.config);
  }
}

export const twitterApiV2 = async <T>(
  credentials: Pick<Credentials, "id" | "accessToken" | "refreshToken">,
  api: (client: TwitterApiV2) => T
): Promise<T> => {
  const client = new TwitterApiV2(credentials.accessToken);

  try {
    return await api(client);
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response?.status === 401 && e.response?.statusText === "Unauthorized") {
        const {
          data: { access_token, refresh_token },
        } = await tokenRefresh({ refreshToken: credentials.refreshToken });

        await credentialsRepository().updateCredentials({
          id: credentials.id,
          accessToken: access_token,
          refreshToken: refresh_token,
        });

        const client = new TwitterApiV2(access_token);
        return await api(client);
      }
    }

    throw e;
  }
};
