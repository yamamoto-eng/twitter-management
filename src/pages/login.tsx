import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const router = useRouter();
  const { mutateAsync } = trpc.auth.login.useMutation();

  const login = async () => {
    const res = await mutateAsync();
    router.push(res.redirectUrl);
  };

  return (
    <div>
      <button onClick={login}>login</button>
    </div>
  );
};

export default Login;
