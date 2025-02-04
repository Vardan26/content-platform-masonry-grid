import React, { useEffect, useMemo, useRef, useState } from "react";
import { HeaderStyled } from "./Header.styled";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun, ArrowLeft, XIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";
import { debounce } from "lodash";

export const Header = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { searchQuery, setSearchQuery } = useSearch();
  const [inputValue, setInputValue] = useState(searchQuery);

  const { theme, toggleTheme } = useTheme();
  const { id } = useParams<{ id: string }>();

  const debouncedSetQuery = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 500),
    [setSearchQuery]
  );

  useEffect(() => {
    debouncedSetQuery(inputValue);
  }, [debouncedSetQuery, inputValue]);

  const onClear = () => {
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <HeaderStyled>
      {id ? (
        <span onClick={() => navigate(`/`)} className="back-button">
          <ArrowLeft size={24} />
        </span>
      ) : (
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search photos..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            className="search-input"
            value={inputValue}
            ref={inputRef}
          />
          {searchQuery ? (
            <XIcon onClick={onClear} size={16} className="clear-button" />
          ) : null}
        </div>
      )}
      <span onClick={toggleTheme} className="theme-switcher">
        {theme !== "light" ? <Sun /> : <Moon />}
      </span>
    </HeaderStyled>
  );
};
