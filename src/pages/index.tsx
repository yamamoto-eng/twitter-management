import { NextPage } from "next";
import { useRouter } from "next/router";

const Index: NextPage = () => {
  const router = useRouter();

  return (
    <div>
      home
      <button onClick={() => router.push("/tweet")}>go to tweet</button>
    </div>
  );
};

export default Index;
