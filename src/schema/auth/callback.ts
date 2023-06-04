import { z } from "zod";

export const input = z.object({
  state: z.string(),
  code: z.string(),
});

export const output = z
  .object({
    success: z.literal(true),
    name: z.string(),
    userName: z.string(),
    image: z.string(),
  })
  .or(
    z.object({
      success: z.literal(false),
    })
  );
