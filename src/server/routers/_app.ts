import { router } from "../trpc";
import { auth } from "./auth";
import { tweet } from "./tweet";

export const appRouter = router({
  auth,
  tweet,
});

export type AppRouter = typeof appRouter;
