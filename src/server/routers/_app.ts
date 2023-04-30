import { router } from "../trpc";
import { auth } from "./auth";
import { twitter } from "./twitter";

export const appRouter = router({
  auth,
  twitter,
});

export type AppRouter = typeof appRouter;
