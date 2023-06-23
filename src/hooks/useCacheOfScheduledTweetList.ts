import { ScheduledTweet } from "@/schema/scheduledTweet";
import { Output } from "@/schema/scheduledTweet/list";
import { trpc } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

export const useCacheOfScheduledTweetList = () => {
  const queryClient = useQueryClient();
  const key = getQueryKey(trpc.scheduledTweet.list, undefined, "query");

  return {
    getScheduledTweet: (ebId: string) => {
      const data = queryClient.getQueryData<Output>(key);
      const scheduledTweet = data?.scheduledTweetList.find((scheduledTweet) => scheduledTweet.ebId === ebId);
      return { scheduledTweet };
    },

    getScheduledTweetList: () => {
      const data = queryClient.getQueryData<Output>(key);
      const scheduledTweetList = data?.scheduledTweetList ?? [];
      return { scheduledTweetList };
    },

    addScheduledTweet: (scheduledTweet: ScheduledTweet) => {
      queryClient.setQueryData<Output>(key, (data) => {
        const scheduledTweetList = data?.scheduledTweetList ?? [];
        return {
          scheduledTweetList: [...scheduledTweetList, scheduledTweet],
        };
      });
    },

    updateScheduledTweet: (scheduledTweet: ScheduledTweet) => {
      queryClient.setQueryData<Output>(key, (data) => {
        const scheduledTweetList = data?.scheduledTweetList ?? [];
        return {
          scheduledTweetList: scheduledTweetList.map((item) =>
            item.ebId === scheduledTweet.ebId ? scheduledTweet : item
          ),
        };
      });
    },

    removeScheduledTweet: (ebId: string) => {
      queryClient.setQueryData<Output>(key, (data) => {
        const scheduledTweetList = data?.scheduledTweetList ?? [];
        return {
          scheduledTweetList: scheduledTweetList.filter((scheduledTweet) => scheduledTweet.ebId !== ebId),
        };
      });
    },
  };
};
