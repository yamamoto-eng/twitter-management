import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useTwitterProfile } from "@/hooks/useTwitterProfile";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export const Header = () => {
  const router = useRouter();
  const { twitterProfile, setTwitterProfile } = useTwitterProfile();
  const { mutateAsync } = trpc.auth.logout.useMutation();

  const logout = async () => {
    const { success } = await mutateAsync();
    if (success) {
      setTwitterProfile({ isLogin: false });
      router.reload();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {twitterProfile?.isLogin && (
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <Menu />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TM
          </Typography>

          {twitterProfile?.isLogin && (
            <>
              <div>
                <Typography>{twitterProfile.name}</Typography>
                <Typography>{`@${twitterProfile.userName}`}</Typography>
              </div>
              <Avatar src={twitterProfile.image} />
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
