import styled from "styled-components";

type Props = {
  src: string;
};

export const ImageStyled = styled.div<Props>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 16px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  background-color: ${({ theme }) => theme.headerBg};
  border: 8px solid ${({ theme }) => theme.background};
  box-sizing: border-box;
  cursor: pointer;
`;
