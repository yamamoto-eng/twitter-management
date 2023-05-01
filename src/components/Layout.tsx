import { FC, PropsWithChildren } from "react";
import { Header } from "./Header";

export const Layout: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <div>
      <Header />
      {children}
      footer
    </div>
  );
};
