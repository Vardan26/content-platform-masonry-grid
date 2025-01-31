import React, { useMemo, useState } from "react";
import { HeaderStyled } from "./Header.styled";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "../../helpers";
import { useSearch } from "../../contexts/SearchContext";

export const Header = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  const [inputValue, setInputValue] = useState(searchQuery);

  const { theme, toggleTheme } = useTheme();
  const { id } = useParams<{ id: string }>();

  const debouncedSetQuery = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 1000),
    [setSearchQuery]
  );
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setInputValue(newQuery);

    debouncedSetQuery(newQuery);
  };

  return (
    <HeaderStyled>
      {id ? (
        <span onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={24} />
        </span>
      ) : (
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search photos..."
            onChange={handleSearchChange}
            className="search-input"
            value={inputValue}
          />
        </div>
      )}
      <span onClick={toggleTheme} className="theme-switcher">
        {theme !== "light" ? <Sun /> : <Moon />}
      </span>
    </HeaderStyled>
  );
};
