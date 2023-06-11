import { Tweet } from "@/schema/tweet";
import { trpc } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

export const useCacheOfTweetList = () => {
  const queryClient = useQueryClient();
  const tweetListKey = getQueryKey(trpc.tweet.list, undefined, "query");

  return {
    getTweet: (ebId: string) => {
      const data = queryClient.getQueryData<{ tweetList: Tweet[] }>(tweetListKey);
      const tweet = data?.tweetList.find((tweet) => tweet.ebId === ebId);
      return { tweet };
    },

    getTweetList: () => {
      const data = queryClient.getQueryData<{ tweetList: Tweet[] }>(tweetListKey);
      const tweetList = data?.tweetList ?? [];
      return { tweetList };
    },

    addTweet: (tweet: Tweet) => {
      queryClient.setQueryData<{ tweetList: Tweet[] }>(tweetListKey, (data) => {
        return {
          tweetList: [...(data?.tweetList ?? []), tweet],
        };
      });
    },

    updateTweet: (tweet: Tweet) => {
      queryClient.setQueryData<{ tweetList: Tweet[] }>(tweetListKey, (data) => {
        return {
          tweetList: (data?.tweetList ?? []).map((item) => (item.ebId === tweet.ebId ? tweet : item)),
        };
      });
    },

    removeTweet: (ebId: string) => {
      queryClient.setQueryData<{ tweetList: Tweet[] }>(tweetListKey, (data) => {
        return {
          tweetList: (data?.tweetList ?? []).filter((tweet) => tweet.ebId !== ebId),
        };
      });
    },
  };
};
