import { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <div>
      header
      {children}
      footer
    </div>
  );
};
