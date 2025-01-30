import styled from "styled-components";

export const HeaderStyled = styled.header`
  background-color: ${({ theme }) => theme.headerBg};
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => "0px 4px 5px rgba(0, 0, 0, 0.1)"};

  .theme-switcher {
    cursor: pointer;
    padding: 0.5rem;
    transition: transform 0.3s ease;
  }

  .theme-switcher:hover {
    transform: scale(1.1);
  }

  .logo {
    font-size: 1.8rem;
    font-weight: bold;
  }
`;
