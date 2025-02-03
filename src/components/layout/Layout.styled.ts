import styled from "styled-components";

export const LayoutStyled = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all 0.1s ease-in-out;
  overflow: hidden;
`;
