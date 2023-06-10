import { Backdrop } from "@mui/material";
import React, { FC, PropsWithChildren } from "react";

export const Overlay: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Backdrop sx={{ backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: (theme) => theme.zIndex.drawer + 101 }} open>
      {children}
    </Backdrop>
  );
};
