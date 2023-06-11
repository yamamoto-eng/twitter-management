import { Layout } from "@/components/Layout";
import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { AppType } from "next/app";
import React from "react";
import { RecoilRoot } from "recoil";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja";
import { SnackbarProvider } from "notistack";
import { Loading } from "@/components/Loading";
import { useIsMutating, useIsFetching } from "@tanstack/react-query";
import { useIsRouting } from "@/hooks/useIsRouting";

dayjs.extend(utc);
dayjs.locale("ja");

type Props = {};

const App: AppType<Props> = ({ Component, pageProps }) => {
  const isMutating = useIsMutating();
  const isFetching = useIsFetching();
  const { isRouting } = useIsRouting();

  return (
    <RecoilRoot>
      <SnackbarProvider>
        {(!!isMutating || !!isFetching || isRouting) && <Loading />}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SnackbarProvider>
    </RecoilRoot>
  );
};

const AppWithTRPC = trpc.withTRPC(App);

export default AppWithTRPC;
