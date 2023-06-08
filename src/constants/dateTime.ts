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

export const DATE_INTERVAL = {
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

export const DATE_INTERVAL_LABEL: Record<(typeof DATE_INTERVAL)[keyof typeof DATE_INTERVAL], string> = {
  [DATE_INTERVAL.DAY_ONE]: "毎日",
  [DATE_INTERVAL.DAY_TWO]: "2日",
  [DATE_INTERVAL.DAY_THREE]: "3日",
  [DATE_INTERVAL.DAY_FOUR]: "4日",
  [DATE_INTERVAL.DAY_FIVE]: "5日",
  [DATE_INTERVAL.DAY_SIX]: "6日",
  [DATE_INTERVAL.WEEK_ONE]: "1週間",
  [DATE_INTERVAL.WEEK_TWO]: "2週間",
  [DATE_INTERVAL.WEEK_THREE]: "3週間",
  [DATE_INTERVAL.WEEK_FOUR]: "4週間",
} as const;
