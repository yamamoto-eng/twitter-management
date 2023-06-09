import { Interval } from "@/schema/dateTime";
import dayjs from "dayjs";

export const createNextDateForTime = (fromTime: dayjs.Dayjs, toTime: dayjs.Dayjs, interval: Interval) => {
  const now = dayjs();
  const fromHour = fromTime.hour();
  const fromMinute = fromTime.minute();
  const toHour = toTime.hour();
  const toMinute = toTime.minute();

  let fromDate = now;
  let toDate = now;

  if (interval.type === "day") {
    fromDate = now.hour(fromHour).minute(fromMinute).add(interval.day, "d");
    toDate = now.hour(toHour).minute(toMinute).add(interval.day, "d");

    if (fromDate.isAfter(toDate)) {
      toDate = toDate.add(1, "d");
    }
  }

  if (interval.type === "dayOfWeek") {
    fromDate = now.hour(fromHour).minute(fromMinute).day(interval.dayOfWeek);
    toDate = now.hour(toHour).minute(toMinute).day(interval.dayOfWeek);

    if (fromDate.isAfter(toDate)) {
      toDate = toDate.add(1, "d");
    }

    if (fromDate.isBefore(now.add(1, "m"))) {
      fromDate = fromDate.add(7, "d");
      toDate = toDate.add(7, "d");
    }
  }

  return { fromDate, toDate };
};
