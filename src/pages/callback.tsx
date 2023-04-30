import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";

type PageProps = {
  state: string;
  code: string;
};

const Callback: NextPage<PageProps> = ({ state, code }) => {
  const router = useRouter();
  const { mutateAsync } = trpc.auth.callback.useMutation();

  const callback = async () => {
    const { success } = await mutateAsync({ state, code });
    if (success) {
      router.push("/");
    }
    router.push("/login");
  };

  useEffect(() => {
    callback();
    // eslint-disable-next-line
  }, []);

  return <></>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const { query } = ctx;

  return {
    props: {
      state: query.state as string,
      code: query.code as string,
    },
  };
};

export default Callback;
