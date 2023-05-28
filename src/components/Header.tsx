import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useUserInfoWithStorage } from "@/hooks/useUserInfoWithStorage";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { PAGES } from "@/constants";

export const Header = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUserInfoWithStorage();
  const { mutateAsync } = trpc.auth.logout.useMutation();

  const logout = async () => {
    const { success } = await mutateAsync();
    if (success) {
      setUserInfo({ isLogin: false });
      router.replace(PAGES.LOGIN);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {userInfo?.isLogin && (
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <Menu />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TM
          </Typography>

          {userInfo?.isLogin && (
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
