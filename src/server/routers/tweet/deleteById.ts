import { input, output } from "@/schema/tweet/deleteById";
import { procedure } from "../../trpc";
import { tweetRepository } from "@/server/db";
import dayjs from "dayjs";

export const deleteById = procedure
  .input(input)
  .output(output)
  .mutation(async ({ ctx, input }) => {
    const { deleteTweet } = tweetRepository();

    const tweetList = await deleteTweet({ id: ctx.session.id, ebId: input.ebId });
    const newTweetList = tweetList.map((tweet) => {
      return {
        ebId: tweet.ebId,
        text: tweet.text,
        isEnabled: tweet.isEnabled,
        fromDate: dayjs(tweet.fromDate).toDate(),
        toDate: dayjs(tweet.toDate).toDate(),
      };
    });

    return { tweetList: newTweetList };
  });
