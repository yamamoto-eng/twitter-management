import { UsersApi, Configuration, TweetsApi } from "@/api-client/twitter-v2";
import { isAxiosError } from "axios";
import { tokenRefresh } from "../services";
import { credentialsRepository } from "../db";
import { Credentials } from "@/models";

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

export const twitterApiV2 = async <T>(id: Credentials["id"], api: (client: TwitterApiV2) => T): Promise<T> => {
  const { readCredentials } = credentialsRepository();
  const credentials = await readCredentials({ id });

  if (!credentials) {
    throw new Error("Credentials not found");
  }

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
