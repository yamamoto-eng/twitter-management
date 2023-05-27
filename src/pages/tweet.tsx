import { NextPage } from "next";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const router = useRouter();

  return (
    <div>
      tweet
      <button onClick={() => router.push("/")}>go to home</button>
    </div>
  );
};

export default Page;
