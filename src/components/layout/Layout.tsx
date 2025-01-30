import React from "react";
import { LayoutStyled } from "./Layout.styled";
import { useTheme } from "../../theme";
import { Moon, Sun } from "lucide-react";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <LayoutStyled>
      {children}
      <span onClick={toggleTheme} className="theme-switcher">
        {theme !== "light" ? <Sun /> : <Moon />}
      </span>
    </LayoutStyled>
  );
};
