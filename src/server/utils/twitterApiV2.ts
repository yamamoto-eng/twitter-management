import { UsersApi, Configuration, TweetsApi } from "@/api-client/twitter-v2";
import { isAxiosError } from "axios";
import { tokenRefresh } from "../services";
import { credentialRepository } from "../db";

export class TwitterApiV2 {
  private readonly config;

  constructor(accessToken: string) {
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

export const twitterApiV2 = async <T>(id: string, api: (client: TwitterApiV2) => T): Promise<T> => {
  const { find, save } = credentialRepository(id);

  const credential = await find();

  if (!credential) {
    throw new Error("Credential not found");
  }

  const client = new TwitterApiV2(credential.accessToken);

  try {
    return await api(client);
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response?.status === 401 && e.response?.statusText === "Unauthorized") {
        const {
          data: { access_token, refresh_token },
        } = await tokenRefresh({ refreshToken: credential.refreshToken });

        await save({ accessToken: access_token, refreshToken: refresh_token });

        const client = new TwitterApiV2(access_token);
        return await api(client);
      }
    }

    throw e;
  }
};
