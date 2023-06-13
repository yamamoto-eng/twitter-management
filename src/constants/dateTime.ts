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
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  ELEVEN: 11,
  TWELVE: 12,
  THIRTEEN: 13,
  FOURTEEN: 14,
  FIFTEEN: 15,
  SIXTEEN: 16,
  SEVENTEEN: 17,
  EIGHTEEN: 18,
  NINETEEN: 19,
  TWENTY: 20,
  TWENTY_ONE: 21,
  TWENTY_TWO: 22,
  TWENTY_THREE: 23,
  TWENTY_FOUR: 24,
  TWENTY_FIVE: 25,
  TWENTY_SIX: 26,
  TWENTY_SEVEN: 27,
  TWENTY_EIGHT: 28,
} as const;
