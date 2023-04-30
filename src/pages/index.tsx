import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const Index: NextPage = () => {
  const router = useRouter();
  const { mutateAsync } = trpc.auth.logout.useMutation();
  const { mutateAsync: tweetMutateAsync } = trpc.twitter.tweet.useMutation();
  const { data } = trpc.auth.check.useQuery(undefined, {
    onSuccess: (data) => {
      if (!data?.isAuth) {
        router.push("/login");
        return;
      }
    },
  });

  const [text, setText] = useState("");

  const tweet = async () => {
    try {
      const { success } = await tweetMutateAsync({ text });
      if (success) {
        setText("");
        return;
      }
    } catch {}
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
