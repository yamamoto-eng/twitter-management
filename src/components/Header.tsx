import { AppBar, Avatar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useUserInfoWithStorage } from "@/hooks/useUserInfoWithStorage";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { PAGES } from "@/constants";
import { FC } from "react";
import { notification } from "@/utils/notification";

export const Header: FC = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUserInfoWithStorage();
  const { mutateAsync: loginMutateAsync } = trpc.auth.login.useMutation();
  const { mutateAsync: logoutMutateAsync } = trpc.auth.logout.useMutation();

  const login = async () => {
    const { authorizeURL } = await loginMutateAsync();
    router.replace(authorizeURL);
  };

  const logout = async () => {
    const { success } = await logoutMutateAsync();
    if (success) {
      setUserInfo({ isLogin: false });
      notification("ログアウトしました");
      router.replace(PAGES.LOGIN);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography component="div" sx={{ flexGrow: 1 }}>
            <Button color="inherit" onClick={() => router.push(PAGES.HOME)}>
              TM
            </Button>
          </Typography>

          {!userInfo.isLogin && (
            <Button color="inherit" onClick={login}>
              Login
            </Button>
          )}

          {userInfo.isLogin && (
            <>
              <div>
                <Typography>{userInfo.name}</Typography>
                <Typography>{`@${userInfo.userName}`}</Typography>
              </div>
              <Avatar src={userInfo.image} />
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
