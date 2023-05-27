import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useEffectOnce } from "react-use";
import { useUserInfoWithStorage } from "@/hooks/useUserInfoWithStorage";

type PageProps = {
  state: string;
  code: string;
};

const Callback: NextPage<PageProps> = ({ state, code }) => {
  const router = useRouter();
  const { mutateAsync } = trpc.auth.callback.useMutation();
  const { setUserInfo } = useUserInfoWithStorage();

  const callback = async () => {
    try {
      const data = await mutateAsync({ state, code });
      if (data.success) {
        setUserInfo({
          isLogin: true,
          name: data.name,
          userName: data.userName,
          image: data.image,
        });

        router.replace("/");

        return;
      }

      router.replace("/login");
    } catch {}
  };

  useEffectOnce(() => {
    callback();
  });

  return <>Login...</>;
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
