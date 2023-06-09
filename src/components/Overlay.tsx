import { Container } from "@mui/material";
import React, { FC, PropsWithChildren } from "react";

export const Overlay: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      {children}
    </Container>
  );
};
