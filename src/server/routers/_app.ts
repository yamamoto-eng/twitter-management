import { GetServerSidePropsContext } from "next";
import { router } from "../trpc";
import { auth } from "./auth";
import { scheduledTweet } from "./scheduledTweet";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createHelperContext } from "../context";
import superjson from "superjson";

export const appRouter = router({
  auth,
  scheduledTweet,
});

export type AppRouter = typeof appRouter;

export const trpcHelper = async (ctx: GetServerSidePropsContext) => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: await createHelperContext(ctx),
    transformer: superjson,
  });
};
