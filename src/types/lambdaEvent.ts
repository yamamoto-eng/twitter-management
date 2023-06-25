export type TweetLambdaEvent = {
  id: string;
  ebId: string;
};

export type DeleteTweetLambdaEvent = {
  id: string;
  ebId: string;
};

export type LambdaEvent = TweetLambdaEvent | DeleteTweetLambdaEvent;
