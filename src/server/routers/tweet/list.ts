import { procedure } from "../../trpc";
import { tweetRepository } from "@/server/db";
import { output } from "@/schema/tweet/list";
import dayjs from "dayjs";

export const list = procedure.output(output).query(async ({ ctx }) => {
  const { readTweetList } = tweetRepository(ctx.session.id);
  const tweetList = await readTweetList();

  if (!tweetList) {
    throw new Error("tweetList not found");
  }

  const newList = tweetList.map((tweet) => {
    return {
      ...tweet,
      fromDate: dayjs(tweet.fromDate).toDate(),
      toDate: dayjs(tweet.toDate).toDate(),
      createdAt: dayjs(tweet.createdAt).toDate(),
    };
  });

  return { tweetList: newList };
});
