import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { useState } from "react";

const Index: NextPage = () => {
  const { mutateAsync } = trpc.twitter.tweet.useMutation();

  const [text, setText] = useState("");

  const tweet = async () => {
    try {
      const { success } = await mutateAsync({ text });

      if (success) {
        setText("");
        return;
      }
    } catch {}
  };

  return (
    <div>
      test
      <button onClick={tweet}>tweet</button>
      <input id="tweet" value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
};

export default Index;
