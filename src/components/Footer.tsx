import { AppBar, Box, Toolbar } from "@mui/material";

export const Footer = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>footer</Toolbar>
      </AppBar>
    </Box>
  );
};
