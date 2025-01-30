import styled from "styled-components";

export const LayoutStyled = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;

  .theme-switcher {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    transition: transform 0.3s ease;
  }

  .theme-switcher:hover {
    transform: scale(1.1);
  }
`;
