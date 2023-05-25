import { UsersApi, Configuration, TweetsApi } from "@/api-client/twitter-v2";
import { Context } from "@/server/context";
import { isAxiosError } from "axios";
import { tokenRefresh } from "./tokenRefresh";

class TwitterApiV2 {
  private readonly config;

  constructor(ctx: Context) {
    this.config = new Configuration({
      accessToken: ctx.session.accessToken,
    });
  }

  get users() {
    return new UsersApi(this.config);
  }

  get tweets() {
    return new TweetsApi(this.config);
  }
}

export const twitterApiV2 = async <T>(ctx: Context, api: (client: TwitterApiV2) => T): Promise<T> => {
  const client = new TwitterApiV2(ctx);

  try {
    return await api(client);
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response?.status === 401 && e.response?.statusText === "Unauthorized") {
        const { data } = await tokenRefresh({ refreshToken: ctx.session.refreshToken });
        ctx.session.accessToken = data.access_token;
        ctx.session.refreshToken = data.refresh_token;
        await ctx.session.save();

        const client = new TwitterApiV2(ctx);
        return await api(client);
      }
    }

    throw e;
  }
};

class TwitterApiV2WithToken {
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

export const twitterApiV2WithToken = async <T>(
  accessToken: string,
  api: (client: TwitterApiV2WithToken) => T
): Promise<T> => {
  const client = new TwitterApiV2WithToken(accessToken);

  return await api(client);
};
