import { Credentials } from "@/models";

export type TweetLambdaEvent = {
  id: Credentials["id"];
  ebId: string;
};

export type DeleteTweetLambdaEvent = {
  id: Credentials["id"];
  ebId: string;
};

export type LambdaEvent = TweetLambdaEvent | DeleteTweetLambdaEvent;
