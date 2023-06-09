import { DATE_TYPE, DAY, DAY_OF_WEEK } from "@/constants";
import { z } from "zod";

const dayInterval = z.object({
  type: z.literal(DATE_TYPE.DAY),
  day: z.nativeEnum(DAY),
});

const dayOfWeekInterval = z.object({
  type: z.literal(DATE_TYPE.DAY_OF_WEEK),
  dayOfWeek: z.nativeEnum(DAY_OF_WEEK),
});

export const interval = z.union([dayInterval, dayOfWeekInterval]);

export type Interval = z.infer<typeof interval>;
