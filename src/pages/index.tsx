import { withSessionSsr } from "@/server/utils/withSession";
import { trpc } from "@/utils/trpc";
import axios from "axios";
import { NextPage } from "next";
import { useState } from "react";

type Props = {
  isAuth: boolean;
};

const Index: NextPage<Props> = (props) => {
  const { isAuth } = props;
  const { data } = trpc.hello.useQuery({ text: "sample" });

  const [text, setText] = useState("");

  const tweet = () => {
    axios
      .post("/api/tweet", { text })
      .then((res) => {
        setText("");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const logout = () => {
    axios
      .post("/api/logout")
      .then(() => {})
      .catch((e) => {
        console.error(e);
      });
  };

  if (!isAuth) {
    return (
      // TODO: APIで呼び出したい
      <form action="/api/login" method="post">
        <button type="submit">login</button>
      </form>
    );
  }

  return (
    <div>
      {data?.greeting}
      <form action="/api/login" method="post">
        <button type="submit">login</button>
      </form>
      <button onClick={logout}>logout</button>
      <br />
      <label htmlFor="tweet">text</label>
      <input id="tweet" value={text} onChange={(e) => setText(e.target.value)} />
      <br />
      <button onClick={tweet}>tweet</button>
    </div>
  );
};

export default Index;

// export const getServerSideProps = withSessionSsr<Props>(async (ctx) => {
//   const isAuth = !!ctx.req.session.accessToken;

//   return { props: { isAuth } };
// });

export const getServerSideProps = () => {
  const isAuth = true;

  return { props: { isAuth } };
};
