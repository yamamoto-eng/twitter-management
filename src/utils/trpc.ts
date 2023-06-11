import { TWITTER_CONFIG } from "@/constants";
import { AppRouter } from "@/server/routers/_app";
import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";

  console.log("TWITTER_CONFIG.CLIENT_ID", TWITTER_CONFIG.CLIENT_ID);
  console.log("TWITTER_CONFIG.REDIRECT_URL", TWITTER_CONFIG.REDIRECT_URL);
  return process.env.BASE_URL;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: false,
            cacheTime: Infinity,
            // TODO: useErrorBoundary
          },
          mutations: {
            retry: false,
            // TODO: useErrorBoundary
          },
        },
      },
    };
  },
});
