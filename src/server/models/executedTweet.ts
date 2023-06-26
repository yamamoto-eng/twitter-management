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
 * @property {string} GSI2HASH - scheduledEbId
 * @property {string} GSI2RANGE - tweetedAt
 */
export type ExecutedTweetDB = Base & {
  tweetId: string;
  text: string;
  scheduledDeletionDate: string | null;
};
