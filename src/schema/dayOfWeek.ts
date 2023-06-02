import { z } from "zod";

export const dayOfWeek = z.union([
  z.literal("SUN"),
  z.literal("MON"),
  z.literal("TUE"),
  z.literal("WED"),
  z.literal("THU"),
  z.literal("FRI"),
  z.literal("SAT"),
]);

export type DayOfWeek = z.infer<typeof dayOfWeek>;
