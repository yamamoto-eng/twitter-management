export const AWS_CONFIG = {
  REGION: "ap-northeast-1",
  ACCESS_KEY_ID: process.env.APP_AWS_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY_ID: process.env.APP_AWS_SECRET_ACCESS_KEY,
  TABLE_NAME: "twitter-management",
  LAMBDA_FUNCTION_NAME: {
    TWEET: "twitter-management-tweet",
  },
} as const;
