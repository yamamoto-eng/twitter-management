import { ComponentProps, FC, PropsWithChildren, ReactNode } from "react";
import { Header } from "./Header";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Create from "@mui/icons-material/Create";
import { Footer } from "./Footer";
import { PAGES } from "@/constants";
import { useUserInfoWithStorage } from "@/hooks/useUserInfoWithStorage";
import Link from "next/link";

const drawerWidth = 240;

export const Layout: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const { userInfo } = useUserInfoWithStorage();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Header />
      {userInfo.isLogin && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <Item href={PAGES.TWEET} label="Tweet" icon={<Create />} />
            </List>
            <Divider />
          </Box>
        </Drawer>
      )}
      <Box component="main" sx={{ p: 10, width: "100%", marginTop: "64px", overflow: "auto" }}>
        {children}
      </Box>
    </Box>
  );
};

type ItemProps = {
  label: string;
  icon: ReactNode;
  href: ComponentProps<typeof Link>["href"];
};

const Item: FC<ItemProps> = ({ label, icon, href }) => {
  return (
    <Link href={href} shallow>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};
