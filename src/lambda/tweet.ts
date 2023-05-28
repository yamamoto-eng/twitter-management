import { twitterApiV2 } from "@/server/utils";

type Event = {
  credentials: Credentials;
  text: string;
};

export const tweet = async (event: Event) => {
  try {
    await twitterApiV2(event.credentials, (client) => client.tweets.createTweet({ text: event.text }));
  } catch (e) {
    throw e;
  }
};
