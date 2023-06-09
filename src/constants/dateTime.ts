export const DATE_TYPE = {
  DAY: "day",
  DAY_OF_WEEK: "dayOfWeek",
} as const;

export const DATE_TYPE_LABEL: Record<(typeof DATE_TYPE)[keyof typeof DATE_TYPE], string> = {
  [DATE_TYPE.DAY]: "日単位",
  [DATE_TYPE.DAY_OF_WEEK]: "曜日",
} as const;

// for dayjs
export const DAY_OF_WEEK = {
  SUM: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
} as const;

export const DAY_OF_WEEK_LABEL: Record<(typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK], string> = {
  [DAY_OF_WEEK.SUM]: "日",
  [DAY_OF_WEEK.MON]: "月",
  [DAY_OF_WEEK.TUE]: "火",
  [DAY_OF_WEEK.WED]: "水",
  [DAY_OF_WEEK.THU]: "木",
  [DAY_OF_WEEK.FRI]: "金",
  [DAY_OF_WEEK.SAT]: "土",
} as const;

export const DAY = {
  DAY_ONE: 1,
  DAY_TWO: 2,
  DAY_THREE: 3,
  DAY_FOUR: 4,
  DAY_FIVE: 5,
  DAY_SIX: 6,
  WEEK_ONE: 7,
  WEEK_TWO: 14,
  WEEK_THREE: 21,
  WEEK_FOUR: 28,
} as const;

export const DAY_LABEL: Record<(typeof DAY)[keyof typeof DAY], string> = {
  [DAY.DAY_ONE]: "毎日",
  [DAY.DAY_TWO]: "2日",
  [DAY.DAY_THREE]: "3日",
  [DAY.DAY_FOUR]: "4日",
  [DAY.DAY_FIVE]: "5日",
  [DAY.DAY_SIX]: "6日",
  [DAY.WEEK_ONE]: "1週間",
  [DAY.WEEK_TWO]: "2週間",
  [DAY.WEEK_THREE]: "3週間",
  [DAY.WEEK_FOUR]: "4週間",
} as const;
