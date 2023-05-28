import { FC, MouseEvent, PropsWithChildren, ReactNode } from "react";
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
import { Create } from "@mui/icons-material";
import { Footer } from "./Footer";
import { useRouter } from "next/router";
import { PAGES } from "@/constants";

const drawerWidth = 240;

export const Layout: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const router = useRouter();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Header />
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
            <Item label="Tweet" icon={<Create />} onClick={() => router.push(PAGES.TWEET)} />
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

type ItemProps = {
  label: string;
  icon: ReactNode;
  onClick: (e: MouseEvent<HTMLLIElement>) => void;
};

const Item: FC<ItemProps> = ({ label, icon, onClick }) => {
  return (
    <ListItem disablePadding onClick={onClick}>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};
