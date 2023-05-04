import { UsersApi, Configuration, TweetsApi } from "@/api-client/twitter-v2";
import { Context } from "@/server/context";

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

export const twitterApiV2 = (ctx: Context) => {
  return new TwitterApiV2(ctx);
};
