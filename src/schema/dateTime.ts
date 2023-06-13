import { DATE_TYPE, DAY, DAY_OF_WEEK } from "@/constants";
import { z } from "zod";

export const day = z.nativeEnum(DAY);
const dayOfWeek = z.nativeEnum(DAY_OF_WEEK);

const dayInterval = z.object({
  type: z.literal(DATE_TYPE.DAY),
  day,
});

const dayOfWeekInterval = z.object({
  type: z.literal(DATE_TYPE.DAY_OF_WEEK),
  dayOfWeek,
});

export const interval = z.union([dayInterval, dayOfWeekInterval]);

export type Day = z.infer<typeof day>;
export type Interval = z.infer<typeof interval>;
