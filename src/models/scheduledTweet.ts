import { Interval } from "@/schema/dateTime";

export type ScheduledTweet = {
  ebId: string;
  text: string;
  fromDate: string;
  toDate: string;
  isEnabled: boolean;
  interval: Interval;
  createdAt: string;
};
