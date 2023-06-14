export const AWS_CONFIG = {
  REGION: "ap-northeast-1",
  ACCESS_KEY_ID: process.env.APP_AWS_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY_ID: process.env.APP_AWS_SECRET_ACCESS_KEY,
  TABLE_NAME: "twitter-management",
  TABLE_ITEMS: {
    SCHEDULED_TWEET_LIST: "scheduledTweetList",
    SCHEDULED_RETWEET_LIST: "scheduledRetweetList",
    SCHEDULED_LIKE_LIST: "scheduledLikeList",
    EXECUTED_TWEET_LIST: "executedTweetList",
    EXECUTED_RETWEET_LIST: "executedRetweetList",
    EXECUTED_LIKE_LIST: "executedLikeList",
  },
  LAMBDA_FUNCTION_NAME: {
    TWEET: "twitter-management-tweet",
    DELETE_TWEET: "twitter-management-deleteTweet",
  },
} as const;
