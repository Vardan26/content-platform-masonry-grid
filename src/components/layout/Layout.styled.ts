import styled from "styled-components";

export const LayoutStyled = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;

  .main {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
  }
`;
