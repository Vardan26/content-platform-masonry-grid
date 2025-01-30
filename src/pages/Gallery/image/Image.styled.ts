import styled from "styled-components";

type Props = {
  src: string;
};

export const ImageStyled = styled.div<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  background-color: ${({ theme }) => theme.headerBg};

  &.wide {
    grid-column: span 2;
  }

  &.tall {
    grid-row: span 2;
  }

  &.big {
    grid-column: span 2;
    grid-row: span 2;
  }

  &.small {
    grid-column: span 1;
    grid-row: span 1;
  }
`;
