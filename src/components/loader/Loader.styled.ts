import { keyframes, styled } from "styled-components";

// Keyframe animation for the loader spinning
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoaderStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  .spinner {
    border: 8px solid rgba(255, 255, 255, 0.5);
    border-top: 8px solid ${({ theme }) => theme.border};
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: ${spin} 1.5s linear infinite;
  }
`;
