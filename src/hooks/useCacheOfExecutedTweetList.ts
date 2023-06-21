import { Output } from "@/schema/executedTweet/list";
import { trpc } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

export const useCacheOfExecutedTweetList = () => {
  const queryClient = useQueryClient();
  const key = getQueryKey(trpc.executedTweet.list, undefined, "query");

  return {
    getExecutedTweetList: () => {
      const data = queryClient.getQueryData<Output>(key);
      const executedTweetList = data?.executedTweetList ?? [];
      return { executedTweetList };
    },
  };
};
