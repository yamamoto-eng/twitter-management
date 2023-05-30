import { sessionOptions } from "@/libs";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getIronSession } from "iron-session";

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getIronSession(opts.req, opts.res, sessionOptions);

  return {
    session,
    req: opts.req,
    res: opts.res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
