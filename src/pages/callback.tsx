import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { withSessionSsr } from "@/server/utils/withSession";

const Callback: NextPage = () => {
  const router = useRouter();

  const callback = async () => {
    await axios("/api/callback")
      .then((res) => {
        router.push("/");
      })
      // TODO: error画面に遷移
      .catch((err) => {
        console.log("error");
      });
  };

  useEffect(() => {
    callback();
    // eslint-disable-next-line
  }, []);

  return <></>;
};

export const getServerSideProps = withSessionSsr(async (ctx) => {
  const { query } = ctx;

  if (ctx.req.session.state !== query.state) {
    return {
      // TODO: error画面に遷移
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const code = query.code as string;
  ctx.req.session.code = code;
  await ctx.req.session.save();

  return { props: {} };
});

export default Callback;
