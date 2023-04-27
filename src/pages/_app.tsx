import { Layout } from "@/components/Layout";
import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { AppType } from "next/app";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default trpc.withTRPC(App);
