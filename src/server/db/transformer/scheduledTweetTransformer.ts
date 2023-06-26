import { AWS_CONFIG } from "@/constants";
import { ScheduledTweetAPP, ScheduledTweetDB } from "@/server/models";

export const scheduledTweetTransformer = () => {
  return {
    toDB: (data: ScheduledTweetAPP): ScheduledTweetDB => ({
      HASH: data.ebId,
      GSI1HASH: `${AWS_CONFIG.LOGICAL_TABLES.SCHEDULED_TWEET}|${data.id}`,
      GSI1RANGE: data.createdAt,
      text: data.text,
      fromDate: data.fromDate,
      toDate: data.toDate,
      isEnabled: data.isEnabled,
      interval: data.interval,
      scheduledDeletionDay: data.scheduledDeletionDay,
    }),

    toAPP: (data: ScheduledTweetDB): ScheduledTweetAPP => ({
      id: data.GSI1HASH.split("|")[1],
      ebId: data.HASH,
      text: data.text,
      fromDate: data.fromDate,
      toDate: data.toDate,
      isEnabled: data.isEnabled,
      interval: data.interval,
      scheduledDeletionDay: data.scheduledDeletionDay,
      createdAt: data.GSI1RANGE,
    }),
  };
};
