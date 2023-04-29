import { z } from "zod";
import { procedure, router } from "../trpc";
import { auth } from "./auth";

export const appRouter = router({
  auth,
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
