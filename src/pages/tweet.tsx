import axios from "axios";
import { NextPage } from "next";
import { useState } from "react";

const Post: NextPage = () => {
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

  return (
    <>
      <label>
        text
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <br />
        <button onClick={tweet}>tweet</button>
      </label>
    </>
  );
};

export default Post;
