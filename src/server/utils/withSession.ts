import { sessionOptions } from "@/libs/session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next";

export const withSessionApi = (handler: NextApiHandler) => withIronSessionApiRoute(handler, sessionOptions);

export const withSessionSsr = <T extends { [key: string]: unknown } = {}>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<T> | Promise<GetServerSidePropsResult<T>>
) => withIronSessionSsr(handler, sessionOptions);
