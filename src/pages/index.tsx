import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const Index: NextPage = () => {
  const router = useRouter();
  const { mutateAsync } = trpc.auth.logout.useMutation();
  const { mutateAsync: tweetMutateAsync } = trpc.twitter.tweet.useMutation();
  const { data: meData } = trpc.twitter.me.useQuery();
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

  if (!data?.isAuth || !meData) {
    return <></>;
  }

  return (
    <div>
      <div style={{ border: "1px solid lightblue" }}>
        <p>{meData.name}</p>
        <p>{`@${meData.userName}`}</p>
        <Image src={meData.image ?? ""} alt="profile image" width={80} height={80} />
      </div>
      <br />
      <button onClick={logout}>logout</button>
      <br />
      <button onClick={tweet}>tweet</button>
      <input id="tweet" value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
};

export default Index;
