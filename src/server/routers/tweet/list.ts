import { procedure } from "../../trpc";
import { tweetRepository } from "@/server/db";
import { output } from "@/schema/tweet/list";
import dayjs from "dayjs";

export const list = procedure.output(output).query(async ({ ctx, input }) => {
  const { readTweetList } = tweetRepository();
  const tweetList = await readTweetList({ id: ctx.session.id });

  if (!tweetList) {
    throw new Error("tweetList not found");
  }

  const newList = tweetList.map((tweet) => {
    return {
      id: tweet.id,
      text: tweet.text,
      isEnabled: tweet.isEnabled,
      fromDate: dayjs(tweet.fromDate).toDate(),
      toDate: dayjs(tweet.toDate).toDate(),
    };
  });

  return { tweetList: newList };
});
