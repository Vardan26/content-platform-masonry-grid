import React from "react";
import { HeaderStyled } from "./Header.styled";
import { useTheme } from "../../theme";
import { Moon, Sun } from "lucide-react";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <HeaderStyled>
      <span className="logo">Logo</span>
      <span onClick={toggleTheme} className="theme-switcher">
        {theme !== "light" ? <Sun /> : <Moon />}
      </span>
    </HeaderStyled>
  );
};
