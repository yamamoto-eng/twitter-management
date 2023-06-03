import dayjs from "dayjs";

export const createRandomDateInRange = (fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs) => {
  const diffMin = toDate.diff(fromDate, "m");
  const addMin = Math.floor(Math.random() * (diffMin + 1));
  const addedDate = fromDate.add(addMin, "m");

  return { date: addedDate };
};
