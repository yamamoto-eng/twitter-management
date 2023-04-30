import { trpc } from "@/utils/trpc";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Index: NextPage = () => {
  const router = useRouter();
  const { data } = trpc.auth.check.useQuery(undefined, {
    onSuccess: (data) => {
      if (!data?.isAuth) {
        router.push("/login");
      }
    },
  });

  const { mutateAsync } = trpc.auth.logout.useMutation();

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

  const logout = async () => {
    const { success } = await mutateAsync();
    if (success) {
      router.reload();
    }
  };

  if (!data?.isAuth) {
    return <></>;
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
