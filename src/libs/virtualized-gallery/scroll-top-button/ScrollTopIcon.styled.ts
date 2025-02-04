import styled from "styled-components";

export const ScrollTopIconStyled = styled.div`
  position: absolute;
  bottom: 30px;
  right: 40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(27, 37, 41, 0.6);
  color: white;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: #1b2529;
    transform: scale(1.1);
  }
`;
