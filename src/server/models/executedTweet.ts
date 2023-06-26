import { Base } from "./base";

export type ExecutedTweetAPP = {
  id: string;
  ebId: string;
  scheduledEbId: string;
  tweetId: string;
  text: string;
  tweetedAt: string;
  scheduledDeletionDate: string | null;
};

/**
 * @property {string} HASH - ebId
 * @property {string} GSI1HASH - `EXECUTED_TWEET|${id}`
 * @property {string} GSI1RANGE - tweetedAt
 */
export type ExecutedTweetDB = Base & {
  scheduledEbId: string;
  tweetId: string;
  text: string;
  scheduledDeletionDate: string | null;
};
