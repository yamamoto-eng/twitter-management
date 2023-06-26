import { AWS_CONFIG } from "@/constants";
import { ExecutedTweetAPP, ExecutedTweetDB } from "@/server/models";

export const executedTweetTransformer = () => {
  return {
    toDB: (data: ExecutedTweetAPP): ExecutedTweetDB => ({
      HASH: data.ebId,
      GSI1HASH: `${AWS_CONFIG.LOGICAL_TABLES.EXECUTED_TWEET}|${data.id}`,
      GSI1RANGE: data.tweetedAt,
      GSI2HASH: data.scheduledEbId,
      GSI2RANGE: data.tweetedAt,
      text: data.text,
      tweetId: data.tweetId,
      scheduledDeletionDate: data.scheduledDeletionDate,
    }),

    toAPP: (data: ExecutedTweetDB): ExecutedTweetAPP => ({
      id: data.GSI1HASH.split("|")[1],
      ebId: data.HASH,
      text: data.text,
      tweetedAt: data.GSI1RANGE,
      tweetId: data.tweetId,
      scheduledDeletionDate: data.scheduledDeletionDate,
      scheduledEbId: data.GSI2HASH,
    }),
  };
};
