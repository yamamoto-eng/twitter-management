export type ExecutedTweet = {
  ebId: string;
  scheduledEbId: string;
  tweetId: string;
  text: string;
  tweetedAt: string;
  scheduledDeletionDate: string | null;
};
