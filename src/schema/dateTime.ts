import { z } from "zod";

export const time = z.object({
  min: z.number(),
  hour: z.number(),
});

export const dayOfWeek = z.union([
  z.literal("SUN"),
  z.literal("MON"),
  z.literal("TUE"),
  z.literal("WED"),
  z.literal("THU"),
  z.literal("FRI"),
  z.literal("SAT"),
]);

export type Time = z.infer<typeof time>;
export type DayOfWeek = z.infer<typeof dayOfWeek>;
