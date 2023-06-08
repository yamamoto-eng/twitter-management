import { DATE_INTERVAL, DAY_OF_WEEK } from "@/constants";
import { z } from "zod";

export const dayOfWeek = z.nativeEnum(DAY_OF_WEEK);
export const dateInterval = z.nativeEnum(DATE_INTERVAL);

export type DayOfWeek = z.infer<typeof dayOfWeek>;
export type DateInterval = z.infer<typeof dateInterval>;
