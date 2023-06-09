import { Interval } from "@/schema/dateTime";
import dayjs from "dayjs";

export const createNextDateForEventBridge = (fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs, interval: Interval) => {
  let newFromDate = fromDate;
  let newToDate = toDate;

  if (interval.type === "day") {
    newFromDate = newFromDate.add(interval.day, "d");
    newToDate = newToDate.add(interval.day, "d");
  }

  if (interval.type === "dayOfWeek") {
    newFromDate = newFromDate.add(7, "d");
    newToDate = newToDate.add(7, "d");
  }

  return { fromDate: newFromDate, toDate: newToDate };
};
