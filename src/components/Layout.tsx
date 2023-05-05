import { FC, PropsWithChildren } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <main style={{height:"100%"}}>{children}</main>
      <Footer/>
    </div>
  );
};
