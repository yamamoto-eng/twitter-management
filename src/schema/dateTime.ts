import { DAY_OF_WEEK } from "@/constants";
import { z } from "zod";

export const dayOfWeek = z.nativeEnum(DAY_OF_WEEK);

export type DayOfWeek = z.infer<typeof dayOfWeek>;
