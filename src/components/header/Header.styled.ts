import styled from "styled-components";

export const HeaderStyled = styled.header`
  background-color: ${({ theme }) => theme.headerBg};
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.1);

  .theme-switcher {
    cursor: pointer;
    padding: 0.5rem;
    transition: transform 0.3s ease;
  }

  .theme-switcher:hover {
    transform: scale(1.1);
  }

  .search-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 50%;
    border-radius: 8px;
    overflow: hidden;
    background-color: ${({ theme }) => theme.background};
    padding: 8px 12px;
    transition: 0.3s ease-in-out;
    margin: 0 auto;
  }

  .search-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;
    color: ${({ theme }) => theme.text};
  }

  .back-button {
    cursor: pointer;
  }
`;
