import React from "react";
import { LayoutStyled } from "./Layout.styled";
import { Header } from "../header";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LayoutStyled>
      <>
        <Header />
        {children}
      </>
    </LayoutStyled>
  );
};
