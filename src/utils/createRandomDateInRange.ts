import dayjs from "dayjs";

export const createRandomDateInRange = (fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs) => {
  let diffMin = 0;

  if (fromDate.isAfter(toDate)) {
    diffMin = toDate.add(24, "h").diff(fromDate, "m");
  } else {
    diffMin = toDate.diff(fromDate, "m");
  }

  const addMin = Math.floor(Math.random() * (diffMin + 1));
  const addedDate = fromDate.add(addMin, "m");

  return { date: addedDate };
};
