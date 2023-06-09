import { Interval } from "@/schema/dateTime";

export type Tweet = {
  ebId: string;
  text: string;
  fromDate: string;
  toDate: string;
  isEnabled: boolean;
  interval: Interval;
};
