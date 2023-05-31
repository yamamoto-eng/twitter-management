import { Credentials } from "@/models";

export type TweetLambdaEvent = {
  id: Credentials["id"];
  text: string;
};