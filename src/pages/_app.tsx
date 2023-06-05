import { Layout } from "@/components/Layout";
import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { getIronSession } from "iron-session";
import { AppType } from "next/app";
import { NextPageContext } from "next/dist/shared/lib/utils";
import { sessionOptions } from "@/libs";
import React from "react";
import { RecoilRoot } from "recoil";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja";
import { SnackbarProvider } from "notistack";

dayjs.extend(utc);
dayjs.locale("ja");

type Props = {};

const App: AppType<Props> = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <SnackbarProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SnackbarProvider>
    </RecoilRoot>
  );
};

const AppWithTRPC = trpc.withTRPC(App);

AppWithTRPC.getInitialProps = async (props): Promise<{ pageProps: Props }> => {
  // HACK: withTRPCでラップすると内部構造が変わる
  const ctx = (props as any).ctx as NextPageContext;
  const { req, res } = ctx;

  let pageProps = {};

  if (req && res) {
    await getIronSession(req, res, sessionOptions);
  }

  return {
    pageProps,
  };
};

export default AppWithTRPC;
