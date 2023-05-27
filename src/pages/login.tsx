import { trpc } from "@/utils/trpc";
import { Button } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const router = useRouter();
  const { mutateAsync } = trpc.auth.login.useMutation();

  const login = async () => {
    const res = await mutateAsync();
    router.replace(res.authorizeURL);
  };

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Button size="large" variant="contained" onClick={login}>
        login
      </Button>
    </div>
  );
};

export default Login;
