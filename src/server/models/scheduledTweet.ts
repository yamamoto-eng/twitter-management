import { Day, Interval } from "@/schema/dateTime";
import { Base } from "./base";

export type ScheduledTweetAPP = {
  id: string;
  ebId: string;
  text: string;
  fromDate: string;
  toDate: string;
  isEnabled: boolean;
  interval: Interval;
  createdAt: string;
  scheduledDeletionDay: Day | null;
};

/**
 * @property {string} HASH - ebId
 * @property {string} GSI1HASH - `SCHEDULED_TWEET|${id}`
 * @property {string} GSI1RANGE - createdAt
 */
export type ScheduledTweetDB = Base & {
  text: string;
  fromDate: string;
  toDate: string;
  isEnabled: boolean;
  interval: Interval;
  scheduledDeletionDay: Day | null;
};
