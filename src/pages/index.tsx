import { withSessionSsr } from "@/server/utils/withSession";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  isAuth: boolean;
};

const Index: NextPage<Props> = (props) => {
  const { isAuth } = props;
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
    }
    // eslint-disable-next-line
  }, []);

  return <div>top</div>;
};

export default Index;

export const getServerSideProps = withSessionSsr<Props>(async (ctx) => {
  const isAuth = !!ctx.req.session.accessToken;

  return { props: { isAuth } };
});
