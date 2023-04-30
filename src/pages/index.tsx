import { trpc } from "@/utils/trpc";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const Index: NextPage = () => {
  const router = useRouter();
  const { data } = trpc.auth.check.useQuery();
  const { mutateAsync } = trpc.auth.login.useMutation();

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

  const login = async () => {
    const res = await mutateAsync();
    router.push(res.redirectUrl);
  };

  if (!data?.isAuth) {
    return (
      <div>
        <button onClick={login}>login</button>
      </div>
    );
  }

  return (
    <div>
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
