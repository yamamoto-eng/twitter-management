import { sessionOptions } from "@/libs";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { IronSession, getIronSession } from "iron-session";
import { GetServerSidePropsContext } from "next";

type CreateInnerContextOptions = {
  session: IronSession;
};

const createContextInner = (opts: CreateInnerContextOptions) => {
  return {
    session: opts.session,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getIronSession(opts.req, opts.res, sessionOptions);
  const contextInner = createContextInner({ session });

  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
};

export const createHelperContext = async (opts: GetServerSidePropsContext) => {
  const session = await getIronSession(opts.req, opts.res, sessionOptions);
  const contextInner = createContextInner({ session });

  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
};

export type Context = inferAsyncReturnType<typeof createContextInner>;
