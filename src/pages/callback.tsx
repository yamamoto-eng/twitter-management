import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useEffectOnce } from "react-use";
import { useTwitterProfile } from "@/hooks/useTwitterProfile";

type PageProps = {
  state: string;
  code: string;
};

const Callback: NextPage<PageProps> = ({ state, code }) => {
  const router = useRouter();
  const { mutateAsync } = trpc.auth.callback.useMutation();
  const { setTwitterProfile } = useTwitterProfile();

  const callback = async () => {
    try {
      const data = await mutateAsync({ state, code });
      if (data.success) {
        setTwitterProfile({
          isLogin: true,
          name: data.name,
          userName: data.userName,
          image: data.image,
        });

        router.reload();

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
